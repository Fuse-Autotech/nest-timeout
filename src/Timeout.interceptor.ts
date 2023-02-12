import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ITimeoutInterceptorOptions } from './types';
import { getMetaDataKey, isNil } from './internal/utils';
import { CLASS_INDICATOR } from './constants';
import { timeoutIf } from './internal/TimeoutIf.operator';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
	private readonly reflector = new Reflector();

	constructor(private readonly options: ITimeoutInterceptorOptions = { defaultTimeout: 0 }) {}

	private getDecoratorTimeout(controllerName: string, context: ExecutionContext): number | undefined {
		const methodName = context.getHandler().name;
		const timeout = this.reflector.get<number>(getMetaDataKey(controllerName, methodName), context.getHandler());

		return timeout ?? this.reflector.get<number>(getMetaDataKey(controllerName, CLASS_INDICATOR), context.getClass());
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		let { isEnabled } = this.options;
		const controllerName = (context as any).constructorRef.name;
		let timeout = this.getDecoratorTimeout(controllerName, context);

		if (!isNil(timeout)) {
			isEnabled = timeout > 0;
		} else {
			timeout = this.options.defaultTimeout;
		}

		return next.handle().pipe(timeoutIf(isEnabled, timeout));
	}
}

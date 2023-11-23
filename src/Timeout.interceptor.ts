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
		let { isEnabled = true } = this.options;
		const { callback } = this.options;
		const controllerName = context.getClass().name;
		const handlerName = context.getHandler().name;
		const time = this.getDecoratorTimeout(controllerName, context) ?? this.options.defaultTimeout;

		// If timeout is not defined or equal to zero (0)
		if (isNil(time) || time <= 0) {
			isEnabled = false;
		}

		return next.handle().pipe(timeoutIf({ isEnabled, time, controllerName, handlerName, callback }));
	}
}

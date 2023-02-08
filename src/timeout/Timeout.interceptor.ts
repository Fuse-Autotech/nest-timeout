import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, OperatorFunction, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ITimeoutInterceptorOptions } from './types';
import { getMetaDataKey, isNil } from './utils';
import { CLASS_INDICATOR } from './constants';

const timeoutIf = (
  shouldTimeout: boolean,
  time: number,
): OperatorFunction<any, any> => {
  return (source: Observable<any>): Observable<any> =>
    shouldTimeout
      ? source.pipe(
          timeout(time),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }

            return throwError(err);
          }),
        )
      : source;
};

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly options: ITimeoutInterceptorOptions = {
    isEnabled: true,
    defaultTimeout: 10 * 1000,
  };
  private readonly reflector = new Reflector();

  constructor(private injectedOptions?: ITimeoutInterceptorOptions) {
    this.options = { ...this.options, ...injectedOptions };
  }

  private getDecoratorTimeout(
    controllerName: string,
    context: ExecutionContext,
  ): number | undefined {
    const methodName = context.getHandler().name;

    const timeout = this.reflector.get<number>(
      getMetaDataKey(controllerName, methodName),
      context.getHandler(),
    );

    return (
      timeout ??
      this.reflector.get<number>(
        getMetaDataKey(controllerName, CLASS_INDICATOR),
        context.getClass(),
      )
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { defaultTimeout } = this.options;
    let { isEnabled } = this.options;

    const controllerName = (context as any).constructorRef.name;
    let timeout = this.getDecoratorTimeout(controllerName, context);

    if (!isNil(timeout)) {
      isEnabled = timeout > 0;
    } else {
      timeout = defaultTimeout;
    }

    return next.handle().pipe(timeoutIf(isEnabled, timeout));
  }
}

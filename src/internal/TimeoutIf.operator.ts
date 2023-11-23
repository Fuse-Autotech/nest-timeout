import { Observable, OperatorFunction, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RequestTimeoutException } from '@nestjs/common';
import { ITimeoutIf } from './types';

export const timeoutIf = ({ isEnabled, time, controllerName, handlerName, callback }: ITimeoutIf): OperatorFunction<any, any> => {
	return (source: Observable<any>): Observable<any> =>
		isEnabled
			? source.pipe(
					timeout(time),
					catchError((err) => {
						if (err instanceof TimeoutError) {
							callback?.(controllerName, handlerName);

							return throwError(new RequestTimeoutException());
						}

						return throwError(err);
					})
			  )
			: source;
};

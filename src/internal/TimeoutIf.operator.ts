import { Observable, OperatorFunction, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RequestTimeoutException } from '@nestjs/common';

export const timeoutIf = (shouldTimeout: boolean, time: number): OperatorFunction<any, any> => {
	return (source: Observable<any>): Observable<any> =>
		shouldTimeout
			? source.pipe(
					timeout(time),
					catchError((err) => {
						if (err instanceof TimeoutError) {
							return throwError(new RequestTimeoutException());
						}

						return throwError(err);
					})
			  )
			: source;
};

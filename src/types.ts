import { HttpStatus } from '@nestjs/common';

export interface ITimeoutInterceptorOptions {
	defaultTimeout: number;
	isEnabled?: boolean;
}

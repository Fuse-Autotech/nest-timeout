import { HttpStatus } from '@nestjs/common';

export interface ITimeoutInterceptorOptions {
	defaultTimeout: number;
	isEnabled?: boolean;
}

export interface TestOptions {
	title: string;
	options: ITimeoutInterceptorOptions[];
	addSleepTime?: boolean;
	controllerPath: string;
	restMethod: string[];
	responseStatus: HttpStatus[];
	sleepTime: number;
	timeoutBorder: number[];
	overrideWithSmallerValue?: boolean;
	skip: boolean;
}

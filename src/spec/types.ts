import { ITimeoutInterceptorOptions } from 'src/types';
import { HttpStatus } from '@nestjs/common';

export const TIMEOUT_VALUES = {
	noTimeout: 0,
	requestRTT: 50, // RoundTripTime, approx. request time without delays, tested in debug. Can fail on other machines.
	test100ms: 100,
	timeout500ms: 500,
	test1000ms: 1000,
	test2000ms: 2000,
	test3000ms: 3000,
	test5000ms: 5000,
	defaultTimeout: 10 * 1000,
	testOverrideSmallerDefault75ms: 75,
};

export interface IGlobalTestCase {
	title: string;
	options: ITimeoutInterceptorOptions;
	shouldTimeout: boolean;
	addSleepTime: boolean;
}

export interface IDecoratorTestCase {
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

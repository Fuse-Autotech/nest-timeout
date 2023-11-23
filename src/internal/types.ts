import { ITimeoutCallback } from '../types';

export interface ITimeoutIf {
	isEnabled: boolean;
	time: number;
	controllerName: string;
	handlerName: string;
	callback?: ITimeoutCallback;
}

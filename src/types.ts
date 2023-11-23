export type ITimeoutCallback = (controllerName: string, handlerName: string) => void;

export interface ITimeoutInterceptorOptions {
	defaultTimeout: number;
	isEnabled?: boolean;
	callback?: ITimeoutCallback;
}

export interface ITimeoutOverride {
	timeout: number;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface ITimeoutInterceptorOptions {
	defaultTimeout: number;
	isEnabled?: boolean;
}

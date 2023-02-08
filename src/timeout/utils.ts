export const getMetaDataKey = (controllerName: string, methodName: string): string => `timeout-${controllerName}-${methodName}:metadata`;

export const isNil = (value: unknown): boolean => {
	return value === null || value === undefined;
};

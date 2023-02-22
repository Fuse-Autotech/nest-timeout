import { CLASS_INDICATOR } from './constants';
import { getMetaDataKey } from './internal/utils';

export const Timeout = (timeout: number): MethodDecorator & ClassDecorator => {
	return (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
		let controllerName;
		let methodName;

		if (propertyKey) {
			controllerName = target.constructor.name;

			methodName = propertyKey;
		} else {
			controllerName = target.name;

			methodName = CLASS_INDICATOR;
		}

		const metaDataKey = getMetaDataKey(controllerName, methodName);

		// Method Timeout
		if (descriptor) {
			Reflect.defineMetadata(metaDataKey, timeout, descriptor.value);

			return descriptor;
		}

		// Controller Timeout
		Reflect.defineMetadata(metaDataKey, timeout, target);

		return target;
	};
};

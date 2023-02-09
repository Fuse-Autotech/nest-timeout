import { CLASS_INDICATOR } from '../constants';
import { getMetaDataKey } from '../utils';

export const Timeout = (timeout: number): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
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

    if (descriptor) {
      Reflect.defineMetadata(metaDataKey, timeout, descriptor.value);

      return descriptor;
    }

    Reflect.defineMetadata(metaDataKey, timeout, target);

    return target;
  };
};

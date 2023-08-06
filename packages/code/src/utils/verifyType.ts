export const isType = (type: any) => {
  return (obj: any) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};

/**
 * 检测变量类型
 * @param type
 */
export const variableTypeDetection = {
  isNumber: isType("Number"),
  isString: isType("String"),
  isBoolean: isType("Boolean"),
  isFunction: isType("Function"),
  isUndefined: isType("Undefined"),
  isNull: isType("Null"),
  isObject: isType("Object"),
  isArray: isType("Array"),
  isDate: isType("Date"),
  isRegExp: isType("RegExp"),
  isPromise: isType("Promise"),
  isSymbol: isType("Symbol"),
  isWindow: isType("Window"),
  isProcess: isType("Process"),
};

/**
 * 判断值是否为错误对象
 */

export const isError = (error: Error): Boolean => {
  switch (Object.prototype.toString.call(error)) {
    case "[object Error]":
      return true;
    case "[object Exception]":
      return true;
    case "[object DOMException]":
      return true;
    default:
      return false;
  }
};

/**
 * 判断值是否为空对象
 */
export function isEmptyObject(obj: object): boolean {
  return variableTypeDetection.isObject(obj) && Object.keys(obj).length === 0;
}

/**
 * 判断值与目标对象关系
 */
export function isExistProperty(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export const isType = (type: any) => {
  return (obj: any) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};

// export const isFlase = (val: any) => {
//   return variableTypeDetection.isBoolean(val) && String(val) === "false";
// };
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

export const isRegExp = isType("RegExp");
export const isNumber = isType("Number");
export const isString = isType("String");
export const isBoolean = isType("Boolean");
export const isNull = isType("Null");
export const isUndefined = isType("Undefined");
export const isSymbol = isType("Symbol");
export const isFunction = isType("Function");
export const isObject = isType("Object");
export const isArray = isType("Array");
export const isProcess = isType("process");
export const isWindow = isType("Window");
export const isFlase = (val: any) => {
  return isBoolean(val) && String(val) === "false";
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

// 判断是否为空
export function isEmpty(wat: any): boolean {
  return (
    (variableTypeDetection.isString(wat) && wat.trim() === "") ||
    wat === undefined ||
    wat === null
  );
}

/**
 * 判断入参类型
 * @param target 任意入参
 * @returns 类型
 */
export function typeofAny(target: any): string {
  console.log(target);
  console.log(Object.prototype.toString.call(target).slice(8, -1));
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

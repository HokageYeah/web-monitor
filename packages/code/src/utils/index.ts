import { EVENTTYPES } from "../common/constant";
import { AnyFun } from "../types/options";

/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 判断对象中是否包含该属性
 * @param key 键
 * @param object 对象
 * @returns 是否包含
 */

export function isValidKey(
  key: string | number | symbol,
  object: Array<any>
): key is keyof object {
  return object.includes(key);
}

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param opitons false或未提供时，事件监听器将以冒泡方式触发， true时，事件监听器将以捕获方式触发。
 */

export function on(
  target: Window | Document,
  eventName: string,
  handler: AnyFun,
  opitons = false
) {
  target.addEventListener(eventName, handler, opitons);
}

// 是否是某个类型
export function isType(type: any, values: string) {
  return Object.prototype.toString.call(type) === `[object ${values}]`;
}

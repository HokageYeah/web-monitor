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

/**
 * map方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
export function map(arr: any[], fn: AnyFun) {
  return arrayMap.call(arr, fn);
}

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(this: any, fn) {
    const result = [];
    for (let i = 0; i < this.length; i += 1) {
      result.push(fn(this[i], i, this));
    }
    return result;
  };

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(this: any, fn: AnyFun) {
    const result = [];
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };

/**
 * filter方法
 * @param arr 源数组
 * @param fn 条件函数
 */
export function filter(arr: any[], fn: AnyFun) {
  return arrayFilter.call(arr, fn);
}

const arrayFind =
  Array.prototype.find ||
  function findPolyfill(this: any, fn: AnyFun) {
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };

/**
 * 埋点、错误报告发送请求用 - navigator.sendBeacon 最好
 * 
 * 不受页面卸载过程的影响，确保数据可靠发送。
   异步执行，不阻塞页面关闭或跳转。
   能够发送跨域请求。
   只能发送post请求
 */
export function sendByBeacon(url: string, data: any) {
  if (navigator.sendBeacon) {
    return navigator.sendBeacon(url, JSON.stringify(data));
  }
  return false;
}

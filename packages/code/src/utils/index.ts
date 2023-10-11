import { EVENTTYPES } from "../common/constant";
import { AnyFun } from "../types/options";
import { isFunction, isNumber } from "./verifyType";

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

export function isObjValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return object.hasOwnProperty(key) || key in object;
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
// fetch请求上报
export function sendFetchPost(url: string, data: any): Promise<Response> {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  });
}

// 图片打点上报
export function sendImgPost(url: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const spliceStr = url.indexOf("?") === -1 ? "?" : "&";
    img.src = `${url}${spliceStr}data=${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    img.onload = () => {
      // 发送成功
      resolve();
    };
    img.onerror = (e) => {
      // 发送失败
      reject(e);
    };
  });
}

/**
 * 获取当前页面的url
 * @returns 当前页面的url
 */
export function getLocationHref() {
  if (typeof document === "undefined" || document.location == null) return "";
  return window.location.href;
}

/**
 * 格式化对象(针对数字类型属性)
 * 小数位数保留最多两位、空值赋 undefined
 * @returns source 源对象
 */
export function normalizeObject(source: any) {
  return JSON.parse(
    JSON.stringify(source, (key, value) => {
      // if (typeof value === "number") {
      if (isNumber(value)) {
        return value === 0 ? 0 : value.toFixed(2);
      }
      return value;
    })
  );
}

/**
 * 判断对象是否超过指定kb大小
 * @param object 源对象
 * @param limitInKB 最大kb
 */

export function isObjectOverSize(object: any, limitInKB: number) {
  const jsonString = JSON.stringify(object);
  // 缺点是性能方面可能略逊于使用 TextEncoder().encode().length 方法，因为它需要创建一个 Blob 对象。
  // const byteLength = new Blob([jsonString]).size;
  // 优点是高效且准确地计算字节长度。
  // 缺点是相对于创建 Blob 对象的方法稍微复杂一些，并且需要额外引入 TextEncoder 对象。
  const byteLength = new TextEncoder().encode(jsonString).length;
  console.log("数据大小------", byteLength);
  return byteLength > limitInKB * 1024;
}

/**
 * 获取url地址上的参数
 * @param url 请求url
 * @returns 参数对象
 */
export function getGetParams(url: string) {
  const params: any = {};
  const search = url.split("?")[1];
  if (!search) return params;
  search.split("&").forEach((item) => {
    const [key, value] = item.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

/**
 * 批量执行方法
 * @param funList 方法数组
 * @param through 是否将第一次参数贯穿全部方法
 * @param args 额外参数
 * @returns
 */
export function executeFunctions(
  funList: any,
  through: boolean,
  args: any
): any {
  if (funList.length === 0) return args;

  let result: any = undefined;
  // eslint-disable-next-line no-debugger
  for (let i = 0; i < funList.length; i++) {
    const func = funList[i];
    if (i === 0 || through) {
      result = func(args);
    } else {
      result = func(result);
    }
  }
  return result;
}

/**
 * 异步执行
 * requestIdleCallback 浏览器空闲会执行
 * requestAnimationFrame 浏览器刷新频率
 */
export function sendNextTick(callback: () => void) {
  return (
    window.requestIdleCallback ||
    window.requestAnimationFrame ||
    ((callback) => setTimeout(callback, 17))(callback)
  );
}

/**
 * 重写对象上面的某个属性
 * 针对浏览器内置的 XMLHttpRequest、fetch 对象，利用 AOP 切片编程重写该方法
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 */

export function replaceAop(
  source: any,
  name: string,
  replacement: AnyFun,
  isForced: boolean = false
): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (isFunction(wrapped)) {
      source[name] = replacement;
    }
  }
}

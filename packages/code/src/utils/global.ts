0
import { WebMonitor } from "../types/options";
import { variableTypeDetection } from "./verifyType";
import { UAParser } from 'ua-parser-js';

// 先判断是否处于浏览器环境 有window就是处于浏览器环境
export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== "undefined" ? window : 0
);

// 获取全局变量
const getGlobal = () => {
  if (isBrowserEnv) return window as unknown as Window;
  return {} as Window;
};
const _global = getGlobal();

// 获取全部变量__webMonitor__的引用地址
const getGlobalSupport = (): WebMonitor => {
  _global.__webMonitor__ = _global.__webMonitor__ || ({} as WebMonitor);
  return _global.__webMonitor__;
};

const uaResult = new UAParser().getResult();
const _support = getGlobalSupport();
// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version,  // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  deviceType: uaResult.device.type ? uaResult.device.type : 'Pc',
}

// global是在JavaScript中全局作用域中定义的一个对象，它代表全局命名空间。
// 在浏览器环境中，全局对象是window对象；而在Node.js环境中，全局对象是global对象。
// globalThis在node和浏览器端都能用，全局对象
// 判断sdk是否已经初始化过了
export const webMonitorisInit = () => {
  return !!_global.__webMonitorInit__;
};
export { _global, getGlobalSupport, _support };

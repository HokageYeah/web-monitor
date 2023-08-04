import { WebMonitor } from "../types/options";

// 先判断是否处于浏览器环境 有window就是处于浏览器环境
export const isBrowserEnv =
  Object.prototype.toString.call(typeof window !== "undefined" ? window : 0) ===
  "[object Window]";

// 获取全局变量
const getGlobal = () => {
  if (isBrowserEnv) return window as unknown as Window;
  return {} as Window;
};
const _global = getGlobal();

// 获取全部变量__webSee__的引用地址
const getGlobalSupport = (): WebMonitor => {
  _global.__webMonitor__ = _global.__webMonitor__ || ({} as WebMonitor);
  return _global.__webMonitor__;
};
const _support = getGlobalSupport();
// global是在JavaScript中全局作用域中定义的一个对象，它代表全局命名空间。
// 在浏览器环境中，全局对象是window对象；而在Node.js环境中，全局对象是global对象。
// 判断sdk是否已经初始化过了
const webMonitorisInit = () => {
  return !!_global.__webMonitorInit__;
};
export { _global, getGlobalSupport, _support };

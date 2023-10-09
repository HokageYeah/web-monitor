import { options } from "./options";

export function initPerformance() {
  debugger;
  console.log("initPerformance-------", options.performance);
  if (!options.performance.firstResource && !options.performance.core) return;
  // 初始化方法可能在onload事件之后才执行,此时不会触发load事件了 (例如delayInit)
  // 检查document.readyState属性来判断onload事件是否会被触发
  //   监听首屏结束时间：
  // 使用 DOM 的 readystatechange 事件来监听文档状态的变化。
  // 在事件处理程序中判断当前的文档状态是否为 'complete'，即页面已经完全加载和渲染完成。
  // 如果文档状态为 'complete'，记录当前时间作为首屏结束时间。
  console.log("readyState---------", document.readyState);
}

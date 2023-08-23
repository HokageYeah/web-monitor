import { VoidFun } from "../types/options";

export class sendQueue {
  // 请求的栈数组
  private stack: any[] = [];
  private isFlushing = false;
  constructor() {}
  // 往栈中添加方法
  addFunc(fn: VoidFun): void {
    if (typeof fn !== "function") return;
    // 如果不是浏览器环境则直接执行
    if (!("requestIdleCallback" in window || "Promise" in window)) {
      fn();
      return;
    }
    // 往栈中添加执行函数
    this.stack.push(fn);
    if (!this.isFlushing) {
      this.isFlushing = true;
      if ("requestIdleCallback" in window) {
        requestIdleCallback((dedaline) => {
          // console.log(dedaline);
          this.flushStack();
        });
      } else {
        Promise.resolve().then(() => {
          this.flushStack();
        });
      }
    }
  }
  flushStack() {
    while (this.stack.length) {
      this.stack.shift()();
    }
    this.isFlushing = false;
  }
  clearStack() {
    this.stack = [];
  }
  getStack() {
    return this.stack;
  }
}

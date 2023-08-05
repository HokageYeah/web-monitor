import { EVENTTYPES, SENDID } from "../common/constant";
import { isType } from "../utils";
import { _global } from "../utils/global";
import { eventBus } from "./eventBus";

/**
 * 判断是否为 promise-reject 错误类型
 */
const isPromiseRejectedResult = (
  event: ErrorEvent | PromiseRejectedResult
): event is PromiseRejectedResult => {
  return (event as PromiseRejectedResult).reason !== undefined;
};

const parseErrorEvent = (event: ErrorEvent | PromiseRejectedResult) => {
  // promise reject 错误
  if (isPromiseRejectedResult(event)) {
    return { eventId: SENDID.CODE, ...parseError(event.reason) };
  }
  const { target } = event;
  if (target instanceof HTMLElement) {
    debugger;
    const htmlTarget = <HTMLElement>target;
    // 为1代表节点是元素节点
    if (htmlTarget.nodeType == 1) {
      const result = {
        initiatorType: htmlTarget.nodeName.toLowerCase(),
        eventId: SENDID.RESOURCE,
        requestUrl: "",
      };
      switch (htmlTarget.nodeName.toLowerCase()) {
        case "link":
          result.requestUrl = (target as HTMLLinkElement).href;
          break;
        default:
          result.requestUrl =
            (target as HTMLImageElement).currentSrc ||
            (target as HTMLScriptElement).src;
      }
      return result;
    }
  }
  // 代码异常
  if (event.error) {
    // chrome中的error对象没有fileName等属性,将event中的补充给error对象
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return { eventId: SENDID.CODE, ...parseError(e) };
  }

  // 兜底
  // ie9版本,从全局的event对象中获取错误信息
  return {
    eventId: SENDID.CODE,
    line: (_global as any).event.errorLine,
    col: (_global as any).event.errorCharacter,
    errMessage: (_global as any).event.errorMessage,
    triggerPageUrl: (_global as any).event.errorUrl,
  };
};

/**
 * 分析错误信息
 * @param e 错误源信息
 * @returns 相对标准格式的错误信息
 */
const parseError = (e: any) => {
  debugger;
  console.log(e);
  return {};
};

// 初始化监听错误信息
const initError = () => {
  // 捕获阶段可以获取资源加载错误,script.onError link.onError img.onError,无法知道具体状态
  eventBus.addSubscribe({
    type: EVENTTYPES.ERROR,
    callback: (e: ErrorEvent) => {
      console.log("错误信息-------", e);
      debugger;
      const errorInfo = parseErrorEvent(e);
      debugger
      //   if (isIgnoreErrors(errorInfo)) return;
      //   emit(errorInfo);
    },
  });

  // promise调用链未捕获异常
  // 只捕获未处理的 reject的错误，如果对reject进行了回调处理这边不进行捕获
  eventBus.addSubscribe({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e: PromiseRejectedResult) => {
      console.log("错误信息PromiseRejectedResult-------", e);
      const errorInfo = parseErrorEvent(e);
      debugger
    },
  });
};

export { initError };
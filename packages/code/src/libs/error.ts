import { EVENTTYPES, SENDID } from "../common/constant";
import { filter, getTimestamp, isType, map } from "../utils";
import { _global } from "../utils/global";
import { resourceTransform } from "../utils/transformData";
import { variableTypeDetection } from "../utils/verifyType";
import { eventBus } from "./eventBus";
import ErrorStackParser from "error-stack-parser";

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
    // 资源加载出错
    debugger;
    const htmlTarget = <HTMLElement>target;
    // 为1代表节点是元素节点
    if (htmlTarget.nodeType == 1) {
      const result = {
        initiatorType: htmlTarget.nodeName.toLowerCase(),
        eventId: SENDID.RESOURCE,
        requestUrl: "",
        time: getTimestamp(),
      };
      switch (htmlTarget.nodeName.toLowerCase()) {
        case "link":
          result.requestUrl = resourceTransform(
            (target as HTMLLinkElement).href
          );
          break;
        default:
          result.requestUrl = resourceTransform(
            (target as HTMLImageElement).currentSrc ||
              (target as HTMLScriptElement).src
          );
      }
      return result;
    }
  }
  const stackFrame = ErrorStackParser.parse(!target ? event : event.error)[0];
  debugger;
  console.log(stackFrame);
  // 代码异常
  if (event.error) {
    // chrome中的error对象没有fileName等属性,将event中的补充给error对象
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return {
      eventId: SENDID.CODE,
      ...parseError(!target ? event : e),
    };
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

type InstabilityNature = {
  lineNumber: string;
  fileName: string;
  columnNumber: string;
};
interface ErrorStack {
  errMessage: string;
  errStack: string;
}

/**
 * 格式化错误对象信息
 * @param err Error 错误对象
 */
function parseStack(err: Error): ErrorStack {
  const { stack = "", message = "" } = err;
  const result = { eventId: SENDID.CODE, errMessage: message, errStack: stack };

  if (stack) {
    const rChromeCallStack = /^\s*at\s*([^(]+)\s*\((.+?):(\d+):(\d+)\)$/;
    const rMozlliaCallStack = /^\s*([^@]*)@(.+?):(\d+):(\d+)$/;
    // chrome中包含了message信息,将其去除,并去除后面的换行符
    const callStackStr = stack.replace(
      new RegExp(`^[\\w\\s:]*${message}\n`),
      ""
    );
    const callStackFrameList = map(
      filter(callStackStr.split("\n"), (item: string) => item),
      (str: string) => {
        const chromeErrResult = str.match(rChromeCallStack);
        if (chromeErrResult) {
          return {
            triggerPageUrl: chromeErrResult[2],
            line: chromeErrResult[3], // 错误发生位置的行数
            col: chromeErrResult[4], // 错误发生位置的列数
          };
        }

        const mozlliaErrResult = str.match(rMozlliaCallStack);
        if (mozlliaErrResult) {
          return {
            triggerPageUrl: mozlliaErrResult[2],
            line: mozlliaErrResult[3],
            col: mozlliaErrResult[4],
          };
        }
        return {};
      }
    );
    const item = callStackFrameList[0] || {};
    return { ...result, ...item };
  }
  return result;
}
/**
 * 分析错误信息
 * @param e 错误源信息
 * @returns 相对标准格式的错误信息
 */
const parseError = (e: any) => {
  debugger;
  console.log(e);
  if (e instanceof Error) {
    // fileName: 引发此错误的文件的路径 (此属性为非标准，所以下面得区分)
    const { message, stack } = e as Error &
      InstabilityNature;
      debugger
    const stackFrame = ErrorStackParser.parse(e)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    debugger
    console.log(stackFrame);
    if (fileName) {
      return {
        errMessage: message,
        errStack: stack,
        eventId: SENDID.CODE,
        line: lineNumber, // 不稳定属性 - 在某些浏览器可能是undefined，被废弃了
        col: columnNumber, // 不稳定属性 - 非标准，有些浏览器可能不支持
        triggerPageUrl: fileName, // 不稳定属性 - 非标准，有些浏览器可能不支持
      };
    }
    return parseStack(e);
  }
  if (e.message) return parseStack(e);

  // reject 错误
  if (typeof e === "string") return { eventId: SENDID.REJECT, errMessage: e };

  // console.error 暴露的错误
  if (variableTypeDetection.isArray(e))
    return { eventId: SENDID.CONSOLEERROR, errMessage: e.join(";") };

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
      debugger;
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
      debugger
      const errorInfo = parseErrorEvent(e);
      debugger;
    },
  });
};

export { initError };

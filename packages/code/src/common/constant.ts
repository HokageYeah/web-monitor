/**
 * 事件类型
 */
export enum EVENTTYPES {
  ERROR = "error", // 当静态资源加载失败时，会触发 error 事件
  CONSOLEERROR = "consoleError", //console错误
  UNHANDLEDREJECTION = "unhandledrejection", //Promise 中抛出的错误
  CLICK = "click",
  LOAD = "load",
  BEFOREUNLOAD = "beforeunload",
  FETCH = "fetch",
  XHROPEN = "xhr-open",
  XHRSEND = "xhr-send",
  HASHCHANGE = "hashchange",
  HISTORYPUSHSTATE = "history-pushState",
  HISTORYREPLACESTATE = "history-replaceState",
  POPSTATE = "popstate",
  READYSTATECHANGE = "readystatechange",
  ONLINE = "online",
  OFFLINE = "offline",
  DOM = "dom",
  VUE = "vue",
}

/**
 * 触发的事件id - eventID
 */
export enum SENDID {
  PAGE = "page", // 页面
  RESOURCE = "resource", // 资源
  SERVER = "server", // 请求
  CODE = "code", // code
  REJECT = "reject", // reject
  CONSOLEERROR = "console.error", // console.error
}

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
  HASHCHANGE = "hashchange", // hash 路由监听
  HISTORYPUSHSTATE = "history-pushState", //history-pushState 路由事件
  HISTORYREPLACESTATE = "history-replaceState", // history-replaceState 路由替换事件
  POPSTATE = "popstate",
  READYSTATECHANGE = "readystatechange",
  ONLINE = "online",
  OFFLINE = "offline",
  DOM = "dom",
  VUE = "vue",
}

/**
 * 触发的事件是什么类型 - eventType
 */
export enum SEDNEVENTTYPES {
  PV = "pv", // 路由
  ERROR = "error", // 错误
  PERFORMANCE = "performance", // 资源
  CLICK = "click", // 点击
  DWELL = "dwell", // 页面卸载
  CUSTOM = "custom", // 手动触发事件
  INTERSECTION = "intersection", // 曝光采集
}

/**
 * 触发的事件编码 - eventCode
 */
export enum SENDCODE {
  PAGE = "page", // 页面
  RESOURCE = "resource", // 资源
  SERVER = "server", // 请求
  CODE = "code", // code
  REJECT = "reject", // reject
  CONSOLEERROR = "console.error", // console.error
}

import { EVENTTYPES } from "../common/constant";
import { isValidKey, getTimestamp, on } from "../utils";
import { _global } from "../utils/global";
import { eventBus } from "./eventBus";

const enumValues = Object.keys(EVENTTYPES);
const initReplace = () => {
  for (const key of enumValues) {
    if (isValidKey(key, enumValues)) {
      // 替换操作
      replace(key);
    }
  }
};
const replace = (key: EVENTTYPES) => {
  if (!isValidKey(key, enumValues)) return;
  const value = EVENTTYPES[key];
  switch (value) {
    case EVENTTYPES.ERROR:
      listenError(EVENTTYPES.ERROR);
      break;
    case EVENTTYPES.UNHANDLEDREJECTION:
      listenEunhandledrejection(EVENTTYPES.UNHANDLEDREJECTION);
      break;
    // 重写fetch
    case EVENTTYPES.FETCH:
      fetchReplace(EVENTTYPES.FETCH);
      break;
    // 重写XMLHttpRequest
    case EVENTTYPES.XHROPEN:
      XHROpenReplace(EVENTTYPES.XHROPEN);
      break;
    case EVENTTYPES.XHRSEND:
      XHRSendfetchReplace(EVENTTYPES.XHRSEND);
      break;
    case EVENTTYPES.ONLINE:
      listenOnline(EVENTTYPES.ONLINE);
      break;
    case EVENTTYPES.OFFLINE:
      listenOffline(EVENTTYPES.OFFLINE);
      break;
    // 页面加载完成LOAD
    case EVENTTYPES.LOAD:
      listenLoad(EVENTTYPES.LOAD); 
      break
    default:
      break;
  }
};

/**
 * 监听处理事件
 * vue在处理资源加载错误时，会捕获并阻止冒泡到window对象上。
 * type: error
 */
const listenError = (type: EVENTTYPES) => {
  on(
    _global,
    type,
    (e: Event) => {
      // console.log("注意报错了listenError-----");
      // 错误用eventbus 派发给相关的事件处理
      eventBus.publishSubscribe(type, e);
    },
    true
  );
};

/**
 * 监听 - type: unhandledrejection（promise异常）
 */
const listenEunhandledrejection = (type: EVENTTYPES) => {
  on(_global, type, (e: PromiseRejectionEvent) => {
    // console.log("注意报错了listenEunhandledrejection-----");
    // 错误用eventbus 派发给相关的事件处理
    eventBus.publishSubscribe(type, e);
  });
};

/**
 * 重写fetch，添加拦截
 */
function fetchReplace(type: EVENTTYPES) {
  if (typeof _global.fetch == "undefined") return;
  const originFetch = _global.fetch;
  _global.fetch = function (...args) {
    const startTime = getTimestamp();
    const promise = originFetch.apply(this, args).then((res: any) => {
      eventBus.publishSubscribe(type, ...args, res, startTime);
      return res;
    });
    // const event = {
    //   type,
    //   target: promise,
    //   request: {
    //     startTime,
    //     method: args[0].method,
    //     url: args[0].url,
    //   },
    // };
    // eventBus.publishSubscribe(type, event);
    return promise;
  };
}

/**
 * 重写XHR-open，添加拦截
 */
function XHROpenReplace(type: EVENTTYPES) {
  if (typeof _global.XMLHttpRequest == "undefined") return;
  const originOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args: any[]) {
    const startTime = getTimestamp();
    // this.addEventListener("load", () => {
    //   eventBus.publishSubscribe(type, this, ...args, startTime);
    // });
    eventBus.publishSubscribe(type, this, ...args, startTime);
    originOpen.apply(this, args as any);
  };
}

/**
 * 重写XHR-send，添加拦截
 */
function XHRSendfetchReplace(type: EVENTTYPES) {
  if (typeof _global.XMLHttpRequest == "undefined") return;
  const originSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    eventBus.publishSubscribe(type, this, ...args);
    // eventBus.publishSubscribe(type, this, ...args, startTime);
    // this.addEventListener("error", (error) => {
    //   console.log(error);
    //   eventBus.publishSubscribe(type, this, ...args, startTime);
    // });
    // this.onerror = function (error) {
    //   // 在这里添加处理请求报错的逻辑
    //   console.error("XMLHttpRequest 请求报错", error);
    // };
    originSend.apply(this, args);
  };
}

// 监听 - offline 网络是否关闭
const listenOffline = (type: EVENTTYPES) => {
  on(
    _global,
    type,
    (e: Event) => {
      // 错误用eventbus 抛函数
      eventBus.publishSubscribe(type, e);
    },
    true
  );
};
// 监听 - online 网络是否开启
const listenOnline = (type: EVENTTYPES) => {
  on(
    _global,
    type,
    (e: Event) => {
      // 错误用eventbus 抛函数
      eventBus.publishSubscribe(type, e);
    },
    true
  );
};

/**
 * 监听页面加载 - load事件
 */
function listenLoad(type: EVENTTYPES) {
  on(
    _global,
    type,
    (e: Event) => {
      // 错误用eventbus 抛函数
      eventBus.publishSubscribe(type, e);
    },
    true
  );
}

export { initReplace };

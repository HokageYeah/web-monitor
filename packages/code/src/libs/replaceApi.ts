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
      break;
    case EVENTTYPES.XHRSEND:
      break;
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
      console.log("注意报错了listenError-----");
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
    console.log("注意报错了listenEunhandledrejection-----");
    // 错误用eventbus 派发给相关的事件处理
    eventBus.publishSubscribe(type, e);
  });
};

/**
 * 重写fetch，添加拦截
 */
function fetchReplace(type: EVENTTYPES) {
  // const originFetch = _global.fetch;
  // _global.fetch = function (...args) {
  //   const startTime = getTimestamp();
  //   const promise = originFetch.apply(this, args);
  //   const event = {
  //     type,
  //     target: promise,
  //     request: {
  //       startTime,
  //       method: args[0].method,
  //       url: args[0].url,
  //     },
  //   };
  //   eventBus.publishSubscribe(type, event);
  //   return promise;
  // };
}

export { initReplace };

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
    default:
      break;
  }
};

/**
 * 监听处理事件
 * vue在处理资源加载错误时，会捕获并阻止冒泡到window对象上。
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
 * 监听 - unhandledrejection（promise异常）
 */
const listenEunhandledrejection = (type: EVENTTYPES) => {
  on(_global, type, (e: PromiseRejectionEvent) => {
    console.log("注意报错了listenEunhandledrejection-----");
    // 错误用eventbus 派发给相关的事件处理
    eventBus.publishSubscribe(type, e);
  });
};

export { initReplace };

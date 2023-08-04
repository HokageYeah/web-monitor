import { EVENTTYPES } from "../common/constant";
import { AnyFun } from "../types/options";
import { _support } from "../utils/global";

type EventHandler = {
  type: EVENTTYPES;
  callback: AnyFun;
};

type eventsType = {
  [key in EVENTTYPES]?: AnyFun[];
};
// 发布-订阅（Publish-Subscribe）模式
export class EventBus {
  private eventHandlers: eventsType;
  constructor() {
    this.eventHandlers = {};
  }

  // 添加订阅
  addSubscribe(event: EventHandler) {
    !this.eventHandlers[event.type] && (this.eventHandlers[event.type] = []);
    this.eventHandlers[event.type]?.push(event.callback);
  }

  // 发布订阅
  publishSubscribe(event: EVENTTYPES, ...args: any[]) {
    const eventCallbacks = this.eventHandlers[event];
    if (eventCallbacks) {
      eventCallbacks.forEach((element) => {
        element(...args);
      });
    }
  }

  //   删除订阅
  deleteSubscribe(event: EventHandler) {
    const eventCallbacks = this.eventHandlers[event.type];
    if (eventCallbacks) {
      this.eventHandlers[event.type] = eventCallbacks.filter(
        (item) => item !== event.callback
      );
    }
  }
}

const eventBus = _support.eventBus || (_support.eventBus = new EventBus());
export { eventBus };

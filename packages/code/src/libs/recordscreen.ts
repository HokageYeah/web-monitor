import { record } from "rrweb";
import { RecordEventScope } from "../types/options";
import { getTimestamp } from "../utils";

const MAXSCOPETIME = 5000; // 每5s记录一个区间
const MAXSCOPELENGTH = 3; // 录屏数组最长长度 - 不要小于3

export class RecordScreen {
  eventList: RecordEventScope[] = [
    { scope: `${getTimestamp()}-`, eventList: [] },
  ];
  constructor() {
    this.init();
  }
  private init() {
    record({
      emit: (event: any, isCheckout: any) => {
        console.log("event-----", event, isCheckout);
        const lastEvents = this.eventList[this.eventList.length - 1];
        lastEvents.eventList.push(event);
        if (isCheckout) {
          // 此段时间内发生错误，上报录屏信息
          if (this.eventList.length > 0) {
            this.eventList[this.eventList.length - 1].scope =
              lastEvents.scope + getTimestamp();
          }
          if (this.eventList.length > MAXSCOPELENGTH) {
            this.eventList.shift();
          }
          this.eventList.push({ scope: `${getTimestamp()}-`, eventList: [] });
        }
      },
      recordCanvas: true,
      checkoutEveryNms: MAXSCOPETIME, // 每5s重新制作快照
    });
  }
}
let recordscreenList: RecordEventScope[];
const initRecordScreen = () => {
  recordscreenList = new RecordScreen().eventList;
};

/**
 * 获取错误录屏数据
 */
const getRecordEvent = (): RecordEventScope[] => {
  const _recordscreenList: RecordEventScope[] = JSON.parse(
    JSON.stringify(recordscreenList)
  );
  return _recordscreenList
    .slice(-2)
    .map((item) => item.eventList)
    .flat();
};

export { recordscreenList, initRecordScreen, getRecordEvent };

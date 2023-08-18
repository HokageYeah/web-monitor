import { record } from "rrweb";
import { RecordEventScope } from "../types/options";
import { getTimestamp } from "../utils";
import pako from "pako";
import { Base64 } from "js-base64";
import { options } from "./options";

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
  if (!options.isRecordScreen) return;
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

/**
 * 视频压缩
 * @param data 压缩源
 */
const zip = (data: any): string => {
  debugger;
  console.log("压缩----", data);
  if (!data) return data;
  // 判断数据是否需要转为JSON
  const dataJson =
    typeof data !== "string" && typeof data !== "number"
      ? JSON.stringify(data)
      : data;
  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string);
  const binaryString = pako.gzip(str);
  const arr = Array.from(binaryString);
  let s = "";
  arr.forEach((item: any) => {
    s += String.fromCharCode(item);
  });
  debugger;
  return Base64.btoa(s);
};

/**
 * 解压
 * @param b64Data 解压源
 */
const unzip = (b64Data: string) => {
  debugger
  const strData = Base64.atob(b64Data);
  const charData = strData.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  debugger
  const binData = new Uint8Array(charData);
  const data: any = pako.ungzip(binData);
  // ↓切片处理数据，防止内存溢出报错↓
  let str = "";
  const chunk = 8 * 1024;
  let i;
  for (i = 0; i < data.length / chunk; i++) {
    str += String.fromCharCode.apply(
      null,
      data.slice(i * chunk, (i + 1) * chunk)
    );
  }
  str += String.fromCharCode.apply(null, data.slice(i * chunk));
  // ↑切片处理数据，防止内存溢出报错↑
  const unzipStr = Base64.decode(str);
  let result = "";
  // 对象或数组进行JSON转换
  try {
    result = JSON.parse(unzipStr);
  } catch (error: any) {
    if (/Unexpected token o in JSON at position 0/.test(error)) {
      // 如果没有转换成功，代表值为基本数据，直接赋值
      result = unzipStr;
    }
  }
  return result;
};

export { recordscreenList, initRecordScreen, getRecordEvent, zip, unzip };

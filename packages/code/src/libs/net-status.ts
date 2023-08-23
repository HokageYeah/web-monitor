import { EVENTTYPES } from "../common/constant";
import { _support } from "../utils/global";
import { eventBus } from "./eventBus";
// 监听网络状态
export class NetStatus {
  isOnline: boolean = true;
  constructor() {
    this.init();
  }
  init() {
    eventBus.addSubscribe({
      type: EVENTTYPES.OFFLINE,
      callback: (e: ErrorEvent) => {
        if (e.type === 'offline') {
          console.error('网络断开')
          this.isOnline = false
        }
      },
    });
    eventBus.addSubscribe({
      type: EVENTTYPES.ONLINE,
      callback: (e: ErrorEvent) => {
        if (e.type === 'online') {
          console.log('网络连接')
          this.isOnline = true
        }
      },
    });
  }
}
export let netStatus: NetStatus;
export function initNetStatus() {
  _support.netStatus = new NetStatus();
  netStatus = _support.netStatus;
}

import { sendByBeacon } from "../utils";
import { _support } from "../utils/global";

export class TransportData {
  /**
   * 记录需要发送的埋点数据
   * @param e 需要发送的事件信息
   * @param flush 是否立即发送
   */
  public send(e: any, flush = false) {
    if (flush) {
        sendByBeacon("http://localhost:8080/api/reportData",{test: '测试'})
    }
  }
}

export let transportData: TransportData;

export function initTransportData() {
  transportData =
    _support.transportData || (_support.transportData = new TransportData());
}

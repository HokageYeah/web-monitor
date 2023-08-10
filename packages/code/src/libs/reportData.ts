import { sendByBeacon } from "../utils";
import { _support } from "../utils/global";
import { options } from "./options";
// import { options } from './options'

export class TransportData {

  private send(url: string, data: any) {
    return new Promise((resolve, reject) => {
      debugger
      resolve({sendType: 'sendBeacon', success: sendByBeacon(url, data)})
    })
  }

  /**
   * 记录需要发送的埋点数据
   * @param e 需要发送的事件信息
   * @param flush 是否立即发送
   */
  public emit(e: any, flush = false) {
    // if (flush) {
    //     sendByBeacon("http://localhost:8080/api/reportData",{test: '测试'})
    // }
    debugger
    this.send(options.dsn, e).then((res :any) => {
      console.log('发送给服务器消息成功～～');
    })
  }
}

export let transportData: TransportData;

export function initTransportData() {
  transportData =
    _support.transportData || (_support.transportData = new TransportData());
}

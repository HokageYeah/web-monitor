import { isObjectOverSize, sendByBeacon } from "../utils";
import { _global, _support } from "../utils/global";
import { options } from "./options";
// import { options } from './options'

export class TransportData {
  private send(url: string, data: any) {
    return new Promise((resolve, reject) => {
      debugger;
      const isOverSize = isObjectOverSize(data, 64);
      console.log("isOverSize----", isOverSize);
      let sendType = 1;
      if (_global.navigator) {
        sendType = isOverSize ? 3 : 1;
      } else {
        sendType = isOverSize ? 3 : 2;
      }
      switch (sendType) {
        case 1:
          // sendBeacon 最大64kb
          resolve({ sendType: "sendBeacon", success: sendByBeacon(url, data) });
          break;
        case 3:
          // xhr
          this.xhrPost(url, data)
            .then((res) => {
              console.log('xhr--------',res);
              // 处理返回的数据
              resolve({ sendType: "xhr", success: true });
            })
            .catch((error) => {
              console.error(error);
            });
          break;

        default:
          break;
      }
    });
  }

  private async xhrPost(url: string, data: any): Promise<Response> {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 记录需要发送的埋点数据
   * @param e 需要发送的事件信息
   * @param flush 是否立即发送
   */
  public emit(e: any, flush = false) {
    // if (flush) {
    //   this.send(options.dsn, {test: '测试'}).then((res :any) => {
    //     console.log('发送给服务器消息成功～～', e);
    //     options.afterSendData(e)
    //   })
    //     sendByBeacon("http://localhost:8080/api/reportData",{test: '测试'})
    // }
    options.beforeSendData(e);
    debugger;
    let json = JSON.stringify({ name: "顶顶顶顶顶" });
    console.log("json------", json);
    const blob = new Blob([json], { type: "application/json" });
    console.log("Blob------", blob);
    this.send(options.dsn, e).then((res: any) => {
      console.log("发送给服务器消息成功～～", e);
      console.log("发送给服务器消息成功Blob～～", Blob);
      console.log("发送给服务器消息成功Promise～～", res);
      options.afterSendData(e);
    });
  }
}

export let transportData: TransportData;

export function initTransportData() {
  transportData =
    _support.transportData || (_support.transportData = new TransportData());
}

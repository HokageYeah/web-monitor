import { isObjectOverSize, sendByBeacon } from "../utils";
import { _global, _support } from "../utils/global";
import { options } from "./options";
// import { options } from './options'

export class TransportData {
  private send(url: string, data: any) {
    return new Promise((resolve, reject) => {
      debugger;
      console.log(this);
      const httpXhrPost = (url: string, data: any) => {
        debugger;
        console.log(this);
        this.xhrPost(url, data)
          .then((res) => {
            console.log("xhr--------", res);
            debugger
            // 如果上报接口出错，不进行过滤的话会出现请求死循环
            if (res.status == 200 || res.status == 304) {
              // 处理返回的数据
              resolve({ sendType: "xhr", success: true });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
      debugger;
      const isOverSize = isObjectOverSize(data, 64);
      console.log("isOverSize----", isOverSize);
      let sendType = 1;
      if (_global.navigator) {
        sendType = isOverSize ? 3 : 1;
      } else {
        sendType = isOverSize ? 3 : 2;
      }
      debugger;
      switch (sendType) {
        case 1:
          // sendBeacon 最大64kb
          // 判断如果 sendBeacon请求不成功使用fetch去请求。
          // （如果处于危险的网络环境，或者开启了广告屏蔽插件 此请求将无效）
          // 如果成功进入浏览器的发送队列后，会返回true；如果受到队列总数、数据大小的限制后，会返回false。
          // 返回ture后，只是表示进入了发送队列，浏览器会尽力保证发送成功，但是否成功了，无法判断。
          const value = sendByBeacon(url, data);
          if (value) {
            resolve({ sendType: "sendBeacon", success: value });
          } else {
            httpXhrPost(url, data);
          }
          break;
        case 3:
          // xhr
          httpXhrPost(url, data);
          break;

        default:
          break;
      }
    });
  }

  private xhrPost(url: string, data: any): Promise<Response> {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
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

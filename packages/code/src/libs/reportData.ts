import {
  executeFunctions,
  isObjectOverSize,
  map,
  sendByBeacon,
  sendFetchPost,
  sendImgPost,
  sendNextTick,
} from "../utils";
import { _global, _support } from "../utils/global";
import { isFlase, typeofAny, variableTypeDetection } from "../utils/verifyType";
import { options } from "./options";
// import { options } from './options'

export class TransportData {
  private events: any[] = []; // 批次队列
  private timeoutID: NodeJS.Timeout | undefined; // 延迟发送ID
  private send(url: string, data: any) {
    return new Promise((resolve, reject) => {
      debugger;
      console.log(this);
      const httpXhrPost = (url: string, data: any) => {
        debugger;
        console.log(this);
        sendFetchPost(url, data)
          .then((res) => {
            console.log("xhr--------", res);
            debugger;
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
      // sendBeacon 最大64kb
      const isOverSize64 = isObjectOverSize(data, 64);
      // img 限制在 2kb
      const isOverSize2 = isObjectOverSize(data, 2);
      console.log("isOverSize----", isOverSize64);
      let sendType = 1;
      if (_global.navigator) {
        sendType = isOverSize64 ? 3 : 1;
      } else {
        sendType = isOverSize2 ? 3 : 2;
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
        case 2:
          // img 除了2kb以外的数据
          sendImgPost(url, data).then(() => {
            resolve({ sendType: "image", success: true });
          });
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

  // 列表事件发送
  private listSend() {
    // debugger;
    // 如消息为空，目前什么都不做
    if (this.events.length == 0) return;
    // 需要发送的事件
    const sendEvents = this.events.slice(0, options.cacheMaxLength);
    this.events = this.events.slice(options.cacheMaxLength);
    const sendParams = {
      eventInfo: map(sendEvents, (e: any) => e),
    };
    debugger;
    const afterSendParams = executeFunctions(
      options.beforeSendDataList,
      false,
      sendParams
    );
    debugger;
    if (isFlase(afterSendParams)) return;
    if (!this.validateOptions(afterSendParams, "beforeSendData")) return;
    // 开始批量发送数据
    this.send(options.dsn, afterSendParams).then((res: any) => {
      console.log("发送给服务器消息成功～～", afterSendParams);
      console.log("发送给服务器消息成功Blob～～", Blob);
      console.log("发送给服务器消息成功Promise～～", res);
      executeFunctions(options.afterSendDataList, true, {
        ...afterSendParams,
      });
    });

    // this.events还有值说明发送的事件超过了阈值(cacheMaxLength)
    // 那么这些经过裁剪的事件列表剩下的会直接发，并不会延迟等到下一个队列
    if (this.events.length) {
      sendNextTick(this.listSend.bind(this));
    }
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

    // 如果e没有值，或者网络断开则返回
    if (!e || !_support.netStatus.isOnline) return;
    // 设置处理批量事件
    if (!variableTypeDetection.isArray(e)) e = [e];
    // 批量处理beforeSendData 回调函数

    this.events = this.events.concat(e);
    if (this.timeoutID) clearTimeout(this.timeoutID);
    // 满足最大记录数,立即发送,否则定时发送
    if (this.events.length >= options.cacheMaxLength || flush) {
      debugger;
      console.log("--------查看么cacheMaxLength--", this.events);
      this.listSend();
    } else {
      // 宏任务队列延迟运行
      console.log("--------查看么我改变了timeoutID--", this.events);
      this.timeoutID = setTimeout(
        this.listSend.bind(this),
        options.cacheWatingTime
      );
    }

    // options.beforeSendData(e);
    // debugger;
    // let json = JSON.stringify({ name: "顶顶顶顶顶" });
    // console.log("json------", json);
    // const blob = new Blob([json], { type: "application/json" });
    // console.log("Blob------", blob);
    // this.send(options.dsn, e).then((res: any) => {
    //   console.log("发送给服务器消息成功～～", e);
    //   console.log("发送给服务器消息成功Blob～～", Blob);
    //   console.log("发送给服务器消息成功Promise～～", res);
    //   options.afterSendData(e);
    // });
  }

  // 验证选项的类型 - 只验证是否为 {} []
  //  返回 false意思是取消放入队列 / 取消发送
  private validateOptions(target: any, targetName: string): boolean | void {
    if (target === false) return;
    if (!target) {
      console.error(
        `NullError: ${targetName}期望返回 {} 或者 [] 类型，目前无返回值`
      );
      return false;
    }
    if (["object", "array"].includes(typeofAny(target))) return true;
    console.error(
      `TypeError: ${targetName}期望返回 {} 或者 [] 类型，目前是${typeofAny(
        target
      )}类型`
    );
    return false;
  }
}

export let transportData: TransportData;

export function initTransportData() {
  transportData =
    _support.transportData || (_support.transportData = new TransportData());
}
function useImgUpload(url: string, data: any) {
  throw new Error("Function not implemented.");
}

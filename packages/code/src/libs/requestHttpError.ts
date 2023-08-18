import { EVENTTYPES, SENDID } from "../common/constant";
import { getGetParams, getTimestamp, isObjValidKey, on } from "../utils";
import { eventBus } from "./eventBus";
import { triggerError } from "./exportAllMethods";
import { options } from "./options";

export function initRequestHttp() {
  if (!options.isHttpError) return;
  // 初始化fetch请求
  initReplaceFetch();

  // 初始化XHR请求
  initReplaceXHR();
}

// 拦截fetch请求的
const initReplaceFetch = () => {
  eventBus.addSubscribe({
    type: EVENTTYPES.FETCH,
    callback: (
      requestUrl: string,
      reqOptions: Partial<Request> = {},
      response: Response,
      startTime: number
    ) => {
      const { method, body } = reqOptions;
      const { url, status, statusText = "请求资源未发现", type } = response;
      console.log(reqOptions);
      console.log(response);
      //  转换成小写
      const requestMethod = String(method)?.toLocaleLowerCase();
      //   如果状态status没有返回200、或者304缓存 则认为报错了ttp状态码，则不记录
      if (status !== 200 && status !== 304 && status !== 204) {
        const event = {
          eventId: SENDID.SERVER,
          eventType: type,
          errMessage: statusText,
          requestUrl: url,
          responseStatus: status,
          requestMethod,
          requestType: "fetch",
          requestParams: requestMethod == "post" ? body : JSON.stringify(getGetParams(url)),
        };
        triggerError(event);
      }
    },
  });
};

interface RequestOptionsType {
  url: string;
  method: string;
  requestParams?: string;
  triggerTime?: number; // 请求发生时间
}

class RequestOptions implements RequestOptionsType {
  url: string = "";
  method: string = "";
  requestParams?: string = "";
  triggerTime?: number = -1;
  constructor(options = {}) {
    Object.keys(options).forEach((element) => {
      if (isObjValidKey(element, options)) {
        this[element] = options[element];
      }
    });
  }
}

// 拦截xhr请求的
const initReplaceXHR = () => {
  const requestConfig = new RequestOptions();
  eventBus.addSubscribe({
    type: EVENTTYPES.XHROPEN,
    callback: (
      that: XMLHttpRequest & any,
      method: string,
      url: string,
      startTime: number
    ) => {
      debugger;
      console.log(that);
      console.log(method);
      console.log(url);
      console.log(startTime);
      requestConfig.url = url;
      requestConfig.method = String(method).toLocaleLowerCase();
      requestConfig.requestParams = JSON.stringify(getGetParams(url));
    },
  });
  eventBus.addSubscribe({
    type: EVENTTYPES.XHRSEND,
    callback: (that: XMLHttpRequest & any, body) => {
      debugger;
      console.log(that);
      console.log(body);
      //  监听readyState 的状态改变。会以此变成2，3，4会触发三次这里。
      // 监听readyState变成4的完成情况
      on(that, EVENTTYPES.READYSTATECHANGE, () => {
        if (that.readyState === 4) {
          const {
            response,
            responseText,
            responseType,
            responseURL,
            responseXML,
            status,
            statusText,
          } = that;
          const requestUrl = responseURL || requestConfig.url;

          debugger;
          console.log(that);
          //   如果状态status没有返回200、或者304缓存 则认为报错了ttp状态码，则不记录
          if (status !== 200 && status !== 304 && status !== 204) {
            const event = {
              eventId: SENDID.SERVER,
              eventType: responseType,
              errMessage: statusText || responseText,
              requestUrl,
              responseStatus: status,
              requestMethod: requestConfig.method,
              requestType: "xhr",
              //   如果是post请求的话 参数在body上
              requestParams:
                requestConfig.method == "post"
                  ? body
                  : requestConfig.requestParams,
            };
            triggerError(event);
          }
        }
      });
    },
  });
};

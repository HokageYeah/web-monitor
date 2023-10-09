import { InitOptions } from "../types/options";
import { _support } from "../utils/global";
import { isEmpty, typeofAny } from "../utils/verifyType";
/**
 * 管理全局的参数
 */
export class Options implements InitOptions {
  dsn = ""; // 上报地址
  appName = ""; // 应用名称
  appCode = ""; // 应用code
  appVersion = ""; // 应用版本
  userId = ""; // 用户id(外部填充进来的id)
  beforeSendData = (data: any) => {}; // 及时上报前的hook
  afterSendData = (data: any) => {}; // 及时上报后的hook
  isRecordScreen = false; // 默认关闭录屏
  isHttpError = false; // 默认不开启请求报错拦截
  cacheMaxLength = 5; // 上报数据最大缓存数
  cacheWatingTime = 1000; // 上报数据最大等待时间
  // 数据上报前的 hook
  beforeSendDataList: any[] = [];
  // 数据上报后的 hook
  afterSendDataList: any[] = [];
  performance = {
    core: false, // 性能数据-是否采集静态资源、接口的相关数据
    firstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    server: false, // 接口请求-是否采集接口请求(成功的才会采集)
  };
  pv = {
    core: false, // 页面跳转-是否自动发送页面跳转相关数据
  };

  constructor(initOptions: InitOptions) {
    this.optionsInit(initOptions);
  }

  private optionsInit(options: any) {
    for (const [key, value] of Object.entries(options)) {
      (this as any)[key] = value;
    }
    const { beforeSendData, afterSendData } = options;
    if (beforeSendData) {
      this.beforeSendDataList = [this.beforeSendData];
    }
    if (afterSendData) {
      this.afterSendDataList = [this.afterSendData];
    }
    /**
     * 对配置项进行转换
     * 如果有些对象的配置项传递的是Boolean值，则更换对象内的值都是Boolean值
     */
    const { performance, pv } = options;
    if (typeof performance === "boolean") {
      this.performance = {
        core: performance,
        firstResource: performance,
        server: performance,
      };
    }
    if (typeof pv === "boolean") {
      this.pv = {
        core: pv,
      };
    }
  }
}

/**
 * 验证必填项
 * @param options 入参对象
 */

const validateMustFill = (options: InitOptions) => {
  const validateList = [
    validateOptionMustFill(options.dsn, "dsn"),
    validateOptionMustFill(options.appName, "appName"),
  ];
  return validateList.every((item) => !!item);
};

const validateOptionMustFill = (target: any, targetName: string) => {
  if (isEmpty(target)) {
    console.error(`@web-monitor: 【${targetName}】参数未填`);
    return false;
  }
  return true;
};
// 教研
const validateInitOption = (options: InitOptions) => {
  const {
    dsn,
    appName,
    appVersion,
    appCode,
    userId,
    beforeSendData,
    afterSendData,
  } = options;
  const validateList = [
    validateOption(dsn, "dsn", "string"),
    validateOption(appName, "appName", "string"),
    validateOption(appVersion, "appVersion", "string"),
    validateOption(appCode, "appCode", "string"),
    validateOption(userId, "userId", "string"),
    validateOption(beforeSendData, "beforeSendData", "function"),
    validateOption(afterSendData, "afterSendData", "function"),
  ];
  return validateList.every((item) => !!item);
};

const validateOption = (target: any, targetName: string, type: string) => {
  if (!target || typeofAny(target) == type) return true;
  console.error(
    `web-monitor-TypeError: ${targetName}期望传入${type}类型，目前是${typeofAny(
      target
    )}类型`
  );
  return false;
};

export let options: Options;

export function initOptions(optionsParams: InitOptions) {
  // 必须传递参数教研 + 入参类型校验
  // 网址dns、appName是必须要传的
  if (!validateMustFill(optionsParams) || !validateInitOption(optionsParams)) {
    return false;
  }
  // 教研通过后、开始初始化工作
  options = new Options(optionsParams);
  _support.options = options;
  return true;
}

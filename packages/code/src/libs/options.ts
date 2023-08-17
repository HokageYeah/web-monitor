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
  userUuid = ""; // 用户id(外部填充进来的id)
  beforeSendData = (data: any) => {}; // 及时上报前的hook
  afterSendData = (data: any) => {}; // 及时上报后的hook
  isRecordScreen = false; // 默认关闭录屏
  isHttpError = false;  // 默认不开启请求报错拦截

  constructor(initOptions: InitOptions) {
    this.optionsInit(initOptions);
  }

  private optionsInit(options: any) {
    debugger;
    for (const [key, value] of Object.entries(options)) {
      (this as any)[key] = value;
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
  const { dsn, appName, appVersion, appCode, userUuid } = options;
  const validateList = [
    validateOption(dsn, "dsn", "string"),
    validateOption(appName, "appName", "string"),
    validateOption(appVersion, "appVersion", "string"),
    validateOption(appCode, "appCode", "string"),
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

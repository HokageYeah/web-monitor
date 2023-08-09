import { InitOptions } from "../types/options";
/**
 * 管理全局的参数
 */
export class Options implements InitOptions {
  dsn = ""; // 上报地址
  appName = ""; // 应用名称
  appCode = ""; // 应用code
  appVersion = ""; // 应用版本
  userUuid = ""; // 用户id(外部填充进来的id)

  constructor(initOptions: InitOptions) {
    
  }
}

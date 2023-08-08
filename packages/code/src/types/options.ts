import { EventBus } from "../libs/eventBus";

interface Pv {
  core?: boolean; // 是否发送页面跳转相关数据
}
// sdk 配置
export interface InitOptions {
  dsn: string; // 上报地址（上传地址）
  appName: string; // 应用名称
  appCode?: string; // 应用code
  appVersion?: string; // 应用版本
  userUuid?: string; // 用户id(外部填充进来的id)
}

export interface RecordEventScope {
  scope: string;
  eventList: any[];
}

export interface AnyFun {
  (...args: any[]): any;
}

export interface WebMonitor {
  eventBus: EventBus;
  yeahasdsd: string;
  transportData: any
}

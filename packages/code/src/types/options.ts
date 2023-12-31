import { EventBus } from "../libs/eventBus";
import { NetStatus } from "../libs/net-status";

interface Pv {
  core?: boolean; // 是否发送页面跳转相关数据
}
// sdk 配置
export interface InitOptions {
  dsn: string; // 上报地址（上传地址）
  appName: string; // 应用名称
  appCode?: string; // 应用code
  appVersion?: string; // 应用版本
  userId?: string; // 用户id(外部填充进来的id)
  isRecordScreen?: boolean; // 是否开启录屏
  isHttpError?: boolean; // 是否开启请求报错拦截。
  beforeSendData?: (data: any) => any; // 上报数据前的 回调hook
  afterSendData?: (data: any) => void; // 上报数据后的 回调hook
  cacheMaxLength?: number; // 上报数据最大缓存数
  cacheWatingTime?: number; // 上报数据最大等待时间
  performance?: Performance | boolean; // // 性能指标
  pv?: Pv | boolean; // PV配置
}

interface Performance {
  core?: boolean; // 是否采集静态资源、接口的相关数据
  firstResource?: boolean; // 是否采集首次进入页面的数据
  server?: boolean; // 是否采集接口请求
}

export interface RecordEventScope {
  scope: string;
  eventList: any[];
}

export interface AnyFun {
  (...args: any[]): any;
}

export type VoidFun = {
  (...args: any[]): void;
};
export interface WebMonitor {
  eventBus: EventBus;
  yeahasdsd: string;
  transportData: any;
  options: InitOptions;
  netStatus: NetStatus;
  firstScreen: any // 首屏信息
  deviceInfo: {
    [key: string]: any;
  };
}

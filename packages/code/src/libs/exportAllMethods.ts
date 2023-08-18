// 向外暴露的方法

import { emitError } from "./error";
import { options } from "./options";
import { unzip } from "./recordscreen";

/**
 * 解压错误录屏数据
 */
export function unzipRecordScreen(recordscreen: string) {
  return unzip(recordscreen);
}

/**
 * vue2中解决vue拦截错误的暴露方法
 * 主动出发error上报
 * @param eventId 事件ID
 * @param message 错误信息
 * @param options 自定义配置信息
 */

export function triggerError(options: any) {
  emitError(options);
}

/**
 * 设置用户id
 * @param id 用户id
 */

export function setUserUuid(userid: string) {
  options.userUuid = userid;
}

/**
 * 获取设置用户id
 * @param id 用户id
 */
export function getUserUuid(userid: string) {
  return options.userUuid;
}
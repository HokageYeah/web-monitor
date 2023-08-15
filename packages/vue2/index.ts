import { InitOptions, init } from "@web-monitor/code";

function install(Vue: any, options: InitOptions) {
  // 全局错误处理器
  const handler = Vue.config.errorHandler;
  console.log('Vue.config.errorHandler=====');
  Vue.config.errorHandler = function (err: any, vm: any, info: any) {
    // 在这里处理错误，例如输出错误信息到控制台
    console.error('Error---:', err);
    console.error('Component---:', vm);
    console.error('Info:---', info);
  }
  init(options);
}
export default { install };
export * from "@web-monitor/code";

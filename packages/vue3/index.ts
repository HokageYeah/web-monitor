import { InitOptions, init } from "@web-monitor/code";

function install(app: any, options: InitOptions) {
  // 全局错误处理器
  app.config.errorHandler = (err: any, vm: any, info: any) => {
    // 在这里可以处理错误，例如打印错误信息或发送到服务器
    console.log("vue3-Error:", err);
    console.log("vue3-Component:", vm);
    console.log("vue3-Additional Info:", info);
  };
  init(options);
}

export default { install };
export * from "@web-monitor/code";
import { initRecordScreen, getRecordEvent } from "./src/libs/recordscreen";
import type { InitOptions } from "./src/types/options";

function init(options: InitOptions): void {
  console.log("vue3插件初始化成功", options.dsn, options.appName);
  window.addEventListener("error", (error) => {
    console.log("error----", error);
  });
  window.onerror = function (msg, url, line, col, error) {
    console.log("onerror----", msg, url, line, col, error);
  };

  // unhandledrejection 可以捕获Promise中的错误 ✅
  window.addEventListener("unhandledrejection", function (e) {
    console.log("可以捕获Promise中的错误", e);
    // preventDefault阻止传播，不会在控制台打印
    e.preventDefault();
  });  


  // 初始化各个业务模块
  initRecordScreen()
}

export { InitOptions, init, getRecordEvent };

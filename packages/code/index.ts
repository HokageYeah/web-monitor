import { initError } from "./src/libs/error";
import { initOptions } from "./src/libs/options";
import { initRecordScreen, getRecordEvent, unzip } from "./src/libs/recordscreen";
import { initReplace } from "./src/libs/replaceApi";
import { initTransportData } from "./src/libs/reportData";
import type { InitOptions } from "./src/types/options";
import { _global, _support } from "./src/utils/global";

function init(options: InitOptions): void {
  console.log("vue3插件初始化成功", options.dsn, options.appName);
  //   window.addEventListener("error", (error) => {
  //     console.log("error----", error);
  //   });
  //   window.onerror = function (msg, url, line, col, error) {
  //     console.log("onerror----", msg, url, line, col, error);
  //   };

  //   // unhandledrejection 可以捕获Promise中的错误 ✅
  //   window.addEventListener("unhandledrejection", function (e) {
  //     console.log("可以捕获Promise中的错误", e);
  //     // preventDefault阻止传播，不会在控制台打印
  //     e.preventDefault();
  //   });

  // 如果sdk已经有了，则不需要在初始化一遍
  if (_global.__webMonitorInit__) return;  
  if (!initOptions(options)) return
  console.log('初始化init----',_support.options);

  // 初始化
  initReplace();
  initTransportData()

  // 初始化各个业务模块
  initError();
  initRecordScreen();

  // 初始化成功设置为true
  _global.__webMonitorInit__ = true;
}

export { InitOptions, init, getRecordEvent, unzip };

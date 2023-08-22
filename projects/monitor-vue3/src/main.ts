import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import webMonitor from "@web-monitor/vue3";

const app = createApp(App);

app.use(ElementPlus);
app.use(webMonitor, {
  dsn: "http://localhost:8080/api/reportData",
  appName: "测试vue3",
  isRecordScreen: true,
  isHttpError: true,
  cacheWatingTime: 0,
  afterSendData: (data: any) => {
    console.log("我是发送后的钩子函数回调了-----", data);
    // @ts-ignore
    if (window.getAllMonitorList) {
      // @ts-ignore
      window.getAllMonitorList();
    }
  },
  beforeSendData: (data: any) => {
    console.log("我是发送前面的钩子函数回调了-----", data);
    return data
  },
});
app.mount("#app");

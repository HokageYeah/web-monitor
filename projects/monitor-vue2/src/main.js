import Vue from "vue";
import App from "./App.vue";
import webMonitor from "@web-monitor/vue2";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(webMonitor, {
  dsn: "http://localhost:8081/api/reportData",
  appName: "测试vue2",
  isRecordScreen: false,
  isHttpError: true, 
  cacheWatingTime: 0,
  afterSendData: (data) => {
    console.log("vue2我是发送后的钩子函数回调了-----", data);
    // @ts-ignore
    if (window.getAllMonitorList) {
      // @ts-ignore
      window.getAllMonitorList();
    }
  },
  beforeSendData: (data) => {
    console.log("vue2我是发送前面的钩子函数回调了-----", data);
    return data
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");

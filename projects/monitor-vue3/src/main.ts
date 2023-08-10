import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import webMonitor from '@web-monitor/vue3'

const app = createApp(App)

app.use(ElementPlus)
app.use(webMonitor, {
    dsn: 'http://localhost:8080/api/reportData',
    appName: '测试vue3'
})
app.mount('#app')
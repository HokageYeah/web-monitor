<div align="center">
    <h1>web-monitor 前端监控插件</h1>
    <p>
    为前端项目提供【"异常"、"前端异常采集"、（一期）】监控
   </p>
</div>

## 运行
```
pnpm install
<!-- vue2 -->
pnpm -F monitor-vue2 serve 
或者：pnpm -F monitor-vue2 start 
<!-- vue3 -->
pnpm -F monitor-vue3 start 

<!-- 打包 -->
pnpm run  build:rollup

<!-- Mac 上传到npm -->
pnpm run publishm:private <npm私服：服务器根据自己本地配置>
pnpm run publishm:public <npm公网>


<!-- Windows 上传到npm -->
pnpm run publishw:private <npm私服：服务器根据自己本地配置>
pnpm run publishw:public <npm公网>
```

## 说明
>  ### 1、插件入参说明：


  | 入参            | 类型     | 是否必传 | 说明                                            |
  | :-------------- | :------- | :------- | :---------------------------------------------- |
  | dsn             | string   | 必传     | 上报地址（上传地址）                            |
  | appName         | string   | 必传     | 应用名称                                        |
  | appCode         | string   | 非必传   | 应用code                                        |
  | appVersion      | string   | 非必传   | 应用版本                                        |
  | userId          | string   | 非必传   | 用户id(外部填充进来的id)                        |
  | isRecordScreen  | boolean  | 非必传   | 是否开启录屏（默认false）                       |
  | isHttpError     | boolean  | 非必传   | 是否开启请求报错拦截（默认false）               |
  | beforeSendData  | Function | 非必传   | 上报数据前的 回调hook。例如：(data: any)=>any;  |
  | afterSendData   | Function | 非必传   | 上报数据后的 回调hook。例如：(data: any)=>void; |
  | cacheMaxLength  | number   | 非必传   | 上报数据最大缓存数(默认5)                       |
  | cacheWatingTime | number   | 非必传   | 上报数据最大等待时间(默认1s)                    |


  
> ### 2、上报参数说明（上报接口入参）：

 #### ①、js、异步、资源加载错误：
 举例：
 ```shell
 {
  eventInfo: [
    {},
    {},
  ]
 }
 ```
 <strong style="color:orange;font-size:14px;">eventInfo说明：</strong>
  | 入参      | 类型  | 值                  | 说明     |
  | :-------- | :---- | :------------------ | :------- |
  | eventInfo | Array | [eventObj,eventObj] | 事件信息 |

 <strong style="color:orange;font-size:14px;">eventObj说明：</strong>
  | 入参           | 类型   | 值             | 说明                                  |
  | :------------- | :----- | :------------- | :------------------------------------ |
  | eventType      | string | error          | 事件类型                              |
  | eventCode      | string | code           | 错误事件编码。此时为code              |
  | errMessage     | string |                | 报错信息                              |
  | triggerPageUrl | string |                | 报错页面URL                           |
  | errStack       | string |                | 完整的错误信息                        |
  | line           | number |                | 错误信息发生行数（特有）              |
  | col            | number |                | 错误信息发生列数                      |
  | userId         | string |                | 用户id（没有则为空）                  |
  | triggerTime    | string |                | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码 | 错误录屏数据 （没有开启则没有这个值） |
  | deviceInfo     | object |                | 设备类型                              |
  
  <strong style="color:orange;font-size:14px;">deviceInfo说明：</strong>
  | 入参           | 类型   | 值                                                 | 说明                                                                     |
  | :------------- | :----- | :------------------------------------------------- | :----------------------------------------------------------------------- |
  | browser        | string | Chrome 等                                          | 浏览器名称                                                               |
  | browserVersion | string | 116.0.0.0 等                                       | 浏览器版本                                                               |
  | device         | string | Macintosh（你使用的是 Macintosh 型号的设备。）     | 指用户使用的具体设备型号或名称                                           |
  | device_type    | string | 个人电脑 (PC)、手机 (Mobile)、平板电脑 (Tablet) 等 | 指设备的一般类型或类别，                                                 |
  | os             | string | Mac OS 等                                          | 操作系统名称                                                             |
  | osVersion      | string | 116.0.0.0 等                                       | 操作系统版本号                                                           |
  | ua             | string | 116.0.0.0 等                                       | 用户代理（User Agent），是一个字符串，包含了浏览器和操作系统等信息的描述 |


  #### ②、资源加载错误：
   举例：
 ```shell
 {
  eventInfo: [
    {},
    {},
  ]
 }
 ```

  <strong style="color:orange;font-size:14px;">eventInfo说明：</strong>
  | 入参      | 类型  | 值                  | 说明     |
  | :-------- | :---- | :------------------ | :------- |
  | eventInfo | Array | [eventObj,eventObj] | 事件信息 |

 <strong style="color:orange;font-size:14px;">eventObj说明：</strong>
  | 入参           | 类型   | 值                                  | 说明                                  |
  | :------------- | :----- | :---------------------------------- | :------------------------------------ |
  | initiatorType  | string | img/video                           | 通过某种方式请求的资源                |
  | eventType      | string | error                               | 事件类型                              |
  | requestUrl     | string | 如："https://www.baidu.com/as.webp" | 请求资源具体url                       |
  | eventCode      | string | resource                            | 错误事件编码。此时为resource          |
  | errMessage     | string |                                     | 报错信息                              |
  | triggerPageUrl | string |                                     | 报错页面URL                           |
  | userId         | string |                                     | 用户id（没有则为空）                  |
  | triggerTime    | string |                                     | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码                      | 错误录屏数据 （没有开启则没有这个值） |
  | deviceInfo     | object |                                     | 设备类型                              |

  <strong style="color:orange;font-size:14px;">deviceInfo说明：</strong>
  | 入参           | 类型   | 值                                                 | 说明                                                                     |
  | :------------- | :----- | :------------------------------------------------- | :----------------------------------------------------------------------- |
  | browser        | string | Chrome 等                                          | 浏览器名称                                                               |
  | browserVersion | string | 116.0.0.0 等                                       | 浏览器版本                                                               |
  | device         | string | Macintosh（你使用的是 Macintosh 型号的设备。）     | 指用户使用的具体设备型号或名称                                           |
  | device_type    | string | 个人电脑 (PC)、手机 (Mobile)、平板电脑 (Tablet) 等 | 指设备的一般类型或类别，                                                 |
  | os             | string | Mac OS 等                                          | 操作系统名称                                                             |
  | osVersion      | string | 116.0.0.0 等                                       | 操作系统版本号                                                           |
  | ua             | string | 116.0.0.0 等                                       | 用户代理（User Agent），是一个字符串，包含了浏览器和操作系统等信息的描述 |

  #### ③、xhr、fetch、axios请求错误：
     举例：
 ```shell
 {
  eventInfo: [
    {},
    {},
  ]
 }
 ```

  <strong style="color:orange;font-size:14px;">eventInfo说明：</strong>
  | 入参      | 类型  | 值                  | 说明     |
  | :-------- | :---- | :------------------ | :------- |
  | eventInfo | Array | [eventObj,eventObj] | 事件信息 |

 <strong style="color:orange;font-size:14px;">eventObj说明：</strong>

  | 入参           | 类型   | 值             | 说明                                  |
  | :------------- | :----- | :------------- | :------------------------------------ |
  | eventType      | string | error          | 事件类型                              |
  | eventCode      | string | server         | 错误事件编码。此时为server            |
  | errMessage     | string |                | 报错信息                              |
  | requestUrl     | string |                | 报错请求地址URL                       |
  | responseStatus | number | 0、404、405... | 请求返回状态码                        |
  | requestMethod  | string | get、post...   | 发送请求方法                          |
  | requestType    | string | xhr、fetch...  | 前端请求的类型                        |
  | requestParams  | string |                | 前端请求的参数                        |
  | userId         | string |                | 用户id（没有则为空）                  |
  | triggerPageUrl | string |                | 报错页面URL                           |
  | triggerTime    | string |                | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码 | 错误录屏数据 （没有开启则没有这个值） |
  | deviceInfo     | object |                | 设备类型                              |
  
  <strong style="color:orange;font-size:14px;">deviceInfo说明：</strong>
  | 入参           | 类型   | 值                                                 | 说明                                                                     |
  | :------------- | :----- | :------------------------------------------------- | :----------------------------------------------------------------------- |
  | browser        | string | Chrome 等                                          | 浏览器名称                                                               |
  | browserVersion | string | 116.0.0.0 等                                       | 浏览器版本                                                               |
  | device         | string | Macintosh（你使用的是 Macintosh 型号的设备。）     | 指用户使用的具体设备型号或名称                                           |
  | device_type    | string | 个人电脑 (PC)、手机 (Mobile)、平板电脑 (Tablet) 等 | 指设备的一般类型或类别，                                                 |
  | os             | string | Mac OS 等                                          | 操作系统名称                                                             |
  | osVersion      | string | 116.0.0.0 等                                       | 操作系统版本号                                                           |
  | ua             | string | 116.0.0.0 等                                       | 用户代理（User Agent），是一个字符串，包含了浏览器和操作系统等信息的描述 |
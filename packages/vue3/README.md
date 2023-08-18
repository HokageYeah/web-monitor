<div align="center">
    <h1>web-monitor 前端监控插件</h1>
    <p>
    为前端项目提供【"异常"、"前端异常采集"、（一期）】监控 -vue3
   </p>
</div>


## 说明
>  ### 1、插件入参说明：


  | 入参           | 类型     | 是否必传 | 说明                                            |
  | :------------- | :------- | :------- | :---------------------------------------------- |
  | dsn            | string   | 必传     | 上报地址（上传地址）                            |
  | appName        | string   | 必传     | 应用名称                                        |
  | appCode        | string   | 非必传   | 应用code                                        |
  | appVersion     | string   | 非必传   | 应用版本                                        |
  | userUuid       | string   | 非必传   | 用户id(外部填充进来的id)                        |
  | isRecordScreen | boolean  | 非必传   | 是否开启录屏（默认false）                       |
  | isHttpError    | boolean  | 非必传   | 是否开启请求报错拦截（默认false）               |
  | beforeSendData | Function | 非必传   | 上报数据前的 回调hook。例如：(data: any)=>void; |
  | afterSendData  | Function | 非必传   | 上报数据后的 回调hook。例如：(data: any)=>void; |


  
> ### 2、上报参数说明（上报接口入参）：

 #### ①、js、异步、资源加载错误：
  
  | 入参           | 类型   | 值             | 说明                                  |
  | :------------- | :----- | :------------- | :------------------------------------ |
  | eventType      | string | error          | 事件类型                              |
  | eventId        | string | code           | 错误事件ID。此时为code                |
  | errMessage     | string |                | 报错信息                              |
  | triggerPageUrl | string |                | 报错页面URL                           |
  | errStack       | string |                | 完整的错误信息                        |
  | line           | number |                | 错误信息发生行数（特有）              |
  | col            | number |                | 错误信息发生列数                      |
  | userUuid       | string |                | 用户id（没有则为空）                  |
  | triggerTime    | string |                | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码 | 错误录屏数据 （没有开启则没有这个值） |

  #### ②、资源加载错误：

  | 入参           | 类型   | 值                                  | 说明                                  |
  | :------------- | :----- | :---------------------------------- | :------------------------------------ |
  | initiatorType  | string | img/video                           | 通过某种方式请求的资源                |
  | eventType      | string | error                               | 事件类型                              |
  | requestUrl     | string | 如："https://www.baidu.com/as.webp" | 请求资源具体url                       |
  | eventId        | string | code                                | 错误事件ID。此时为code                |
  | errMessage     | string |                                     | 报错信息                              |
  | triggerPageUrl | string |                                     | 报错页面URL                           |
  | userUuid       | string |                                     | 用户id（没有则为空）                  |
  | triggerTime    | string |                                     | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码                      | 错误录屏数据 （没有开启则没有这个值） |

  #### ③、xhr、fetch、axios请求错误：

  | 入参           | 类型   | 值             | 说明                                  |
  | :------------- | :----- | :------------- | :------------------------------------ |
  | eventType      | string | error          | 事件类型                              |
  | eventId        | string | server         | 错误事件ID。此时为server              |
  | errMessage     | string |                | 报错信息                              |
  | requestUrl     | string |                | 报错请求地址URL                       |
  | responseStatus | number | 0、404、405... | 请求返回状态码                        |
  | requestMethod  | string | get、post...   | 发送请求方法                          |
  | requestType    | string | xhr、fetch...  | 前端请求的类型                        |
  | requestParams  | string |                | 前端请求的参数                        |
  | userUuid       | string |                | 用户id（没有则为空）                  |
  | triggerPageUrl | string |                | 报错页面URL                           |
  | triggerTime    | string |                | 报错事件发生时间                      |
  | recordScreen   | string | base64压缩编码 | 错误录屏数据 （没有开启则没有这个值） |

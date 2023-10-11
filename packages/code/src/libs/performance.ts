import { EVENTTYPES, SEDNEVENTTYPES, SENDCODE } from "../common/constant";
import {
  getLocationHref,
  getTimestamp,
  isObjValidKey,
  normalizeObject,
  on,
} from "../utils";
import { _global, _support } from "../utils/global";
import { eventBus } from "./eventBus";
import { options } from "./options";
import { transportData } from "./reportData";

// 兼容判断
const supported = {
  performance: !!(_global.performance && _global.performance.now),
  getentriesByType: !!(
    _global.performance && _global.performance.getEntriesByType
  ),
  PerformanceObserver: "PerformanceObserver" in _global,
  MutationObserver: "MutationObserver" in _global,
  PerformanceNavigationTiming: "PerformanceNavigationTiming" in _global,
};

// 资源属性
const performanceEntryAttrs = {
  initiatorType: "",
  transferSize: 0,
  encodedBodySize: 0,
  decodedBodySize: 0,
  duration: 0,
  redirectStart: 0,
  redirectEnd: 0,
  startTime: 0,
  fetchStart: 0,
  domainLookupStart: 0,
  domainLookupEnd: 0,
  connectStart: 0,
  connectEnd: 0,
  requestStart: 0,
  responseStart: 0,
  responseEnd: 0,
  workerStart: 0,
};

export function initPerformance() {
  debugger;
  console.log("initPerformance-------", options.performance);
  if (!options.performance.firstResource && !options.performance.core) return;
  // 初始化方法可能在onload事件之后才执行,此时不会触发load事件了 (例如delayInit)
  // 检查document.readyState属性来判断onload事件是否会被触发
  //   监听首屏结束时间：
  // 使用 DOM 的 readystatechange 事件来监听文档状态的变化。
  // 在事件处理程序中判断当前的文档状态是否为 'complete'，即页面已经完全加载和渲染完成。
  // 如果文档状态为 'complete'，记录当前时间作为首屏结束时间。
  console.log("readyState---------", document.readyState);
  if (document.readyState === "complete") {
    console.log("首屏结束时间---------", performance.now());
    observeResource();
  } else {
    eventBus.addSubscribe({
      type: EVENTTYPES.LOAD,
      callback: () => {
        debugger;
        console.log("EVENTTYPES.LOAD---------");
        observeResource();
      },
    });
  }
}

/**
 * 页面资源加载性能数据
 */
function observeResource() {
  // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
  if (supported.performance && options.performance.firstResource) {
    observeNavigationTiming();
  }
  // 性能数据-是否采集静态资源、接口的相关数据
  if (supported.performance && options.performance.core) {
    traceResourcePerformance(_global.performance);
    debugger;
    if (supported.PerformanceObserver) {
      // 监听异步资源加载性能数据 chrome≥52
      const observer = new PerformanceObserver(traceResourcePerformance);
      observer.observe({ entryTypes: ["resource"] });
    } else if (supported.MutationObserver) {
      // }if (supported.MutationObserver) {
      debugger;
      // 监听资源、DOM更新操作记录 chrome≥26 ie≥11
      observeSourceInsert();
    }
  }
}

/**
 * 发送页面性能数据
 */
function observeNavigationTiming() {
  const times: any = {};
  const { performance } = _global;
  let t: any = performance.timing;
  times.fmp = 0; // 首屏时间 (渲染节点增量最大的时间点)
  debugger;
  if (supported.getentriesByType) {
    const paintEntries = performance.getEntriesByType("paint");
    if (paintEntries.length) {
      times.fmp = paintEntries[paintEntries.length - 1].startTime;
    }

    // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
    if (supported.PerformanceNavigationTiming) {
      const nt2Timing = performance.getEntriesByType("navigation")[0];
      if (nt2Timing) t = nt2Timing;
    }
  }

  // 从开始发起这个页面的访问开始算起,减去重定向跳转的时间,在performanceV2版本下才进行计算
  // v1版本的fetchStart是时间戳而不是相对于访问起始点的相对时间
  if (times.fmp && supported.PerformanceNavigationTiming) {
    times.fmp -= t.fetchStart;
  }
  // 白屏时间 (从请求开始到浏览器开始解析第一批HTML文档字节的时间差)
  times.fpt = t.responseEnd - t.fetchStart;

  times.tti = t.domInteractive - t.fetchStart; // 首次可交互时间

  times.ready = t.domContentLoadedEventEnd - t.fetchStart; // HTML加载完成时间

  times.loadon = t.loadEventStart - t.fetchStart; // 页面完全加载时间

  times.firstbyte = t.responseStart - t.domainLookupStart; // 首包时间

  times.dns = t.domainLookupEnd - t.domainLookupStart; // dns查询耗时

  times.appcache = t.domainLookupStart - t.fetchStart; // dns缓存时间

  times.tcp = t.connectEnd - t.connectStart; // tcp连接耗时

  times.ttfb = t.responseStart - t.requestStart; // 请求响应耗时

  times.trans = t.responseEnd - t.responseStart; // 内容传输耗时

  times.dom = t.domInteractive - t.responseEnd; // dom解析耗时

  times.res = t.loadEventStart - t.domContentLoadedEventEnd; // 同步资源加载耗时

  times.ssllink = t.connectEnd - t.secureConnectionStart; // SSL安全连接耗时

  times.redirect = t.redirectEnd - t.redirectStart; // 重定向时间

  times.unloadTime = t.unloadEventEnd - t.unloadEventStart; // 上一个页面的卸载耗时

  // 各个时间数据
  const resultInfo = { ...times };
  debugger;
  console.log(resultInfo);
  _support.firstScreen = { ...resultInfo };

  transportData.emit(
    normalizeObject({
      ...resultInfo,
      userId: options.userId,
      eventType: SEDNEVENTTYPES.PERFORMANCE,
      eventCode: SENDCODE.PAGE,
      triggerPageUrl: getLocationHref(),
      triggerTime: getTimestamp(),
      deviceInfo: _support.deviceInfo, // 获取设备信息
    })
  );
}

/**
 * 发送页面追踪资源加载性能数据
 * (支持getEntriesByType的情况下才追踪)
 */
function traceResourcePerformance(performance: PerformanceObserverEntryList) {
  // 排除xmlhttprequest类型,服务器有响应便会记录,包括404的请求,转由http-request模块负责记录请求数据,区分请求状态
  // 同时也会排除一些其他类型,比如在引入一个script后会触发一次性能监控,它的类型是beacon,这一次的要排除
  // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
  const observerTypeList = ["img", "script", "link", "audio", "video", "css"];
  // 获取页面加载的资源列表，同时可以结合  initiatorType 字段来判断资源类型，对资源进行过滤
  const entries = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];
  debugger;
  console.log(entries);
  // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
  const filterEntries: PerformanceResourceTiming[] = entries.filter((entry) => {
    return observerTypeList.includes(entry.initiatorType);
  });
  debugger;
  console.log(filterEntries);
  const recordsList: any[] = [];
  filterEntries.forEach((entry) => {
    const value: any = {};
    Object.keys(performanceEntryAttrs).forEach((key) => {
      if (isObjValidKey(key, entry)) {
        value[key] = entry[key];
      }
    });
    recordsList.push(
      normalizeObject({
        ...value,
        userId: options.userId,
        eventType: SEDNEVENTTYPES.PERFORMANCE,
        eventCode: SENDCODE.PAGE,
        requestUrl: entry.name,
        triggerPageUrl: getLocationHref(),
        triggerTime: getTimestamp(),
        deviceInfo: _support.deviceInfo, // 获取设备信息
      })
    );
  });
  debugger;
  console.log(recordsList);
  if (recordsList.length) transportData.emit(recordsList);
  return recordsList;
}
/**
 * 监听 - 异步插入的script、link、img, DOM更新操作记录
 */
function observeSourceInsert() {
  const tags = ["img", "script", "link"];
  // 检测异步插入的script、link、img,会有一些延迟,一些连接建立、包体大小的数据会丢失,精度下降
  // MutationObserver DOM3 Events规范,是个异步监听,只有在全部DOM操作完成之后才会调用callback
  const observer = new MutationObserver((mutationsList, observer) => {
    debugger;
    console.log('observeSourceInsert-----', mutationsList);
    console.log(observer);
    for (const mutation of mutationsList) {
      const startTime = getTimestamp();
      debugger;
      console.log(mutation);
      const { addedNodes = [] } = mutation;
      addedNodes.forEach((node: Node & { src?: string; href?: string }) => {
        const { nodeName } = node;
        debugger;
        if (tags.indexOf(nodeName.toLowerCase()) !== -1) {
          on(node as Document, EVENTTYPES.LOAD, function () {
            debugger;
            transportData.emit(
              normalizeObject({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventCode: SENDCODE.RESOURCE,
                requestUrl: node.src || node.href,
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                triggerPageUrl: getLocationHref(),
                deviceInfo: _support.deviceInfo, // 获取设备信息
              })
            );
          });
          on(node as Document, EVENTTYPES.ERROR, function () {
            debugger;
            transportData.emit(
              normalizeObject({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventCode: SENDCODE.RESOURCE,
                requestUrl: node.src || node.href,
                responseStatus: "error",
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                triggerPageUrl: getLocationHref(),
                deviceInfo: _support.deviceInfo, // 获取设备信息
              })
            );
          });
        }
      });
    }
  });
  observer.observe(_global.document, {
    subtree: true, // 是否监听目标节点及其所有后代节点的变化。
    childList: true, // 表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化。是否监听目标节点的子节点的添加或删除。
    // attributes: true, // 是否监听目标属性的改变
    // attributeFilter: ['src', 'href'] // 要观察的属性
  });
}

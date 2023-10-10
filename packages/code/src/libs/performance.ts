import { EVENTTYPES, SEDNEVENTTYPES, SENDCODE } from "../common/constant";
import { getLocationHref, getTimestamp, normalizeObject } from "../utils";
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
    // 待开发
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
  debugger
  console.log(resultInfo);
  _support.firstScreen = { ...resultInfo }

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

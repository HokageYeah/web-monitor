<template>
  <div class="toperror">
    <el-button type="primary" size="small" @click="codeError()"
      >点击js报错</el-button
    >
    <el-button type="primary" size="small" @click="promiseError()"
      >点击promise报错</el-button
    >
    <el-button type="primary" size="small" @click="resourceError()"
      >点击加载资源报错</el-button
    >
    <img
      class="resu-img"
      v-if="showImgTrue"
      src="https://www.baidu.com/as.webp"
    />
    <el-button type="primary" size="small" @click="errorPlay()"
      >点击播放</el-button
    >
    <el-button type="primary" size="small" @click="asyncError"
      >异步错误</el-button
    >
    <el-button type="info" size="small" @click="xhrError"
      >xhr请求报错</el-button
    >
    <el-button type="warning" size="small" @click="fetchError"
      >fetch请求报错</el-button
    >
    <el-dialog
      v-model="errDialogVisible"
      width="1024px"
      top="10vh"
      :show-close="false"
    >
      <div ref="recordscreen" v-if="errDialogVisible"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { ref, nextTick, onMounted } from "vue";
import { getRecordEvent } from "@web-monitor/vue3";
defineOptions({ name: "App" });
const errDialogVisible = ref(false);
const recordscreen = ref(null);
const showImgTrue = ref(false);

onMounted(() => {
  // @ts-ignore
  window.getAllMonitorList = getAllMonitorList;
});

const codeError = () => {
  console.log("点击报错");
  const a = {};
  // @ts-ignore
  a.split("/");
};
const promiseError = () => {
  // const promiseWrap = () =>
  //   new Promise((_resolve, reject) => {
  //     reject("promise --- reject");
  //   });
  // promiseWrap().then((res) => {
  //   console.log("res", res);
  // });
  new Promise<void>((resolve) => {
    let person: any = {};
    person.name.age();
    resolve();
  });
};
const asyncError = () => {
  setTimeout(() => {
    JSON.parse("");
  });
};
const resourceError = () => {
  showImgTrue.value = true;
};
const xhrError = () => {
  debugger;
  let _this = this;
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "https://abc.com/test/api");
  ajax.setRequestHeader("content-type", "application/json");
  ajax.onreadystatechange = function () {
    if (ajax.readyState == 4) {
      debugger;
      console.log(_this);
    }
    if (ajax.status === 200 || ajax.status === 304) {
      console.log("ajax", ajax);
    }
  };
  ajax.send();
  ajax.addEventListener("loadend", () => {});
};
const errorPlay = () => {
  const screenList = getRecordEvent();
  debugger;
  errDialogVisible.value = true;
  nextTick(() => {
    new rrwebPlayer({
      target: recordscreen.value as unknown as HTMLElement,
      props: {
        events: screenList,
        UNSAFE_replayCanvas: true,
      },
    });
  });
};

const getAllMonitorList = () => {
  console.log("----getAllMonitorList-----");
  const params = {
    method: "POST", // 设置请求方法为 POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "zhangsan", age: 18 }),
  };
  fetch("http://localhost:8080/api/getAllMonitorList", params)
    .then((res) => {
      // 处理返回的数据
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
};

const fetchError = () => {
  fetch("https://jsonplaceholder.typicode.com/posts/a", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ id: 1 }),
  })
    .then((res) => {
      if (res.status == 404) {
        debugger;
      }
    })
    .catch(() => {
      debugger;
    });
};
</script>
<style scoped lang="scss">
.toperror {
  :deep(.el-dialog__header),
  :deep(.el-dialog__body) {
    padding: 0px;
  }
  .resu-img {
    display: block;
    width: 200px;
    height: 200px;
    margin-right: 20px;
  }
}
</style>

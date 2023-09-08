<template>
  <div class="toperror">
    <el-button id="codeErr" type="primary" size="small" @click="codeError()"
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
    <el-button type="primary" size="small" @click="asyncError"
      >异步错误</el-button
    >
    <el-button type="success" size="small" @click="xhrSuccess"
      >xhr正常请求-get</el-button
    >
    <el-button type="info" size="small" @click="xhrError"
      >xhr请求报错</el-button
    >
    <el-button type="info" size="small" @click="onClickXhrGetError"
      >xhr异常请求-get</el-button
    >
    <el-button type="info" size="small" @click="onClickXhrPostError">
      xhr异常请求-post
    </el-button>
    <el-button type="danger" size="small" @click="fetchError"
      >fetch请求报错</el-button
    >
    <el-button type="danger" size="small" @click="onClickFetchGetError">
      Fetch异常请求-get
    </el-button>
    <el-button type="danger" size="small" @click="onClickFetchPostError">
      Fetch异常请求-post
    </el-button>
    <el-button type="primary" size="small" @click="onClickAxiosError">
      axios异常请求-get
    </el-button>
    <el-button type="primary" size="small" @click="onClickAxiosPostError">
      axios异常请求-post
    </el-button>
    <el-button type="success" size="small" @click="errorPlay()"
      >点击播放</el-button
    >
    <el-button type="danger" size="small" @click="batchErrorA(10)">
      立即触发代码错误-10条
    </el-button>
    <el-button type="danger" size="small" @click="batchErrorAT(20)">
      异步触发代码错误-20条
    </el-button>
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
import axios from "axios";
import { unzipRecordScreen, setUserId } from "@web-monitor/vue3";
defineOptions({ name: "App" });
const errDialogVisible = ref(false);
const recordscreen = ref(null);
const showImgTrue = ref(false);
let playPath: any;

onMounted(() => {
  // @ts-ignore
  window.getAllMonitorList = getAllMonitorList;
  setUserId("123dd");
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
const xhrSuccess = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("get", "/getList?test=123");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("xhr-res", xhr.responseText);
    }
  };
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
const onClickXhrGetError = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/api/getList2?test=123");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("xhr-res", xhr.responseText);
    }
  };
};
const onClickXhrPostError = () => {
  const body = { username: "example", password: "123456" };
  const xhr = new XMLHttpRequest();
  xhr.open("post", "http://localhost:8080/api/setList2");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(JSON.stringify(body));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("xhr-res", xhr.responseText);
    }
  };
};
const errorPlay = () => {
  // const screenList = getRecordEvent();
  const screenList: any = unzipRecordScreen(playPath.recordScreen);
  console.log("screenList------", screenList);
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
    method: "GET", // 设置请求方法为 POST
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ name: "zhangsan", age: 18 }),
  };
  fetch("http://localhost:8080/api/getAllMonitorList", params)
    .then((res: any) => {
      // playPath = res.data.pop();
      // 处理返回的数据
      console.log(res);
      return res.json();
    })
    .then((res: any) => {
      playPath = res.data.pop();
      console.log("请求来了----？", playPath);
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

const onClickFetchGetError = () => {
  const params = new URLSearchParams();
  params.append("page", "1");
  params.append("limit", "10");

  fetch(`http://localhost:8080/api/getList2?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res)
    .then((res) => {
      console.log("featch-res", res);
    });
};
const onClickFetchPostError = () => {
  fetch("http://localhost:8080/api/setList2", {
    method: "POST",
    body: JSON.stringify({ test: "测试请求体" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res)
    .then((res) => {
      console.log("featch-res", res);
    });
};

const onClickAxiosError = () => {
  axios
    .get("http://localhost:8080/api/getList2", { params: { test: 123 } })
    .then((res) => {
      console.log("axios-res", res);
    })
    .catch((err) => {
      console.log("axios-err", err);
    });
};
const onClickAxiosPostError = () => {
  axios
    .post("http://localhost:8080/api/setList2", { test: 123 })
    .then((res) => {
      console.log("axios-res", res);
    })
    .catch((err) => {
      console.log("axios-err", err);
    });
};

// ------- 批量错误 -------
const batchErrorA = (num: number) => {
  for (let x = 1; x <= num; x++) {
    document.getElementById("codeErr")?.click();
  }
};
const batchErrorAT = (num: number) => {
  for (let x = 1; x <= num; x++) {
    setTimeout(() => {
      document.getElementById("codeErr")?.click();
    }, x * 300);
  }
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

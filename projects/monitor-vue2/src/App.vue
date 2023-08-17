<template>
  <div id="appmain">
    <div class="aaa">sdsds</div>
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
    <el-button type="primary" size="small" @click="asyncError"
      >异步错误</el-button
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
    <el-dialog
      :visible.sync="errDialogVisible"
      width="1024px"
      top="10vh"
      :show-close="false"
    >
      <div ref="recordscreen" v-if="errDialogVisible"></div>
    </el-dialog>
  </div>
</template>

<script>
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { unzipRecordScreen } from "@web-monitor/vue2";
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      showImgTrue: false,
      errDialogVisible: false,
      playPath: null,
    };
  },
  mounted() {
    window.getAllMonitorList = this.getAllMonitorList;
  },
  methods: {
    codeError() {
      console.log("点击报错");
      const a = {};
      // @ts-ignore
      a.split("/");
    },
    promiseError() {
      new Promise((resolve) => {
        let person = {};
        person.name.age();
        resolve();
      });
    },
    resourceError() {
      this.showImgTrue = true;
    },
    errorPlay() {
      // const screenList = getRecordEvent();
      const screenList = unzipRecordScreen(this.playPath.recordScreen);
      console.log("screenList------", screenList);
      console.log("screenList:this------", this.$refs.recordscreen);
      this.errDialogVisible = true;
      this.$nextTick(() => {
        console.log("screenList:this------", this.$refs.recordscreen);
        new rrwebPlayer({
          target: this.$refs.recordscreen,
          props: {
            events: screenList,
            UNSAFE_replayCanvas: true,
          },
        });
      });
    },
    getAllMonitorList() {
      console.log("----getAllMonitorList-----");
      const params = {
        method: "GET", // 设置请求方法为 POST
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ name: "zhangsan", age: 18 }),
      };
      fetch("http://localhost:8081/api/getAllMonitorList", params)
        .then((res) => {
          // playPath = res.data.pop();
          // 处理返回的数据
          console.log(res);
          return res.json();
        })
        .then((res) => {
          this.playPath = res.data.pop();
          console.log("请求来了----？", this.playPath);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    asyncError() {
      setTimeout(() => {
        JSON.parse("");
      });
    },
    xhrError() {
      let _this = this;
      let ajax = new XMLHttpRequest();
      ajax.open("GET", "https://abc.com/test/api");
      ajax.setRequestHeader("content-type", "application/json");
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
          console.log(_this);
        }
        if (ajax.status === 200 || ajax.status === 304) {
          console.log("ajax", ajax);
        }
      };
      ajax.send();
      ajax.addEventListener("loadend", () => {});
    },
    onClickXhrGetError() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:8081/api/getList2?test=123");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log("xhr-res", xhr.responseText);
        }
      };
    },
    onClickXhrPostError() {
      const body = { username: "example-vue2", password: "123456" };
      const xhr = new XMLHttpRequest();
      xhr.open("post", "http://localhost:8081/api/setList2");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(JSON.stringify(body));
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log("xhr-res", xhr.responseText);
        }
      };
    },
    fetchError() {
      fetch("https://jsonplaceholder.typicode.com/posts/a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ id: 1 }),
      })
        .then((res) => {
          if (res.status == 404) {
            console.log('404');
          }
        })
        .catch(() => {});
    },
    onClickFetchGetError() {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "10");
      params.append("vue2", "10");

      fetch(`http://localhost:8081/api/getList2?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res)
        .then((res) => {
          console.log("featch-res", res);
        });
    },
    onClickFetchPostError() {
      fetch("http://localhost:8081/api/setList2", {
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
    },
    onClickAxiosError() {
      axios
        .get("http://localhost:8081/api/getList2", {
          params: { test: "123-vue2" },
        })
        .then((res) => {
          console.log("axios-res", res);
        })
        .catch((err) => {
          console.log("axios-err", err);
        });
    },
    onClickAxiosPostError() {
      axios
        .post("http://localhost:8081/api/setList2", { test: "123--vue2" })
        .then((res) => {
          console.log("axios-res", res);
        })
        .catch((err) => {
          console.log("axios-err", err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
#appmain {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  .aaa {
    color: red;
  }
  ::v-deep .el-dialog__header,
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>

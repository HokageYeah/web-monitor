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
import { unzip } from "@web-monitor/vue2";
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
      const screenList = unzip(this.playPath.recordScreen);
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
  .aaa{
    color: red;
  }
  ::v-deep .el-dialog__header,
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}
</style>

<template>
  <div class="toperror">
    <el-button type="primary" size="small" @click="codeError()"
      >点击js报错</el-button
    >
    <el-button type="primary" size="small" @click="promiseError()"
      >点击promise报错</el-button
    >

    <el-button type="primary" size="small" @click="errorPlay()"
      >点击播放</el-button
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
import { ref, nextTick } from "vue";
import { getRecordEvent } from "@web-monitor/vue3";
defineOptions({ name: "App" });
const errDialogVisible = ref(false);
const recordscreen = ref(null);
const codeError = () => {
  console.log("点击报错");
  const a = {};
  // @ts-ignore
  a.split("/");
};
const promiseError = () => {
  const promiseWrap = () =>
    new Promise((_resolve, reject) => {
      reject("promise --- reject");
    });
  promiseWrap().then((res) => {
    console.log("res", res);
  });
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
</script>
<style scoped lang="scss">
.toperror {
  :deep(.el-dialog__header),
  :deep(.el-dialog__body) {
    padding: 0px;
  }
}
</style>

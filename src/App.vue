<template>
  <div id="app" :class="{ fixedWidth: true }">
    <el-tabs v-model="nowType" @tab-click="changeTab">
      <el-tab-pane label="常用" name="normal">
        <div class="normal-container">
          <div class="normal-item">
            <div class="normal-title">时间处理</div>
            <XTime />
          </div>
          <div class="normal-item">
            <div class="normal-title">计算器</div>
            <Cal />
          </div>
          <div class="normal-item">
            <div class="normal-title">编解码</div>
            <Decode />
          </div>
          <div class="normal-item">
            <div class="normal-title">链接</div>
            <XLink hideMenuBar="true" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="提醒" name="link"><Notice /></el-tab-pane>
      <el-tab-pane label="链接" name="notice"
        ><XLink hideMenuBar="false"
      /></el-tab-pane>
      <el-tab-pane label="模拟请求" v-if="isFull" name="sim"
        ><Sim
      /></el-tab-pane>
      <el-tab-pane label="JsonStuff" name="jsonStuff"
        ><JsonStuff :isFull="isFull"
      /></el-tab-pane>
      <el-tab-pane label="SqlToModel" name="sqlToModel"
        ><SqlToModel
      /></el-tab-pane>
      <el-tab-pane label="HtmlShow" v-if="isFull" name="HtmlShow"
        ><HtmlShow
      /></el-tab-pane>
      <el-tab-pane label="extractData" name="extractData"
        ><ExtractData
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import XTime from "./components/Time.vue";
import Decode from "./components/Decode.vue";
import Cal from "./components/Cal.vue";
import Sim from "./components/Sim.vue";
import HtmlShow from "./components/Html.vue";
import ExtractData from "./components/ExtractData.vue";
import XLink from "./components/Link.vue";
import SqlToModel from "./components/SqlToModel.vue";
import Notice from "./components/Notice.vue";
import JsonStuff from "./components/JsonStuff.vue";

const lastClickTabStorage = "last:click";

export default {
  name: "app",
  data() {
    return {
      nowType: "normal",
      isFull: true,
    };
  },
  created() {
    let item = localStorage.getItem(lastClickTabStorage);
    console.log("created", item);
    if (item !== "" && item !== null) {
      this.nowType = item;
    }

    item = sessionStorage.getItem("isOption");
    if (item === "0") {
      this.isFull = false;
    }
  },
  methods: {
    changeTab(tab) {
      this.nowType = tab.props.name;
      localStorage.setItem(lastClickTabStorage, this.nowType);
    },
  },
  components: {
    XTime,
    Decode,
    Cal,
    Sim,
    HtmlShow,
    XLink,
    SqlToModel,
    Notice,
    JsonStuff,
    ExtractData,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fixedWidth {
  width: 780px;
}
.fullWidth {
  width: 100%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.normal-container .normal-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.normal-item .normal-title {
  font-size: 14px;
}
</style>

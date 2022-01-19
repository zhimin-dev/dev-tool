<template>
  <div id="app" :class='{"fixedWidth": !isFull, "fullWidth" :isFull }'>
    <el-tabs v-model="nowType">
    <el-tab-pane label="常用" name="normal">
      <div class="normal-container">
        <div class="normal-item">
          <div class="normal-title">时间处理</div>
          <Time />
        </div>
        <div class="normal-item">
          <div class="normal-title">计算器</div>
          <Cal />
        </div>
        <div class="normal-item">
          <div class="normal-title">编解码</div>
          <Decode />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Json格式化" name="json"><Json :isFull = "isFull"/></el-tab-pane>
    <el-tab-pane label="链接" name="link"><Link /></el-tab-pane>
    <el-tab-pane label="模拟请求" v-if="isFull" name="sim"><Sim /></el-tab-pane>
    <el-tab-pane label="JsonToGo" name="jsonToGo"><JsonToGo /></el-tab-pane>
    <el-tab-pane label="HtmlShow" name="HtmlShow"><HtmlShow /></el-tab-pane>
    <el-tab-pane label="Iptv Checker"  v-if="isFull" name="Iptv"><Iptv /></el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import Time from './components/Time.vue';
import Json from './components/Json.vue';
import Decode from './components/Decode.vue';
import Cal from './components/Cal.vue';
import Sim from './components/Sim.vue';
import JsonToGo from './components/JsonToGo.vue';
import HtmlShow from './components/Html.vue';
import Link from './components/Link.vue';
import Iptv from './components/Iptv.vue';

export default {
  name: 'app',
  data() {
    return {
      nowType: 'normal',
      isFull: false,
    };
  },
  created() {
    const res = sessionStorage.getItem('isOption');
    if (res === '1') {
      this.isFull = true;
    }
  },
  components: {
    Time,
    Json,
    Decode,
    Cal,
    Sim,
    JsonToGo,
    HtmlShow,
    Link,
    Iptv,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fixedWidth {
  width: 700px;
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
.normal-container{
  .normal-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .normal-title{
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div class="setting-conatiner">
    <div class="one-setting">
      <div class="one-setting-head">wb爬虫设置</div>
      <div class="one-item">
        <div class="item-head">回调接口</div>
        <div class="item-content">
          <el-input
            v-model="wbSpider"
            class="one-input"
            size="small"
            placeholder=""
            @change="setWbSpider"
          ></el-input>
        </div>
      </div>
      <div class="one-item">
        <div class="item-head">是否开始任务</div>
        <div class="item-content">
          <el-switch
            v-model="startSpider"
            @change="startSpiderCall"
            active-text="开始"
            inactive-text="关闭"
          >
          </el-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wbSpider: "",
      startSpider: false,
      wbSpiderKey: "l:wbSpider",
      wbSpiderStartKey: "l:wb:spider:start",
    };
  },
  created() {
    this.wbSpider = localStorage.getItem(this.wbSpiderKey);
    const item = localStorage.getItem(this.wbSpiderStartKey);
    let isStart = false;
    if (item === "1") {
      isStart = true;
    }
    this.startSpider = isStart;
  },
  methods: {
    startSpiderCall() {
      if (chrome.storage !== undefined && this.wbSpider !== "") {
        chrome.storage.local.set(
          {
            wbSpider: this.wbSpider,
          },
          () => {
            console.log("设置回调接口爬成功");
          }
        );
        chrome.storage.local.set(
          {
            wbSpiderStart: this.startSpider,
          },
          () => {
            console.log("设置任务成功，请浏览相关页面！");
          }
        );
      }
      let item = "0";
      if (this.startSpider) {
        item = "1";
      }
      localStorage.setItem(this.wbSpiderStartKey, item);
    },
    setWbSpider() {
      localStorage.setItem(this.wbSpiderKey, this.wbSpider);
    },
  },
};
</script>

<style scoped>
.setting-conatiner {
  display: flex;
  flex-direction: column;
}

.one-setting {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}

.one-setting-head {
  width: 100%;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.one-item {
  display: flex;
  margin-bottom: 5px;
  flex-direction: column;
  align-items: baseline;
}

.item-head {
  margin-bottom: 5px;
}

.item-content {
  margin-left: 50px;
}

.one-input {
  width: 500px;
}
</style>

<template>
  <div class="json-container">
    <div class="json-text">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入sql创建语句"
        @change="inputJson"
        v-model="jsonText"
      >
      </el-input>
    </div>
    <div class="show-go" v-if="goStruct !== ''">
      <el-input
        type="textarea"
        :autosize="true"
        placeholder="显示的GoStruct"
        v-model="goStruct"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { sqlStrToGoTemplate } from "../utils/go/common";

export default {
  data() {
    return {
      jsonText: "",
      goStruct: "",
    };
  },
  methods: {
    inputJson() {
      this.goStruct = sqlStrToGoTemplate(this.jsonText);
    },
  },
};
</script>

<style scoped>
.json-container {
  display: flex;
  flex-direction: column;
}
.show-go {
  padding-top: 10px;
}
</style>

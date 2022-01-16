<template>
  <div class="json-container">
    <div class="json-text">
      <el-input type="textarea" rows=2 placeholder="请输入json" @change="inputJson" v-model="jsonText">
      </el-input>
    </div>
    <div class="show-go" v-if="goStruct !== ''">
      <el-input type="textarea" rows=8 placeholder="显示的GoStruct" v-model="goStruct"></el-input>
    </div>
  </div>
</template>

<script>
import { jsonToGo } from '../utils/json-to-go';

export default {
  data() {
    return {
      jsonText: '',
      goStruct: '',
    };
  },
  methods: {
    inputJson() {
      const goObj = jsonToGo(this.jsonText);
      this.goStruct = goObj.go;
    },
  },
};
</script>

<style lang="css" scoped>
.json-container {
  display: flex;
  flex-direction: column;
}
.show-go {
  padding-top: 10px;
}
</style>

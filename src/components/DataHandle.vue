<template>
  <div class="json-container">
    <el-radio-group v-model="handleDataMode" style="margin-bottom: 5px">
      <el-radio-button label="简单数据处理"></el-radio-button>
      <el-radio-button label="复杂数据处理"></el-radio-button>
    </el-radio-group>

    <div v-if="handleDataMode === '简单数据处理'" style="margin-bottom: 5px">
      <DataHandleSimple />
    </div>
    <div v-else>
      <DataHandleComplex />
    </div>
  </div>
</template>

<script>
import DataHandleComplex from "./DataHandleComplex.vue";
import DataHandleSimple from "./DataHandleSimple.vue";
export default {
  props: {
    isFull: Boolean,
  },
  components: {
    DataHandleComplex,
    DataHandleSimple,
  },
  data() {
    return {
      handleDataMode: "简单数据处理",
    };
  },
  methods: {},
};
</script>

<style scoped>
.json-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.or-json:nth-child(2) {
  padding-top: 5px;
}

.json-container .show-json {
  padding-top: 20px;
}

.full-width {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.full-width .or-json {
  width: 48%;
  margin-right: 10px;
}

.full-width .show-json {
  width: 48%;
  padding-top: 0;
}
.show-html {
  overflow: hidden;
}
.show-html img {
  max-height: 300px !important;
}
</style>

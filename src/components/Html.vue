<template>
  <div class="full-width">
    <div class="or-json">
      <el-input
        type="textarea"
        placeholder="请输入html"
        rows="4"
        v-model="showHtml"
      ></el-input>
    </div>
    <div class="show-json" v-html="showHtml"></div>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      showHtml: "",
    };
  },
};
</script>
<style scoped>
.show-json {
  overflow: hidden;
}
.show-json img {
  max-height: 300px !important;
}
</style>

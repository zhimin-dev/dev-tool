<template>
  <div class="full-width">
    <div class="or-json">
      <el-input
        type="textarea"
        placeholder="请输入html"
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
      showHtml: '',
    };
  },
};
</script>
<style lang="sass" scoped>
.full-width
</style>

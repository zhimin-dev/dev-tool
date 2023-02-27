<template>
  <div class="about-conatiner">
    <el-table :data="urlList" style="width: 100%">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column label="链接">
        <template slot-scope="scope">
          <el-button
            @click="goTo(scope.row.url)"
            type="text"
            size="small"
            v-text="scope.row.url"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      urlList: [
        {
          name: "正则",
          url: "https://regex101.com/",
        },
        {
          name: "本插件Github",
          url: "http://github.com/zhimin-dev/chrome-extension",
        },
      ],
    };
  },
  methods: {
    goTo(value) {
      window.open(value);
    },
  },
};
</script>

<style scoped>
.about-conatiner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

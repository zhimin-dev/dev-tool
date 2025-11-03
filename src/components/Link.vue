<template>
  <div>
    <div
      style="display: flex; justify-content: flex-end"
      v-if="hideMenuBar === 'false'"
    >
      <div v-if="!showExport">
        <el-button v-if="nowType !== 0" @click="cancelLinkFun"
          ><el-icon><Close /></el-icon>取消</el-button
        >
        <el-button
          icon="el-icon-success"
          @click="saveLinkFun"
          v-if="nowType === 1"
          ><el-icon><Plus /></el-icon>保存</el-button
        >
        <el-button
          v-if="linkList.length > 0 && nowType === 0"
          @click="editLinkFun"
        >
          <el-icon> <Edit /> </el-icon>添加/编辑</el-button
        >
      </div>
      <div
        style="margin-left: 20px"
        v-if="linkList.length > 0 && nowType === 0"
      >
        <el-button @click="importJsonFun"
          ><el-icon><Operation /></el-icon>导入链接</el-button
        >
        <el-button @click="exportJsonFun"
          ><el-icon><Promotion /></el-icon>导出链接</el-button
        >
      </div>
    </div>
    <div class="list-link" v-if="mode == 0">
      <div
        class="list-link-item"
        v-for="(value, index) in linkList"
        :key="index"
      >
        <a :href="value.url" target="__blank">
          {{ value.title }}
          <i class="el-icon-s-promotion"></i>
        </a>
      </div>
    </div>
    <el-table v-if="mode == 1" :data="linkList" style="width: 100%">
      <el-table-column label="链接名">
        <template #default="scope">
          <el-input
            v-model="scope.row.title"
            placeholder="请输入标题"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="url">
        <template #default="scope">
          <el-input v-model="scope.row.url" placeholder="请输入链接"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="90" label="操作">
        <template #default="scope">
          <div @click="deleteRowFun(scope.$index)" style="cursor: pointer">
            <el-icon>
              <Delete />
            </el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showExport || showImport" class="import-area">
      <el-input type="textarea" autosize="true" v-model="exportJson">
      </el-input>
      <el-button v-if="showImport" @click="doImport">点击导入</el-button>
    </div>
  </div>
</template>
<script>
import manifest from "./../../manifest.json";
export default {
  props: {
    hideMenuBar: String,
  },
  data() {
    return {
      linkList: [
        { url: "https://regex101.com/", title: "正则" },
        {
          url: manifest.homepage_url,
          title: "本插件Github@v" + manifest.version,
        },
      ],
      showExport: false,
      showImport: false,
      exportJson: "",
      tempLink: [],
      nowType: 0,
      showDelete: false,
      mode: 0, // 0 链接 1 显示表格
    };
  },
  created() {
    const res = localStorage.getItem("linkUrl");
    if (res !== undefined && res !== null && res !== "") {
      try {
        const parsedData = JSON.parse(res);
        if (Array.isArray(parsedData)) {
          // 过滤掉无效的对象
          this.linkList = parsedData.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              item.title !== undefined &&
              item.url !== undefined
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
    saveLink() {
      localStorage.setItem("linkUrl", JSON.stringify(this.linkList));
      this.mode = 0;
    },
    doImport() {
      const row = this.exportJson;
      try {
        const list = JSON.parse(row);
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].url !== undefined && list[i].title !== undefined) {
            this.linkList.push(this.setObj(list[i].title, list[i].url));
          }
        }
        this.saveLink();
        this.exportJson = "";
      } catch (e) {
        console.log(e);
      }
    },
    importJsonFun() {
      this.showExport = false;
      if (!this.showImport) {
        this.showImport = true;
      } else {
        this.showImport = false;
      }
    },
    exportJsonFun() {
      this.showImport = false;
      if (!this.showExport) {
        this.showExport = true;
        this.exportJson = JSON.stringify(this.linkList);
      } else {
        this.showExport = false;
      }
    },
    getEmptyObj() {
      return this.setObj("", "");
    },
    setObj(title, url) {
      return {
        title,
        url,
      };
    },
    saveLinkFun() {
      this.showDelete = false;
      this.nowType = 0;
      const newList = [];
      for (let i = 0; i < this.linkList.length; i += 1) {
        if (this.linkList[i].title !== "" || this.linkList[i].url !== "") {
          newList.push(this.linkList[i]);
        }
      }
      this.linkList = newList;
      this.saveLink();
    },
    editLinkFun() {
      this.showDelete = true;
      this.tempLink = this.linkList.slice();
      this.linkList.push(this.getEmptyObj());
      this.nowType = 1;
      this.mode = 1;
    },
    deleteRowFun(index) {
      this.linkList.splice(index, 1);
      this.mode = 1;
    },
    cancelLinkFun() {
      this.linkList = this.tempLink;
      this.tempLink = [];
      this.nowType = 0;
      this.showDelete = false;
      this.mode = 0;
    },
  },
};
</script>
<style scope>
.list-link {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
}

.list-link-item {
  margin-right: 15px;
  padding: 10px;
}

.list-link-item a {
  color: #000;
  text-decoration: none;
}

.import-area {
  display: flex;
}
</style>

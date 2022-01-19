<template>
    <div>
       <div style="display: flex;justify-content: flex-end;">
           <div v-if="!showExport">
                <el-button icon="el-icon-edit" size="mini" v-if="nowType !== 0"
                @click="cancelLinkFun">取消</el-button>
                <el-button icon="el-icon-circle-plus-outline" size="mini"
                @click="addLinkFun" v-if="nowType === 0">添加</el-button>
                <el-button icon="el-icon-success" size="mini"
                @click="saveLinkFun" v-if="nowType === 1">保存</el-button>
                <el-button icon="el-icon-edit" size="mini"
                  v-if="linkList.length > 0 && nowType === 0"
                @click="editLinkFun">添加/编辑</el-button>
            </div>
            <div style="margin-left: 20px;" v-if="linkList.length > 0 && nowType === 0">
              <el-button icon="el-icon-s-operation" size="mini"
                @click="importJsonFun">导入链接</el-button>
                <el-button icon="el-icon-s-operation" size="mini"
                @click="exportJsonFun">导出链接</el-button>
            </div>
       </div>
       <div class="list-link" v-if="mode == 0">
         <div class="list-link-item" v-for="(value, index) in linkList" :key="index">
            <a :href="value.url" target="__blank">
              {{value.title}}
              <i class="el-icon-s-promotion"></i>
            </a>
         </div>
       </div>
        <el-table
        v-if="mode == 1"
        :data="linkList"
        style="width: 100%">
        <el-table-column
            label="链接名">
            <template slot-scope="scope">
                <div v-if="!scope.row.canEdit">
                    <a :href="scope.row.url" target="__blank">
                        {{scope.row.title}}<i class="el-icon-s-promotion"></i></a>
                </div>
                <div v-else>
                    <el-input size="mini" v-model="scope.row.title" placeholder="请输入标题"></el-input>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            label="url">
            <template slot-scope="scope">
                <div v-if="!scope.row.canEdit">
                        {{scope.row.url}}
                </div>
                <div v-else>
                    <el-input size="mini" v-model="scope.row.url" placeholder="请输入链接"></el-input>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            width="90"
            label="操作" v-if="showDelete">
            <template slot-scope="scope">
                <div v-if="scope.row.canEdit" @click="deleteRowFun(scope.$index)"
                style="cursor: pointer;"><i class="el-icon-delete"></i></div>
            </template>
        </el-table-column>
        </el-table>
        <div v-if="showExport || showImport" class="import-area">
          <el-input
              type="textarea"
              autosize="true"
              v-model="exportJson">
          </el-input>
          <el-button size="mini" v-if="showImport" @click="doImport">点击导入</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      linkList: [{ url: 'https://regex101.com/', title: '正则' }, { url: 'http://github.com/zhimin-dev/chrome-extension', title: '本插件Github' }],
      showExport: false,
      showImport: false,
      exportJson: '',
      nowType: 0,
      showDelete: false,
      mode: 0, // 0 链接 1 显示表格
    };
  },
  created() {
    const res = localStorage.getItem('linkUrl');
    if (res !== undefined && res !== null && res !== '') {
      try {
        this.linkList = JSON.parse(res);
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
    saveLink() {
      localStorage.setItem('linkUrl', JSON.stringify(this.linkList));
      this.mode = 0;
    },
    doImport() {
      const row = this.exportJson;
      try {
        const list = JSON.parse(row);
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].url !== undefined && list[i].title !== undefined) {
            this.linkList.push(this.setObj(list[i].title, list[i].url, true));
          }
        }
        this.saveLink();
        this.exportJson = '';
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
      return this.setObj('', '', true);
    },
    setObj(title, url, canEdit) {
      return {
        title,
        url,
        canEdit,
      };
    },
    addLinkFun() {
      this.nowType = 1;
      this.linkList.push(this.getEmptyObj());
      this.mode = 1;
    },
    saveLinkFun() {
      this.showDelete = false;
      this.nowType = 0;
      const newList = [];
      for (let i = 0; i < this.linkList.length; i += 1) {
        this.linkList[i].canEdit = false;
        if (this.linkList[i].title !== '' || this.linkList[i].url !== '') {
          newList.push(this.linkList[i]);
        }
      }
      this.linkList = newList;
      this.saveLink();
    },
    editLinkFun() {
      this.showDelete = true;
      this.nowType = 1;
      for (let i = 0; i < this.linkList.length; i += 1) {
        this.linkList[i].canEdit = true;
      }
      this.mode = 1;
    },
    deleteRowFun(index) {
      this.linkList.splice(index, 1);
      this.mode = 1;
    },
    cancelLinkFun() {
      if (this.nowType === 1 && !this.showDelete) {
        this.linkList.splice(this.linkList.length - 1, 1);
      }
      this.nowType = 0;
      for (let i = 0; i < this.linkList.length; i += 1) {
        this.linkList[i].canEdit = false;
      }
      this.showDelete = false;
      this.mode = 0;
    },
  },
};
</script>
<style lang="sass" scope>
.list-link
    display: flex
    flex-wrap: wrap;
    .list-link-item
      margin-right: 15px
      padding: 10px
      a
        color: #000
        text-decoration: none
.import-area
  display: flex;
</style>

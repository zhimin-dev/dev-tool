<template>
  <div class="iptv-container">
      <div>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="source"
            @change="hanldeTrans"
            v-model="source"></el-input>
        <!-- <el-button size="mini" type="success" @click="hanldeTrans">点击转换</el-button> -->
        <el-button size="mini" type="info" @click="getData" v-if="selectedList.length > 0">
          下载json
        </el-button>
        <el-button size="mini" @click="fetchData" v-if="this.list.length > 0 && !nowIsCheck">
          检查链接是否正常
        </el-button>
        <div v-if="nowIsCheck && !isCheckOver">正在检查，进度{{nowCheckCount}}/{{this.list.length}}</div>
        <el-button size="mini" type="warning" v-if="isCheckOver" @click="autoSelect">
          自动选择
        </el-button>
        <el-input
            v-if="selectedData !== ''"
            type="textarea"
            size="mini"
            :rows="2"
            v-model="selectedData"></el-input>
      </div>
      <div>
          <el-table
            v-if="list.length > 0"
            ref="dataTable"
            @selection-change="handleSelectionChange"
            :data="list"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="status" width="70">
                <template slot-scope="scope">
                    <div v-if="scope.row.status === 0">
                      <el-tag type="info">未检查</el-tag>
                    </div>
                    <div v-else-if="scope.row.status === 1">
                      <el-tag type="success">可用</el-tag>
                    </div>
                    <div v-else-if="scope.row.status === 2">
                      <el-tag type="danger">不可用</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="tvg-language">
                <template slot-scope="scope">
                    <div>{{scope.row.name}}</div>
                    <!-- <img height="20" :src="scope.row.tvgLogo" > -->
                </template>
            </el-table-column>
            <el-table-column
                prop="url"
                label="url">
            </el-table-column>
            <el-table-column
                prop="tvgId"
                label="tvg-id"  width="120">
            </el-table-column>
            <el-table-column
                prop="tvgCountry"
                label="tvg-country"  width="100">
            </el-table-column>
            <el-table-column
                label="tvg-language"  width="120">
                <template slot-scope="scope">
                    <el-tag
                    type="success" size="mini"
                     v-for="(value,index) in scope.row.tvgLanguage" :key="index">
                        {{value}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="groupTitle"
                label="group-title"  width="100">
            </el-table-column>
            </el-table>
      </div>
  </div>
</template>
<script>
import { fetchGet } from '../utils/axios';

export default {
  data() {
    return {
      source: '',
      list: [],
      isCheckOver: false,
      firstTitle: '',
      selectedData: '',
      selectedList: [],
      nowCheckCount: 0,
      nowIsCheck: false,
    };
  },
  watch: {
    nowCheckCount(newVal) {
      if (newVal === this.list.length) {
        this.isCheckOver = true;
      }
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedList = val;
      this.selectedData = '';
    },
    getData() {
      let name = `${this.firstTitle}\n`;
      for (let i = 0; i < this.selectedList.length; i += 1) {
        name += `${this.selectedList[i].originalData}\n`;
      }
      this.selectedData = name;
    },
    autoSelect() {
      for (let i = 0; i < this.list.length; i += 1) {
        if (this.list[i].status === 1) {
          this.selectedList.push(this.list[i]);
          this.$refs.dataTable.toggleRowSelection(this.list[i]);
        }
      }
    },
    hanldeTrans() {
      this.isCheckOver = false;
      this.firstTitle = '';
      if (this.source === '') {
        return;
      }
      this.parseList();
    },
    fetchData() {
      this.nowCheckCount = 0;
      this.nowIsCheck = false;
      this.isCheckOver = false;
      for (let i = 0; i < this.list.length; i += 1) {
        this.nowIsCheck = true;
        fetchGet(this.list[i].url).then((res) => {
          if (this.checkFirstLineIsRight(res)) {
            this.list[i].status = 1;
          } else {
            throw new Error('first line is not m3u');
          }
          this.nowCheckCount += 1;
        }).catch(() => {
          this.list[i].status = 2;
          this.nowCheckCount += 1;
        });
      }
    },
    parseList() {
      if (this.source !== '') {
        this.list = [];
        const spiStr = this.source.split('\n');
        this.firstTitle = '';
        if (spiStr.length > 0) {
          [this.firstTitle] = spiStr;
        }
        if (spiStr.length > 1) {
          const len = (spiStr.length - 1) / 2;
          for (let i = 0; i < len; i += 1) {
            const index = 1 + (i * 2);
            this.parseRowToData(spiStr[index], spiStr[index + 1]);
          }
        }
      }
    },
    parseRowToData(one, two) {
      const row = {
        url: two,
        groupTitle: this.pregValue(one, 'group-title'),
        tvgLogo: this.pregValue(one, 'tvg-logo'),
        tvgLanguage: this.parseLanguages(this.pregValue(one, 'tvg-language')),
        tvgCountry: this.pregValue(one, 'tvg-country'),
        tvgId: this.pregValue(one, 'tvg-id'),
        status: 0,
        name: this.parseName(one),
        originalData: `${one}\n${two}`,
      };
      this.list.push(row);
    },
    pregValue(str, name) {
      let regex;
      if (name === 'group-title') {
        regex = /group-title="(.*)"/mg;
      } else if (name === 'tvg-logo') {
        regex = /tvg-logo="(.*)"/mg;
      } else if (name === 'tvg-language') {
        regex = /tvg-language="(.*)"/mg;
      } else if (name === 'tvg-country') {
        regex = /tvg-country="(.*)"/mg;
      } else if (name === 'tvg-id') {
        regex = /tvg-id="(.*)"/mg;
      }
      let m;
      let value = '';
      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
        m.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            value = match;
          }
        });
      }
      if (value !== '') {
        return value.split('" ')[0];
      }
      return '';
    },
    checkFirstLineIsRight(content) {
      const contextExp = content.split('\n');
      if (contextExp.length > 0) {
        const firstLine = contextExp[0];
        if (firstLine.replace('#EXTM3U', '') === firstLine) {
          return false;
        }
        return true;
      }
      return false;
    },
    parseName(name) {
      const row = name.split(',');
      return row[row.length - 1];
    },
    parseLanguages(name) {
      return name.split(';');
    },
  },
};
</script>
<style lang="sass" scoped>
.iptv-container
</style>

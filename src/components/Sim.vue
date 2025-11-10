<template>
  <div class="sim-conatiner">
    <div class="sim-url">
      <el-select
        class="url-c"
        style="width: 130px"
        v-model="request_type"
        placeholder="请选择"
      >
        <el-option
          v-for="(value, index) in request_type_list"
          :key="index"
          :label="value"
          :value="value"
        >
        </el-option>
      </el-select>
      <el-input class="url-c" v-model="url" placeholder="请输入URL"> </el-input>
      <el-button type="primary" @click="doSend">
        <el-icon><Promotion /></el-icon>发送
      </el-button>
    </div>
    <div v-if="request_type === 'POST'">
      <el-input
        type="textarea"
        :autosize="true"
        placeholder="请输入postData"
        v-model="postData"
      >
      </el-input>
    </div>
    <div
      style="display: flex; align-items: baseline; flex-direction: row-reverse"
    >
      <el-button type="primary" circle @click="addHeader">+</el-button>
      <el-table :data="headers" style="width: 100%">
        <el-table-column label="KEY">
          <template #default="scope">
            <el-input
              v-model="scope.row.key"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="VALUE">
          <template #default="scope">
            <el-input
              v-model="scope.row.value"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteThisHeader(scope.$index)" circle>
              -
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Body" name="body">
          <el-input
            type="textarea"
            :autosize="true"
            placeholder="请输入内容"
            v-model="result"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="ResponseHeader" name="header">
          <div v-for="(v, i) in resultResponseHeader" :key="i">
            <div v-text="i + ': ' + v"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import axios from "axios";

export default {
  data() {
    return {
      url: "",
      result: "",
      request_type_list: ["GET", "POST", "HEAD"],
      request_type: "GET",
      headers: [],
      activeTab: "body",
      postData: "",
      resultResponseHeader: [],
    };
  },
  methods: {
    addHeader() {
      this.headers.push({ key: "", value: "" });
    },
    doSend() {
      this.sendRequest();
    },
    deleteThisHeader(index) {
      this.headers.splice(index, 1);
    },
    sendRequest() {
      const headersObj = {};
      for (let i = 0; i < this.headers.length; i += 1) {
        headersObj[this.headers[i].key] = this.headers[i].value;
      }
      axios({
        url: this.url,
        data: this.postData,
        method: this.request_type,
        headers: headersObj,
      })
        .then((res) => {
          this.resultResponseHeader = res.headers;
          const contentType = res.headers["content-type"];
          if (contentType.split(";")[0] === "application/json") {
            this.result = JSON.stringify(res.data);
          } else {
            this.result = res.data;
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    },
  },
};
</script>

<style scoped>
.sim-conatiner {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.sim-url {
  display: flex;
  margin: 10px 0;
}

.url-c {
  margin-right: 3px;
}
</style>

<template>
  <div class="json-container">
    <div class="or-json">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入json"
        v-model="userInputJson"
      ></el-input>
    </div>
    <div class="or-json">
      <el-button
        v-for="(value, index) in mode"
        size="mini"
        :key="index"
        @click="doConvert(value.type)"
        >{{ value.name }}</el-button
      >
    </div>
    <div class="show-json" v-if="showJson !== ''">
      <el-input
        type="textarea"
        placeholder="显示的json"
        v-model="showJson"
        :autosize="true"
        v-if="nowMode === 1 || nowMode === 2"
      ></el-input>
      <table border="1" v-if="tableList.length > 0 && nowMode === 3">
        <tr>
          <th></th>
          <th v-for="(v, k) in tableList[0]" :key="k">{{ k }}</th>
        </tr>
        <tr v-for="(v, k) in tableList" :key="k">
          <td>{{ k }}</td>
          <td v-for="(x, xk) in v" :key="xk">
            {{ x }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import jsonFormate from "../utils/json-format";
import { jsonToGo } from "../utils/json-to-go";
import { structStrToJson } from "../utils/go/structToJson";
export default {
  props: {
    isFull: Boolean,
  },
  data() {
    return {
      userInputJson: "",
      showJson: "",
      nowMode: 0,
      tableList: [],
      mode: [
        {
          type: 1,
          name: "json格式化",
        },
        {
          type: 2,
          name: "json转Go struct",
        },
        {
          type: 3,
          name: "json转table (输入json数组)",
        },
        // {
        //   type: 4,
        //   name: "go struct to json",
        // },
      ],
    };
  },
  methods: {
    doConvert(mode) {
      if (this.userInputJson !== "") {
        if (mode === 1) {
          this.nowMode = 1;
          this.doJsonFormat(1);
        } else if (mode === 2) {
          this.nowMode = 2;
          this.doJsonToGOStruct();
        } else if (mode === 3) {
          this.nowMode = 3;
          this.doJsonToTable();
        } else if (mode === 4) {
          this.nowMode = 4;
          this.doGoStructToJson();
        }
      }
    },
    doGoStructToJson() {
      const goObj = structStrToJson(this.userInputJson);
      this.showJson = goObj.go;
    },
    doJsonFormat(type) {
      let obj;
      try {
        obj = JSON.parse(this.userInputJson);
      } catch (e) {
        this.$message.error("json转换失败");
        return;
      }
      this.showJson = jsonFormate(obj, type);
    },
    doJsonToGOStruct() {
      const goObj = jsonToGo(this.userInputJson);
      this.showJson = goObj.go;
    },
    doJsonToTable() {
      try {
        this.tableList = JSON.parse(this.userInputJson);
        console.log(this.tableList);
      } catch (e) {
        this.$message.error("json转换失败");
      }
    },
  },
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
</style>

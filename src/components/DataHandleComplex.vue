<template>
  <div class="json-container">
    <div class="or-json" style="margin-bottom: 5px">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入字符串"
        v-model="userInputJson"
        v-if="!debugMode"
      ></el-input>
    </div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <div>
        <el-button @click="addEvent">添加事件</el-button>
        <el-button @click="addCustomFunction">添加自定义函数</el-button>
        <el-button v-if="!debugMode" type="primary">运行</el-button>
      </div>
      <div>
        <el-switch
          v-model="debugMode"
          class="ml-2"
          active-text="开启debug"
          inactive-text="关闭debug"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="actions"
        style="width: 100%"
        border
        size="small"
        v-if="actions.length > 0"
      >
        <el-table-column #default="scope" label="输入" width="200">
          <div v-if="debugMode">
            <el-input type="textarea" :rows="4" v-model="scope.row.input" />
          </div>
          <div v-else>
            <div v-if="scope.row.inputFinished === 0">
              <el-icon :size="20" color="#409efc">
                <SemiSelect />
              </el-icon>
            </div>
            <div v-if="scope.row.resultFinished === 1">
              <el-icon :size="20" color="#409efc">
                <Select />
              </el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column #default="scope" label="数据类型" width="230">
          <el-select v-model="scope.row.type" placeholder="请选择数据类型">
            <el-option
              v-for="item in typeLists"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select v-model="scope.row.handle" placeholder="请选择处理方法">
            <el-option
              v-for="item in showFunctionList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="scope.row.args" />
        </el-table-column>
        <el-table-column #default="scope" label="结果" width="200">
          <div v-if="debugMode">
            <el-input type="textarea" :rows="4" v-model="scope.row.result" />
          </div>
          <div v-else>
            <div v-if="scope.row.resultFinished === 0">
              <el-icon :size="20" color="#409efc">
                <SemiSelect />
              </el-icon>
            </div>
            <div v-if="scope.row.resultFinished === 1">
              <el-icon :size="20" color="#409efc">
                <Select />
              </el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="deleteEvent(scope.row)"
              >删除</el-button
            >
            <el-button size="small" @click="runThis(scope.row)">运行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="添加自定义函数"
      width="500"
      :before-close="handleClose"
    >
      <div style="margin-bottom: 5px">
        <el-input v-model="customFunLabel" placeholder="函数别名" />
      </div>
      <div style="margin-bottom: 5px">
        <el-input
          v-model="customFunStr"
          :rows="10"
          type="textarea"
          placeholder="自定义函数"
        />
      </div>

      <el-button style="margin: 5px 0" @click="testCustomFunction"
        >测试函数</el-button
      >

      <div style="margin-bottom: 5px">
        <el-input v-model="customFunInput" placeholder="输入值" />
      </div>

      <div style="margin-bottom: 5px">
        <el-input v-model="customFunTestArgs" placeholder="测试函数参数" />
      </div>

      <div style="margin-bottom: 5px">
        <el-input
          v-model="customFunTestResult"
          :rows="4"
          type="textarea"
          placeholder="测试函数结果"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveCustomFunction">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { isArray, isString } from "element-plus/es/utils/types.mjs";
export default {
  props: {
    isFull: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
      typeLists: ["string", "json"],
      userInputJson: "",
      debugMode: true,
      rowTypeLists: ["all", "row"],
      customFunctionMap: {
        getArgs: {
          label: "getArgs",
          func: `(input, args) => {
            return input + '_' + String(args[0]) + '_' + String(args[1])
          }`,
        },
      },
      showFunctionList: [],
      handleLists: [
        {
          label: "字符串分割",
          value: "split",
          sample: '["&"]',
        },
        {
          label: "正则匹配",
          value: "regex",
          args: "[\\d+]",
        },
        {
          label: "替换所有",
          value: "replaceAll",
          args: '["&", "\\n"]',
        },
        {
          label: "获取json值",
          value: "getJSONValue",
          args: "[[].name]",
        },
        {
          label: "unique去重",
          value: "unique",
          args: "",
        },
      ],
      actions: [
        {
          input:
            "/sns-itr/v1/reply/danmaku-reply-list?token=JLIjsdLjfsdII%253D%257CMTQxODg3MDczNA%253D%253D%257C07aaal32795abdeff41cc9633329932195&app_build=89577&loginToken=21233b800120045d7683df10c5fbde879064a963644fcf0d1b9e0ca8d90b42ff857b42d4650e504b92a09ce2e665666644c25fba475efed92f85eb5a2d6e811d4b4ebc48fab98d244ebc4ba74b7f6aa5%7C1000020817%7C1762149781%7C6d75f4d76d50aa06265bdfcd6063bc62e308bff0%7C1-1%7Ce2674bb45656f7bf&shumeiid=2024112723355317ba49fca6d9ece3f50e8c6bb785559f51b036e00fae4357&isRoot=0&videoTime=30000&duid=89d9f2742de26ae4bcab5c8d9ce61442380336b6f3348bf74063db4bd347fabcd6fb15c8625fb0c6c3e0cfacb481073b&brand=Apple&sign=859d211b46138d6011c56c726b99acf8&abV579Danmu=1&mode=0&newSign=97ef3dc7fe9d28d7bf4cdc5aded2844a&timestamp=1762150253621&contentUserId=1000021283&appId=duapp&platform=iPhone&contentId=100626700&emu=0&timeRange=10&v=5.79.0&debugable=1&cookieToken=21233b800120045d7683df10c5fbde879064a963644fcf0d1b9e0ca8d90b42ff857b42d4650e504b92a09ce2e665666644c25fba475efed92f85eb5a2d6e811d4b4ebc48fab98d244ebc4ba74b7f6aa5%7C1000020817%7C1762149781%7C6d75f4d76d50aa06265bdfcd6063bc62e308bff0%7C1-1%7Ce2674bb45656f7bf&isProxy=1",
          rowType: "all",
          rowHandle: "",
          type: "string",
          handle: "replaceAll",
          args: '["&", "\\n"]',
          result: "",
          inputFinished: -1,
          resultFinished: -1,
        },
        {
          input: "Hello World! How are you? lolo",
          rowType: "all",
          rowHandle: "",
          type: "string",
          handle: "regex",
          args: '["/lo/gm"]',
          result: "",
          inputFinished: -1,
          resultFinished: -1,
        },
        {
          input: '[{"name":"zmisgod"},{"name":"alice"}]',
          rowType: "all",
          rowHandle: "",
          type: "json",
          handle: "getJSONValue",
          args: '["*.name"]',
          result: "",
          inputFinished: -1,
          resultFinished: -1,
        },
        {
          input: "1\n2\n3\n4\n5\n5\n4\n3\n2\n1",
          rowType: "row",
          rowHandle: ["split", '["\n", ""]'],
          type: "string",
          handle: "unique",
          args: "[]",
          result: "",
          inputFinished: -1,
          resultFinished: -1,
        },
      ],
      customFunLabel: "122112",
      customFunStr: `(input, args) => {
            return input + '_' + String(args[0]) + '_' + String(args[1])
          }`,
      customFunInput: "122112",
      customFunTestArgs: '["000","111"]',
      customFunTestResult: "",
    };
  },
  created() {
    this.initShowFunctionList();
  },
  methods: {
    testCustomFunction() {
      let result = "";
      try {
        const args = JSON.parse(this.customFunTestArgs);
        let func = eval(this.customFunStr);
        result = func(this.customFunInput, args);
      } catch (error) {
        result = "Error: " + error.message;
      }
      this.customFunTestResult = isArray(result)
        ? JSON.stringify(Array.from(result))
        : result;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    initShowFunctionList() {
      this.showFunctionList = [];
      for (let i = 0; i < this.handleLists.length; i++) {
        this.showFunctionList.push({
          label: this.handleLists[i].label,
          value: this.handleLists[i].value,
          func: "",
          custom: false,
        });
      }
      for (const key in this.customFunctionMap) {
        this.showFunctionList.push({
          label: this.customFunctionMap[key].label,
          value: this.customFunctionMap[key].label,
          func: this.customFunctionMap[key].func,
          custom: true,
        });
      }
    },
    saveCustomFunction() {
      this.customFunctionMap[this.customFunLabel] = {
        label: this.customFunLabel,
        func: this.customFunStr,
      };
      this.initShowFunctionList();
      this.dialogVisible = false;
    },
    addCustomFunction() {
      this.dialogVisible = true;
      // this.clearCustomFunctions();
    },
    clearCustomFunctions() {
      this.customFunLabel = "";
      this.customFunStr = "";
      this.customFunTestArgs = "";
      this.customFunTestResult = "";
      this.customFunInput = "";
    },
    deleteEvent(row) {
      const index = this.actions.indexOf(row);
      if (index > -1) {
        this.actions.splice(index, 1);
      }
    },
    addEvent() {
      this.actions.push({
        input: "",
        type: "string",
        handle: "replaceAll",
        args: "[]",
        result: "",
        inputFinished: -1,
        resultFinished: -1,
      });
    },
    runThis(row) {
      let result = "";
      const args = JSON.parse(row.args);
      let isCustom = false;
      if (
        this.customFunctionMap.hasOwnProperty(row.handle) &&
        this.customFunctionMap[row.handle]
      ) {
        isCustom = true;
      }
      if (row.handle === "split") {
        result = row.input.split(args[0]);
      } else if (row.handle === "regex") {
        let regexString = args[0];
        const pattern = regexString.slice(1, regexString.lastIndexOf("/"));
        const flags = regexString.slice(regexString.lastIndexOf("/") + 1);

        console.log("----pattern----", pattern, flags);
        const regex = new RegExp(pattern, flags);
        let m;
        let dataResult = [];
        while ((m = regex.exec(row.input)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          m.forEach((match, groupIndex) => {
            console.log(`----match----`, match, groupIndex);
            dataResult.push(match);
          });
        }
        result = dataResult;
        console.log("----dataResult----", dataResult);
      } else if (row.handle === "replaceAll") {
        result = row.input.replaceAll(args[0], args[1]);
      } else if (row.handle === "unique") {
        let items = row.input.split("\n");
        let uniqueItems = Array.from(new Set(items));
        result = uniqueItems.join("\n");
      } else if (row.handle === "getJSONValue") {
        let arr = JSON.parse(row.input);
        result = this.getValueByPath(arr, args[0]);
        console.log("----getValue result----", result);
      } else if (isCustom) {
        console.log("----custom function----", args, row.handle);
        let funcStr = this.customFunctionMap[row.handle].func;
        let func = eval(funcStr);
        result = func(row.input, ...args);
      }
      row.result = !isString(result) ? JSON.stringify(result) : result;
      console.log("----row----", row);
    },
    getValueByPath(obj, path) {
      // 如果路径为空，直接返回对象
      if (!path.trim()) return obj;

      // 拆分路径，支持带空格的属性名（如：["user", "full name"]）
      const tokens = path.split(".");
      let current = obj;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // 处理通配符（数组迭代）
        if (token === "*") {
          if (!Array.isArray(current)) return [];
          const remainingPath = tokens.slice(i + 1).join(".");

          // 递归处理每个数组元素的后续路径
          return current
            .map((item) => this.getValueByPath(item, remainingPath))
            .flat();
        }
        // 处理带索引的通配符（如 *[1]）
        else if (token.startsWith("*[") && token.endsWith("]")) {
          if (!Array.isArray(current)) return undefined;

          const index = parseInt(token.match(/\d+/)[0], 10);
          if (isNaN(index) || index < 0 || index >= current.length) {
            return undefined;
          }

          current = current[index];
        }
        // 处理普通属性或保留*（通配符未使用索引）
        else if (current && typeof current === "object") {
          // 数组索引查询（如 [0]）
          if (/^\[\d+\]$/.test(token)) {
            const index = parseInt(token.match(/\d+/)[0], 10);
            if (
              !Array.isArray(current) ||
              isNaN(index) ||
              index < 0 ||
              index >= current.length
            ) {
              return undefined;
            }
            current = current[index];
          }
          // 对象属性查询
          else {
            current = current[token];
          }
        } else {
          return undefined;
        }
      }

      return current;
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
.show-html {
  overflow: hidden;
}
.show-html img {
  max-height: 300px !important;
}
</style>

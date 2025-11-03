<template>
  <div class="json-container">
    <div class="or-json">
      <div style="display: flex; margin-bottom: 10px">
        <el-input
          type="input"
          placeholder="请输入表格的选择器，如#tableId .className"
          v-model="tableSelector"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        <el-input
          type="input"
          placeholder="请输入需要的列，如0,1,2,3"
          v-model="columnIndices"
          style="width: 200px"
        ></el-input>
      </div>
      <div style="display: flex">
        <el-button @click="showTable">获取表格</el-button>
        <el-button @click="exportTable">导出当前表格</el-button>
      </div>
      <div>
        <el-table
          v-if="showList.length > 0"
          :data="showList"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            v-for="(col, index) in showList[0]"
            :key="index"
            :label="'列 ' + index"
            :prop="index.toString()"
          >
            <template #default="scope">
              {{ scope.row[index] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isFull: Boolean,
  },
  data() {
    return {
      columnIndices: "",
      tableSelector: "table",
      showList: [],
    };
  },
  methods: {
    getTableData(selector, columnIndices) {
      const table = document.querySelector(selector); // 使用传入的选择器
      console.log("getTableData", table, selector, columnIndices);
      if (!table) return null; // 如果未找到表格，返回 null

      const rows = Array.from(table.querySelectorAll("tbody tr"));
      const data = rows.map((row) => {
        const cols = Array.from(row.querySelectorAll("td, th"));
        // 提取指定的列
        return columnIndices
          .filter((index) => index >= 0 && index < cols.length) // 过滤有效的列索引
          .map((index) => cols[index].innerText); // 返回有效列的数据
      });

      return data.filter((row) => row.length > 0); // 过滤掉空行
    },
    async handleTable(handleType) {
      console.log("handleTable", this.tableSelector, this.columnIndices);
      if (this.tableSelector === "") {
        alert("请指定表格选择器");
        return;
      }
      if (this.columnIndices === "") {
        alert("请指定有效的列索引");
        return;
      }

      // 将输入的列索引转换为整数数组
      const columnIndices = this.columnIndices
        .split(",")
        .map((index) => parseInt(index.trim()))
        .filter((index) => !isNaN(index)); // 过滤无效的索引

      if (columnIndices.length === 0) {
        alert("请输入有效的列索引");
        return;
      }

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: function (selector, columnIndices) {
            const table = document.querySelector(selector);
            if (!table) return null;

            const rows = Array.from(table.querySelectorAll("tbody tr"));
            const data = rows.map((row) => {
              const cols = Array.from(row.querySelectorAll("td, th"));
              return columnIndices
                .filter((index) => index >= 0 && index < cols.length)
                .map((index) => cols[index].innerText);
            });

            return data.filter((row) => row.length > 0);
          },
          args: [this.tableSelector, columnIndices], // 传递选择器和列索引数组
        },
        (injectionResults) => {
          const [{ result: tableData }] = injectionResults;
          if (tableData) {
            if (handleType === "show") {
              this.showList = tableData;
              return;
            } else if (handleType === "export") {
              this.downloadCSV(tableData);
              return;
            }
          } else {
            alert("未找到指定的表格或列");
          }
        }
      );
    },
    showTable() {
      this.handleTable("show");
    },
    exportTable() {
      this.handleTable("export");
    },
    downloadCSV(data) {
      const csvContent = data.map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "table_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

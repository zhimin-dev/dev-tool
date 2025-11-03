<template>
  <div class="notice-container">
    <div style="margin-bottom: 10px; display: flex; justify-content: flex-end">
      <el-button @click="editForm" v-if="disabledInput">
        <el-icon><Edit /></el-icon>编辑
      </el-button>
      <el-button @click="editFormCancel" v-if="!disabledInput">取消</el-button>
      <el-button @click="editFormSave" v-if="!disabledInput">保存</el-button>
    </div>
    <div
      v-for="(value, index) in timeList"
      :key="index"
      style="display: flex; margin-bottom: 20px"
    >
      <el-select
        v-model="value.hour"
        style="width: 90px"
        placeholder="请选择"
        :disabled="disabledInput"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        style="width: 90px"
        :disabled="disabledInput"
        v-model="value.minute"
        @input="changeMinute(value.minute, index)"
        type="number"
      ></el-input>
      <div class="center-item">分，将提醒您：</div>
      <el-input
        style="width: 400px"
        :disabled="disabledInput"
        v-model="value.remark"
        placeholder="请输入备注，为空不保存哦！"
      ></el-input>
      <i
        class="el-icon-delete"
        v-if="!disabledInput"
        @click="deleteThis(index)"
      ></i>
    </div>
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      key: "noticeList",
      timeList: [],
      tempList: [],
      disabledInput: false,
      options: [
        { label: "每小时", value: -1 },
        { label: "0点", value: 0 },
        { label: "1点", value: 1 },
        { label: "2点", value: 2 },
        { label: "3点", value: 3 },
        { label: "4点", value: 4 },
        { label: "5点", value: 5 },
        { label: "6点", value: 6 },
        { label: "7点", value: 7 },
        { label: "8点", value: 8 },
        { label: "9点", value: 9 },
        { label: "10点", value: 10 },
        { label: "11点", value: 11 },
        { label: "12点", value: 12 },
        { label: "13点", value: 13 },
        { label: "14点", value: 14 },
        { label: "15点", value: 15 },
        { label: "16点", value: 16 },
        { label: "17点", value: 17 },
        { label: "18点", value: 18 },
        { label: "19点", value: 19 },
        { label: "20点", value: 20 },
        { label: "21点", value: 21 },
        { label: "22点", value: 22 },
        { label: "23点", value: 23 },
      ],
    };
  },
  created() {
    this.disabledInput = true;
    const res = localStorage.getItem(this.key);
    if (res !== undefined && res !== null && res !== "") {
      try {
        this.timeList = JSON.parse(res);
      } catch (e) {
        console.log(e);
      }
    }
  },
  methods: {
    deleteThis(index) {
      this.timeList.splice(index, 1);
    },
    editForm() {
      if (this.timeList.length > 0) {
        this.tempList = JSON.parse(JSON.stringify(this.timeList));
      } else {
        this.tempList = [];
      }
      this.timeList.push({
        hour: -1,
        minute: 0,
        remark: "",
      });
      this.disabledInput = !this.disabledInput;
    },
    editFormCancel() {
      this.timeList = this.tempList;
      this.disabledInput = !this.disabledInput;
    },
    editFormSave() {
      const checkExistTime = {};
      for (let i = 0; i < this.timeList.length; i += 1) {
        if (
          checkExistTime[
            `${this.timeList[i].hour}_${this.timeList[i].minute}`
          ] === undefined
        ) {
          checkExistTime[
            `${this.timeList[i].hour}_${this.timeList[i].minute}`
          ] = 0;
        }
        checkExistTime[
          `${this.timeList[i].hour}_${this.timeList[i].minute}`
        ] += 1;
      }
      let checkOk = true;
      for (const key in checkExistTime) {
        if (checkExistTime[key] > 1) {
          checkOk = false;
          ElMessage.error("时间有重复，请检查");
        }
      }
      if (!checkOk) {
        return;
      }
      const rows = [];
      for (let i = 0; i < this.timeList.length; i += 1) {
        if (this.timeList[i].remark !== "") {
          rows.push(this.timeList[i]);
        }
      }
      const jsonStr = JSON.stringify(rows);
      localStorage.setItem(this.key, jsonStr);
      this.timeList = rows;
      chrome.storage.local.set({ noticeList: jsonStr }, () => {
        console.log("ok");
      });
      this.disabledInput = !this.disabledInput;
    },
    changeMinute(val, index) {
      if (val > 60) {
        this.timeList[index].minute = 0;
      } else if (val < 0) {
        this.timeList[index].minute = 0;
      }
    },
  },
};
</script>
<style scope>
.notice-container {
  font-size: 14px;
}

.center-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

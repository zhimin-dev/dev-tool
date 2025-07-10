<template>
  <div class="cal-container">
    <div>
      <el-input
        @input="calResult"
        class="value1"
        v-model="value1"
        placeholder="请输入值1"
      >
      </el-input>
    </div>
    <div>
      <el-radio-group
        v-model="cal_type"
        style="width: 200px"
        @change="calResult"
      >
        <el-radio-button
          v-for="(value, index) in cal_options"
          :value="value.label"
          :key="index"
          :label="value.label"
        ></el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <el-input
        @input="calResult"
        class="value2"
        v-model="value2"
        placeholder="请输入值2"
      >
      </el-input>
    </div>
    <div>
      <el-input class="result" disabled v-model="result" placeholder="结果">
      </el-input>
      <el-link @click="useResult">reuse result</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleCalculator",
  data() {
    return {
      result: "",
      value1: "",
      value2: "",
      cal_type: "/",
      cal_options: [
        {
          label: "+",
          value: 1,
        },
        {
          label: "-",
          value: 2,
        },
        {
          label: "x",
          value: 3,
        },
        {
          label: "/",
          value: 4,
        },
        {
          label: "%",
          value: 5,
        },
      ],
    };
  },
  methods: {
    calResult() {
      // 检查输入值是否有效
      if (!this.value1 || !this.value2) {
        this.result = "";
        return;
      }

      const num1 = Number(this.value1);
      const num2 = Number(this.value2);

      // 检查是否为有效数字
      if (isNaN(num1) || isNaN(num2)) {
        this.result = "请输入有效数字";
        return;
      }

      if (this.cal_type === "+") {
        this.result = (num1 + num2).toString();
      } else if (this.cal_type === "-") {
        this.result = (num1 - num2).toString();
      } else if (this.cal_type === "x") {
        this.result = (num1 * num2).toString();
      } else if (this.cal_type === "/") {
        if (num2 === 0) {
          this.result = "除数不能为0";
        } else {
          this.result = (num1 / num2).toString();
        }
      } else if (this.cal_type === "%") {
        if (num2 === 0) {
          this.result = "除数不能为0";
        } else {
          this.result = (num1 % num2).toString();
        }
      }

      console.log("计算结果:", this.result);
    },
    useResult() {
      const { result } = this;
      this.value1 = result;
      this.value2 = "";
      this.result = "";
    },
  },
};
</script>

<style scoped>
.cal-container {
  display: flex;
  align-items: flex-start;
}

.cal-formulate {
  display: flex;
}

.value1 {
  width: 200px;
  margin-right: 10px;
}

.value2 {
  width: 200px;
  margin-right: 10px;
}

.cal-type {
  width: 60px;
  margin-right: 10px;
}
</style>

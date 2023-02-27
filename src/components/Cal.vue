<template>
  <div class="cal-container">
    <div class="cal-formulate">
      <el-input
        @input="calResult"
        size="mini"
        class="value1"
        v-model="value1"
        placeholder="请输入值1"
      >
      </el-input>
      <el-select
        @change="calResult"
        size="mini"
        class="cal-type"
        v-model="cal_type"
        placeholder="请选择"
      >
        <el-option
          v-for="item in cal_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        @input="calResult"
        size="mini"
        class="value2"
        v-model="value2"
        placeholder="请输入值2"
      >
      </el-input>
    </div>
    <div>
      <el-input
        class="result"
        size="mini"
        v-model="result"
        placeholder="请输入值2"
      >
      </el-input>
      <el-link @click="useResult">reuse result</el-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: "",
      value1: "",
      value2: "",
      cal_type: 1,
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
      if (this.cal_type === 1) {
        this.result = Number(this.value1) + Number(this.value2);
      } else if (this.cal_type === 2) {
        this.result = Number(this.value1) - Number(this.value2);
      } else if (this.cal_type === 3) {
        this.result = Number(this.value1) * Number(this.value2);
      } else if (this.cal_type === 4) {
        this.result = Number(this.value1) / Number(this.value2);
      } else if (this.cal_type === 5) {
        this.result = Number(this.value1) % Number(this.value2);
      }
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

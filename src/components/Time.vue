<template>
  <div class="time-container">
    <div>
      当前时间戳：<el-link @click="this.copyNowUnixtime">{{mTime.unixtime}}</el-link>
      当前时间：<el-link @click="this.copyTimeStr">{{mTime.str}}</el-link>
    </div>
    <div class="time">
      <el-input v-model="nowTime" size="mini" class="now-time" placeholder="当前时间"></el-input>
      <div class="now-time">
        <el-button size="mini" @click="this.unixtimestampToTimeStr">时间戳转字符串 ⬇️ </el-button>
        <el-button size="mini" @click="this.timeStrToUnixtimestamp">字符串转时间戳 ⬆️ </el-button>
      </div>
      <el-input v-model="showTime" size="mini" class="now-time" placeholder="当前时间"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mTime: {
        str: '',
        unixtime: 0,
      },
      nowTime: 0,
      showTime: '',
      year: 2020,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      customTime: '',
    };
  },
  created() {
    const thisTime = new Date().getTime();
    this.nowTime = Math.round(thisTime / 1000);
    this.showTime = this.getTimestamp(new Date(thisTime));
    setInterval(() => {
      const now = new Date();
      this.mTime.unixtime = Math.round(now.getTime() / 1000);
      this.mTime.str = this.getTimestamp(now);
    }, 500);
  },
  methods: {
    copyNowUnixtime() {
      this.nowTime = this.mTime.unixtime;
    },
    copyTimeStr() {
      this.showTime = this.mTime.str;
    },
    getTimestamp(timestamp) {
      return `${timestamp.getFullYear()}-${
        timestamp.getMonth() + 1
      }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    },
    timeStrToUnixtimestamp() {
      const regex = /(\d+)-(\d+)-(\d+)\s(\d+):(\d+):(\d+)/gm;
      let m;
      const rows = [];

      while ((m = regex.exec(this.showTime)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        m.forEach((match) => {
          rows.push(match);
        });
      }
      if (rows.length >= 7) {
        this.nowTime = new Date(
          `${rows[1]}-${rows[2]}-${rows[3]} ${rows[4]}:${rows[5]}:${rows[6]}`,
        ).getTime() / 1000;
      } else {
        this.$message.error('解析失败');
      }
    },
    unixtimestampToTimeStr() {
      let unixNumber;
      if ((`${this.nowTime}`).length === 10) {
        unixNumber = parseInt(this.nowTime, 10) * 1000;
      } else {
        unixNumber = parseInt(this.nowTime, 10);
      }
      this.showTime = this.getTimestamp(new Date(unixNumber));
    },
  },
};
</script>
<style lang="sass" scoped>
.time-container
  .time
    display: flex
    padding-bottom: 5px
    font-size: 14px
    flex-direction: column
    .now-time
      display: flex
      flex-wrap: wrap
      padding-right: 10px
      width: 300px
      margin-bottom: 10px
</style>

<template>
  <div class="time-container">
    <div class="time">
      <el-input v-model="nowTime" size="mini" class="now-time now-unix-time" placeholder="当前时间">
      </el-input>
      <el-input v-model="showTime" size="mini" class="now-time now-timestamp"
      placeholder="当前时间"></el-input>
      <el-switch v-model="stopTime" class="now-time-switch" active-text="暂停"
      active-color="#ff4949"></el-switch>
    </div>
    <div class="time">
      <el-input size="mini" v-model="year" @change="changeYear" class="per-time"
      placeholder="年"></el-input>年
      <el-input size="mini" v-model="month" @change="changeMonth" class="per-time"
      placeholder="月"></el-input>月
      <el-input size="mini" v-model="day" @change="changeDay" class="per-time"
      placeholder="日"></el-input>日
      <el-input size="mini" v-model="hour" @change="changeHour" class="per-time"
      placeholder="时"></el-input>时
      <el-input
        size="mini"
        v-model="minute"
        @change="changeMinute"
        class="per-time"
        placeholder="分"
      ></el-input>分
      <el-input
        size="mini"
        v-model="second"
        @change="changeSecond"
        class="per-time"
        placeholder="秒"
      ></el-input>秒
    </div>
    <div class="time">
      <el-button size="mini" @click="timeToUnix">时间转时间戳↓</el-button>
      <el-button size="mini" @click="unixToTime">时间戳转时间↑</el-button>
    </div>
    <div class="time">
      <el-input size="mini" v-model="customTime" class="now-time" placeholder="当前时间"></el-input>
    </div>
    <!-- <div class="time">
      <div class="g-time">
        <div class="one-g-time" v-for="(value,index) in timeList" :key="index">
          <span class="one-g-country" v-text="value.country + ' ' + value.timeZone"></span>
          <div class="g-timestamp" v-text="value.time"></div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      nowTime: 0,
      stopTime: false,
      showTime: '',
      year: 2020,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      customTime: '',
      timeList: [
        { country: '伦敦', timeZone: -7, time: '-:-' },
        { country: '巴黎', timeZone: -6, time: '-:-' },
        { country: '迪拜', timeZone: -4, time: '-:-' },
        { country: '东京', timeZone: +1, time: '-:-' },
      ],
    };
  },
  created() {
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.day = new Date().getDate();
    setInterval(() => {
      const thisTime = new Date().getTime();
      if (!this.stopTime) {
        const genNowTime = thisTime;
        this.nowTime = Math.round(genNowTime / 1000);
        this.showTime = this.getTimestamp(new Date(genNowTime));
      }
      const zoneTime = thisTime;
      for (let i = 0; i < this.timeList.length; i += 1) {
        this.timeList[i].time = this.getMonthDayAndHourMin(
          new Date(zoneTime + this.timeList[i].timeZone * 3600 * 1000),
        );
      }
    }, 500);
  },
  methods: {
    getTimestamp(timestamp) {
      return `${timestamp.getFullYear()}-${
        timestamp.getMonth() + 1
      }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    },
    getMonthDayAndHourMin(timestamp) {
      return `${
        timestamp.getMonth() + 1
      }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}`;
    },
    changeYear() {
      if (this.year < 0) {
        this.year = new Date().getFullYear();
      }
      this.year = parseInt(this.year, 10);
    },
    changeMonth() {
      if (this.month <= 0 || this.month >= 13) {
        this.month = 1;
      }
      this.month = parseInt(this.month, 10);
    },
    changeDay() {
      if (this.day <= 0 || this.day >= 32) {
        this.day = 1;
      }
      this.day = parseInt(this.day, 10);
    },
    changeHour() {
      if (this.hour < 0 || this.hour >= 24) {
        this.hour = 0;
      }
      this.hour = parseInt(this.hour, 10);
    },
    changeMinute() {
      if (this.minute < 0 || this.minute >= 61) {
        this.minute = 0;
      }
      this.minute = parseInt(this.minute, 10);
    },
    changeSecond() {
      if (this.second < 0 || this.second >= 61) {
        this.second = 0;
      }
      this.second = parseInt(this.second, 10);
    },
    timeToUnix() {
      this.customTime = new Date(
        `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`,
      ).getTime() / 1000;
    },
    unixToTime() {
      let unixNumber;
      if ((`${this.customTime}`).length === 10) {
        unixNumber = parseInt(this.customTime, 10) * 1000;
      } else {
        unixNumber = parseInt(this.customTime, 10);
      }
      const time = new Date(unixNumber);
      this.year = time.getFullYear();
      this.month = time.getMonth() + 1;
      this.day = time.getDate();
      this.hour = time.getHours();
      this.minute = time.getMinutes();
      this.second = time.getSeconds();
    },
  },
};
</script>
<style lang="sass" scoped>
.time-container
  .time
    display: flex
    align-items: center
    padding-bottom: 5px
    font-size: 14px
    .g-time
      display: flex;
      flex-wrap: wrap;
      .one-g-country
        font-size: 12px;
      .one-g-time
        max-width: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
        .g-timestamp
          font-size: 16px
          font-weight: 600;
    .now-time-switch
        width: 100px
    .now-time
      display: flex
      flex-wrap: wrap
      padding-right: 10px
      width: 300px
    .now-timestamp
      width: 180px
    .now-unix-time
      width: 180px
    .per-time
      width: 60px
</style>

<template>
  <div class="decode-container">
    <el-input
      type="textarea"
      :autosize="true"
      placeholder="请输入需要转换的内容"
      v-model="originalText">
    </el-input>
    <div class="btn-container">
      <div class="btn-item">
          <el-button class="one-btn" size="mini" @click="urlEncode">UrlEncode</el-button>
          <el-button class="one-btn" size="mini" @click="urlDecode">UrlDecode</el-button>
      </div>
      <div class="btn-item">
          <el-button class="one-btn" size="mini" @click="cnToUtf8">中文转UTF-8</el-button>
          <el-button class="one-btn" size="mini" @click="utf8ToCn">UTF-8转中文</el-button>
      </div>
      <div class="btn-item">
        <el-button class="one-btn" size="mini" @click="cnToUnicode">中文转Unicode</el-button>
        <el-button class="one-btn" size="mini" @click="unicodeToCn">Unicode转中文</el-button>
      </div>
      <div class="btn-item">
        <el-button class="one-btn" size="mini" @click="md5Fun">MD5</el-button>
      </div>
    </div>
    <div>
    <el-input
      type="textarea"
      :autosize="true"
      :disabled="true"
      placeholder="转换回结果"
      v-model="outputText"></el-input>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5';

export default {
  data() {
    return {
      originalText: '',
      outputText: '',
    };
  },
  methods: {
    urlEncode() {
      if (this.originalText === '') { return; }
      this.outputText = encodeURIComponent(this.originalText);
    },
    urlDecode() {
      if (this.originalText === '') { return; }
      this.outputText = decodeURIComponent(this.originalText);
    },
    md5Fun() {
      if (this.originalText === '') { return; }
      this.outputText = md5(this.originalText);
    },
    cnToUtf8() {
      if (this.originalText === '') { return; }
      this.outputText = this.originalText.replace(/[^\u0000-\u00FF]/g, ($0) => escape($0).replace(/(%u)(\w{4})/gi, '&#x$2;'));
    },
    utf8ToCn() {
      if (this.originalText === '') { return; }
      this.outputText = unescape(this.originalText.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
    },
    cnToUnicode() {
      if (this.originalText === '') { return; }
      const res = [];
      for (let i = 0; i < this.originalText.length; i += 1) {
        res[i] = (`00${this.originalText.charCodeAt(i).toString(16)}`).slice(-4);
      }
      if (res.length > 0) {
        this.outputText = `\\u${res.join('\\u')}`;
      }
    },
    unicodeToCn() {
      if (this.originalText === '') { return; }
      const str = this.originalText.replace(/\\/g, '%');
      this.outputText = unescape(str);
    },
  },
};
</script>
<style lang="sass" scoped>
.decode-container
  width: 100%
  .btn-container
    display: flex
    padding: 5Px 0
    .btn-item
      display: flex;
      flex-direction: column;
      margin-right: 5px
  .one-btn
    margin-left: 0
</style>

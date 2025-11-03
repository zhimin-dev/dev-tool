<template>
  <div class="decode-container">
    <el-input
      type="textarea"
      :autosize="true"
      placeholder="请输入需要转换的内容"
      v-model="originalText"
    >
    </el-input>
    <div class="btn-container">
      <div class="btn-item">
        <el-button class="one-btn" @click="urlEncode">UrlEncode</el-button>
        <el-button class="one-btn" @click="urlDecode">UrlDecode</el-button>
      </div>
      <div class="btn-item">
        <el-button class="one-btn" @click="base64Encode"
          >base64Encode</el-button
        >
        <el-button class="one-btn" @click="base64Decode"
          >base64Decode</el-button
        >
      </div>
      <div class="btn-item">
        <el-button class="one-btn" @click="cnToUtf8">中文转UTF-8</el-button>
        <el-button class="one-btn" @click="utf8ToCn">UTF-8转中文</el-button>
      </div>
      <div class="btn-item">
        <el-button class="one-btn" @click="cnToUnicode"
          >中文转Unicode</el-button
        >
        <el-button class="one-btn" @click="unicodeToCn"
          >Unicode转中文</el-button
        >
      </div>
      <div class="btn-item">
        <el-button class="one-btn" @click="md5Fun">MD5</el-button>
        <el-button class="one-btn" @click="calLength">length</el-button>
      </div>
      <div class="btn-item">
        <el-button class="one-btn" @click="upperCase">upperCase</el-button>
        <el-button class="one-btn" @click="lowerCase">lowerCase</el-button>
      </div>
    </div>
    <div>
      <el-input
        type="textarea"
        :autosize="true"
        :disabled="true"
        placeholder="转换回结果"
        v-model="outputText"
      ></el-input>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";

export default {
  data() {
    return {
      originalText: "",
      outputText: "",
    };
  },
  methods: {
    upperCase() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = this.originalText.toUpperCase();
    },
    lowerCase() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = this.originalText.toLowerCase();
    },
    urlEncode() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = encodeURIComponent(this.originalText);
    },
    calLength() {
      this.outputText = this.originalText.length;
    },
    urlDecode() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = decodeURIComponent(this.originalText);
    },
    md5Fun() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = md5(this.originalText);
    },
    cnToUtf8() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = this.originalText.replace(/[^\u0000-\u00FF]/g, ($0) =>
        escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;")
      );
    },
    utf8ToCn() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = unescape(
        this.originalText
          .replace(/&#x/g, "%u")
          .replace(/\\u/g, "%u")
          .replace(/;/g, "")
      );
    },
    cnToUnicode() {
      if (this.originalText === "") {
        return;
      }
      const res = [];
      for (let i = 0; i < this.originalText.length; i += 1) {
        res[i] = `00${this.originalText.charCodeAt(i).toString(16)}`.slice(-4);
      }
      if (res.length > 0) {
        this.outputText = `\\u${res.join("\\u")}`;
      }
    },
    unicodeToCn() {
      if (this.originalText === "") {
        return;
      }
      const str = this.originalText.replace(/\\/g, "%");
      this.outputText = unescape(str);
    },
    base64Encode() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = btoa(encodeURIComponent(this.originalText));
    },
    base64Decode() {
      if (this.originalText === "") {
        return;
      }
      this.outputText = decodeURIComponent(atob(this.originalText));
    },
  },
};
</script>
<style scoped>
.decode-container {
  width: 100%;
}

.btn-container {
  display: flex;
  padding: 5px 0;
}

.btn-item {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  align-items: baseline;
}
.btn-item button:nth-child(1) {
  margin-bottom: 3px;
}

.one-btn {
  margin-left: 0;
}
</style>

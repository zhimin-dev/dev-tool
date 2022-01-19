<template>
  <div class="json-container" :class='{"full-width": isFull}'>
    <div class="or-json">
      <el-input
        type="textarea"
        placeholder="请输入json"
        @change="inputJson"
        v-model="orJson"
      ></el-input>
    </div>
    <div class="show-json" v-if="showJson !== ''">
      <el-input
        type="textarea"
        placeholder="显示的json"
        v-model="showJson"
        :autosize="true"
      ></el-input>
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
      orJson: '',
      showJson: '',
    };
  },
  methods: {
    inputJson() {
      if (this.orJson !== '') {
        this.doSort(1);
      }
    },
    doSort(type) {
      let obj;
      try {
        obj = JSON.parse(this.orJson);
      } catch (e) {
        this.$message.error('json转换失败');
      }
      const newJSON = this.sortJSON(obj, type);
      this.showJson = this.formatJson(newJSON);
    },
    sortJSON(old, sortType) {
      const type = Object.prototype.toString.call(old);
      const res = {};
      // 如果是对象就对key排序，生成一个新的对象返回
      if (type === '[object Object]') {
        const keyArray = [];
        for (const key in old) {
          if (Object.prototype.hasOwnProperty.call(old, key)) {
            keyArray.push(key);
          }
        }
        keyArray.sort();
        sortType != 1 && keyArray.reverse();
        for (let key in keyArray) {
          if (Object.prototype.hasOwnProperty.call(keyArray, key)) {
            key = keyArray[key];
            const value = old[key];
            res[key] = this.sortJSON(value, sortType);
          }
        }
        return res;
      }
      if (type === '[object Array]') {
        const _ = Object.prototype.toString.call(old[0]);
        // 如果数组里嵌套字符串和数字，直接对数组排序
        if (_ === '[object String]' || _ === '[object Number]') {
          old.sort();
          if (sortType !== 1) {
            old.reverse();
          }
          return old;
        }
        // 如果数组里嵌套对象，不改变对象顺序，只改变对象内属性顺序
        const newArray = [];
        for (let i = 0; i < old.length; i += 1) {
          newArray.push(this.sortJSON(old[i], sortType));
        }
        return newArray;
      }
      // 对对象里的value排序，但不是对象活数组，就原样返回
      return old;
    },
    formatJson(jsonObj) {
      // 转换后的字符串变量
      let formatted = '';
      // 换行缩进位数
      let pad = 0;
      // 一个tab对应空格位数
      const PADDING = '    ';
      // json对象转换为字符串变量
      let jsonString = JSON.stringify(jsonObj);
      // 存储需要特殊处理的字符串段
      const tempIndex = [];
      // 存储需要特殊处理的“再数组中的开始位置变量索引
      let tempIndexStart = null;
      // 存储需要特殊处理的“再数组中的结束位置变量索引
      let tempIndexEnd = null;
      // 将jsonString字符串内容通过\r\n符分割成数组
      let jsonArray = [];
      // 正则匹配到{,}符号则在两边添加回车换行
      jsonString = jsonString.replace(/([{}])/g, '\r\n$1\r\n');
      // 正则匹配到[,]符号则在两边添加回车换行
      jsonString = jsonString.replace(/([[\]])/g, '\r\n$1\r\n');
      // 正则匹配到,符号则在两边添加回车换行
      jsonString = jsonString.replace(/(,)/g, '$1\r\n');
      // 正则匹配到要超过一行的换行需要改为一行
      jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
      // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
      jsonString = jsonString.replace(/\r\n,/g, ',');
      // 特殊处理双引号中的内容
      jsonArray = jsonString.split('\r\n');
      jsonArray.forEach((node, index) => {
        // 获取当前字符串段中"的数量
        const num = node.match(/"/g) ? node.match(/"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && !tempIndexStart) {
          tempIndexStart = index;
        }
        if (num % 2 && tempIndexStart && tempIndexStart !== index) {
          tempIndexEnd = index;
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (tempIndexStart && tempIndexEnd) {
          tempIndex.push({
            start: tempIndexStart,
            end: tempIndexEnd,
          });
          tempIndexStart = null;
          tempIndexEnd = null;
        }
      });
      // 开始处理双引号中的内容，将多余的"去除
      tempIndex.reverse().forEach((item) => {
        const newArray = jsonArray.slice(item.start, item.end + 1);
        jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''));
      });
      // 奖处理后的数组通过\r\n连接符重组为字符串
      jsonString = jsonArray.join('\r\n');
      // 将匹配到:后为回车换行加大括号替换为冒号加大括号
      jsonString = jsonString.replace(/:\r\n\{/g, ':{');
      // 将匹配到:后为回车换行加中括号替换为冒号加中括号
      jsonString = jsonString.replace(/:\r\n\[/g, ':[');
      // 将上述转换后的字符串再次以\r\n分割成数组
      jsonArray = jsonString.split('\r\n');
      // 将转换完成的字符串根据PADDING值来组合成最终的形态
      jsonArray.forEach((item) => {
        let i = 0;
        // 表示缩进的位数，以tab作为计数单位
        let indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        let padding = '';
        if (item.match(/\{$/) || item.match(/\[$/)) {
          // 匹配到以{和[结尾的时候indent加1
          indent += 1;
        } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
          // 匹配到以}和]结尾的时候indent减1
          if (pad !== 0) {
            pad -= 1;
          }
        } else {
          indent = 0;
        }
        for (i = 0; i < pad; i += 1) {
          padding += PADDING;
        }
        formatted += `${padding + item}\r\n`;
        pad += indent;
      });
      // 返回的数据需要去除两边的空格
      return formatted.trim();
    },
  },
};
</script>

<style lang="sass" scoped>
.json-container
  .or-json
  .show-json
      padding-top: 20px

.full-width
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  .or-json
    width: 48%
    margin-right: 10px
  .show-json
    width: 48%
    padding-top: 0
</style>

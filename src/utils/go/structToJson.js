function structStrToJson(str) {
  let columns = parseStrToStructInner(str);
  let jsonArr = [];

  if (columns.length > 0) {
    // console.log("----inner");
    // console.log(columns[0][1]);
    // console.log(parseStrToOneColumn(columns[0][1]));
    let spArr = columns[0][1].split("\n");
    console.log(spArr);
    for (let i = 0; i < spArr.length; i++) {
      console.log(spArr[i]);
      let column = parseStrToOneColumn(spArr[i]);
      console.log("column", column);
      if (column.length >= 4) {
        let jsonName = parseStrToJsonStr(column[3]);
        console.log("jsonName", jsonName[1], "cType", column[2]);
        jsonArr.push({ name: jsonName[1], cType: column[2] });
      }
    }
  }
  console.log(jsonArr);
  return jsonArr;
}

function parseStrToStructInner(str) {
  //type\s\w+\sstruct\s?\{\s((.*\s)*)\}
  const regex = /type\s\w+\sstruct\s?\{\s((.*\s)*)\}/gm;
  let m;
  let obj = [];
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const one = {};
    m.forEach((match, groupIndex) => {
      one[groupIndex] = match;
    });
    obj.push(one);
  }
  return obj;
}

function parseStrToOneColumn(str) {
  //\s?(\w+)\s*(\w+)\s*\`(.*)`
  console.log("parseStrToOneColumn--");
  const regex = /\s?(\w+)\s*(\w+)\s*\`(.*)`/gm;
  let m;
  let obj = [];
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      obj[groupIndex] = match;
    });
  }
  return obj;
}

function parseStrToJsonStr(str) {
  //json:"(.*)"
  const regex = /json:"(.*)"/gm;
  let m;
  let obj = [];
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      obj[groupIndex] = match;
    });
  }
  return obj;
}

export { structStrToJson };

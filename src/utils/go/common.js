function ucFirst(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

function dbNameToCamelCase(name) {
  if (name === undefined) {
    return '';
  }
  const row = [];
  const re = name.split('_');
  re.map((val) => {
    row.push(ucFirst(val));
  });
  return row.join('');
}

function containStr(name, val) {
  if (name.indexOf(val) >= 0) {
    return true;
  }
  return false;
}

function isTimeType(type) {
  if (containStr(type, 'date') || containStr(type, 'datetime') || containStr(type, 'timestamp')) {
    return true;
  }
  return false;
}

function sqlTypeToGoType(type) {
  let isContainUsign = false;
  if (containStr(type, 'unsigned')) {
    isContainUsign = true;
  }
  if (containStr(type, 'varchar') || containStr(type, 'text')) {
    return 'string';
  }
  if (containStr(type, 'int')) {
    if (!isContainUsign) {
      return 'int64';
    }
    return 'uint64';
  }
  if (containStr(type, 'float')) {
    return 'float64';
  }
  if (containStr(type, 'decimal')) {
    return 'float64';
  }
  if (isTimeType(type)) {
    return 'time.Time';
  }
  return 'unknown';
}

function sqlToModel(data) {
  const dbName = data.tableName;
  const dbNameStr = dbNameToCamelCase(dbName);
  const packageName = 'db';
  const importPackages = [];
  let importPackageStr = '';
  let columsStr = '';
  let isTime = false;
  data.columns.map((val) => {
    let defaultStr = '';
    if (val.default !== undefined && val.default !== 'NULL' && val.default !== '') {
      defaultStr = `;default:${val.default}`;
    }
    const goType = sqlTypeToGoType(val.type);
    if (!isTime && isTimeType(val.type)) {
      isTime = true;
    }
    columsStr += `  ${dbNameToCamelCase(val.name)} ${goType} \`gorm:"column:${val.name}${defaultStr}" json:"${val.name}"\`\n`;
  });
  if (isTime) {
    importPackages.push('time');
  }
  let importStr = '';
  if (importPackages.length > 0) {
    importPackages.map((val) => {
      importPackageStr += `"${val}"\n`;
    });
    importStr = `import (
  ${importPackageStr}
)`;
  }
  const resultStr = `package ${packageName}
${importStr}
var New${dbNameStr} ${dbNameStr}Model

type ${dbNameStr}Model struct {
${columsStr}
}
func (*${dbNameStr}Model) TableName() string {
  return "${dbName}"
}
`;
  return resultStr;
}

// 解析sql表明等基础信息
function sqlStrToGoTemplate(str) {
  // CREATE TABLE `(.*)`\s\(\s((.*\s)*)\)\s(.*)COMMENT='(.*)'
  const regex = /CREATE TABLE `(.*)`\s\(\s((.*\s)*)\)\s(.*)COMMENT='(.*)'/gm;
  // `(.*)`\s(\w+[\((\d+)\)]*[\sunsigned\s]*)([NOT\s[NULL\s]*]*)(DEFAULT\s([\'](.*?)[\']|NULL)\s)*(AUTO_INCREMENT\s)*(COMMENT\s[\'](.*)[\'])*
  // const columnRegex = /`(.*)`\s(\w+[\((\d+)\)]*[\sunsigned\s]*)([NOT\s[NULL\s]*]*)(DEFAULT\s([\'](.*?)[\']|NULL)\s)*(AUTO_INCREMENT\s)*(COMMENT\s[\'](.*)[\'])*/gm;
  let m;
  const data = {};
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      data[groupIndex] = match;
    });
  }
  return sqlStrColumnToEachColumn(data);
}

// 解析sql每个字段
function sqlStrColumnToEachColumn(data) {
  const regex = /`(.*)`\s(\w+[\((\d+)\)]*[\sunsigned\s]*)([NOT\s[NULL\s]*]*)(DEFAULT\s([\'](.*?)[\']|NULL)\s)*(AUTO_INCREMENT\s)*(COMMENT\s[\'](.*)[\'])*/gm;
  const tableInfo = {
    tableName: data[1],
    engine: data[3],
    increasement: data[4],
    dafaultCharset: data[6],
  };
  const str = data[2];
  const columns = [];
  let m;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const one = {};
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex, arr) => {
      one[groupIndex] = match;
    });
    columns.push(one);
  }
  const columnData = [];
  columns.map((column) => {
    columnData.push({
      name: column[1], type: column[2], default: column[6], comment: column[9],
    });
  });
  tableInfo.columns = columnData;
  return sqlToModel(tableInfo);
}

export {
  sqlStrToGoTemplate,
  sqlStrColumnToEachColumn,
  sqlToModel,
  ucFirst,
  sqlTypeToGoType,
};

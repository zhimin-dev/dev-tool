function ucFirst(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

function dbNameToCamelCase(name) {
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

function sqlTypeToGoType(type) {
  let isContainUsign = false;
  if (containStr(type, 'unsigned')) {
    isContainUsign = true;
  }
  if (containStr(type, 'varchar')) {
    return 'string';
  }
  if (containStr(type, 'int')) {
    if (!isContainUsign) {
      return 'int64';
    }
    return 'uint64';
  }
  return 'unknown';
}

function sqlToModel(data) {
  const dbName = data.tableName;
  const dbNameStr = dbNameToCamelCase(dbName);
  const packageName = 'db';
  const importPackages = ['context',
    'github.com/jinzhu/gorm',
    'pkg.poizon.com/golang/go-common/mysql'];
  let importPackageStr = '';
  importPackages.map((val) => {
    importPackageStr += `"${val}"\n`;
  });
  let columsStr = '';
  data.columns.map((val) => {
    let defaultStr = '';
    if (val.default !== undefined && val.default !== 'NULL') {
      defaultStr = `;default:${val.default}`;
    }
    columsStr += `  ${dbNameToCamelCase(val.name)} ${sqlTypeToGoType(val.type)} \`gorm:"column:${val.name}${defaultStr}" json:"${val.name}"\`\n`;
  });
  const resultStr = `
package ${packageName}
import (
${importPackageStr}
)
var New${dbNameStr} ${dbNameStr}Model
type ${dbNameStr}Model struct {
${columsStr}
}
func (*${dbNameStr}Model) TableName() string {
  return "${dbName}"
}
`;
  console.log(resultStr);
  return resultStr;
}

// 解析sql表明等基础信息
function sqlStrToGoTemplate(str) {
  // CREATE TABLE `(.*)`\s\(([\d\D]*)\)\sENGINE=(.*)\sAUTO_INCREMENT=(\d+)\s(\w+)\sCHARSET=(\w+)\s(COLLATE=\w+)*
  const regex = /CREATE TABLE `(.*)`\s\(([\d\D]*)\)\sENGINE=(.*)\sAUTO_INCREMENT=(\d+)\s(\w+)\sCHARSET=(\w+)\s(COLLATE=\w+)*/gm;
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

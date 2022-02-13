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

function sqlStrColumnToEachColumn(data) {
  const regex = /`(.*)`\s(\w+[\((\d+)\)]*[\sunsigned\s]*)([NOT\s[NULL\s]*]*)(DEFAULT\s([\'](.*?)[\']|NULL)\s)*(AUTO_INCREMENT\s)*(COMMENT\s[\'](.*)[\'])*/gm;
  console.log(data);
  const tableName = data[1];
  const str = data[2];
  const engine = data[3];
  const incrasement = data[4];
  const dafaultCharset = data[6];
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
  console.log(columns);
}

export {
  sqlStrToGoTemplate,
  sqlStrColumnToEachColumn,
};

// 解析Go结构体，返回JSON对象
function parseGoStructToJson(goStruct) {
  const lines = goStruct
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("//") && !line.startsWith("/*"));

  const result = {};

  for (const line of lines) {
    // 跳过空行和注释
    if (
      !line ||
      line.startsWith("//") ||
      line.startsWith("/*") ||
      line.startsWith("*") ||
      line.startsWith("*/") ||
      line === "{" ||
      line === "}"
    ) {
      continue;
    }

    // 处理嵌套结构体结束
    if (line === "}") continue;

    // 处理字段行
    const fieldInfo = parseField(line);

    if (fieldInfo) {
      const { jsonName, value } = fieldInfo;

      // 匿名结构体字段展开
      if (jsonName === "-" || jsonName === "") {
        if (typeof value === "object" && value !== null) {
          Object.assign(result, value);
        }
      } else {
        result[jsonName] = value;
      }
    }
  }

  return result;
}

// 解析单个字段
function parseField(line) {
  // 匹配字段名称、类型和json标签
  const regex = /^(\w+)\s+(\S+.*?)(?:\s+`json:"([^"]+)"`)?$/;
  const match = line.match(regex);

  if (!match) {
    // 尝试匿名结构体
    if (line.includes("struct {")) {
      const value = parseAnonymousStruct(line);
      return { jsonName: "", value };
    }
    return null;
  }

  const fieldName = match[1];
  const typeExpression = match[2].trim();
  const jsonTag = match[3] || "";

  // 获取JSON字段名称
  let jsonName = fieldName;
  let omitEmpty = false;

  if (jsonTag) {
    const [name, ...options] = jsonTag.split(",");
    if (name === "-") {
      jsonName = "-";
    } else if (name) {
      jsonName = name;
    }
    omitEmpty = options.includes("omitempty");
  }

  // 生成字段的零值
  let value = generateZeroValue(typeExpression);

  // 如果字段为nil且支持omitempty，则跳过
  if (omitEmpty && value === null) {
    return null;
  }

  return { jsonName, value };
}

// 解析匿名结构体
function parseAnonymousStruct(line) {
  // 提取结构体定义
  const structRegex = /^(\w*)\s+struct\s+\{([^}]*)\}/;
  const structMatch = line.match(structRegex);

  if (structMatch) {
    // 获取结构体内容
    const structBody = structMatch[2].trim();
    const structName = structMatch[1];

    // 解析结构体内容
    const nestedResult = parseGoStructToJson(structBody);

    // 处理命名嵌套结构体
    if (structName) {
      return { [structName]: nestedResult };
    }

    // 直接返回匿名结构体
    return nestedResult;
  }

  return null;
}

// 根据类型生成零值
function generateZeroValue(typeExpression) {
  // 处理指针类型
  if (typeExpression.startsWith("*")) {
    return null; // 指针默认为 null
  }

  // 处理数组/切片类型
  if (typeExpression.includes("[]")) {
    return [];
  }

  // 处理 map 类型
  if (typeExpression.includes("map[")) {
    return {};
  }

  // 处理结构体类型
  if (typeExpression.includes("struct {")) {
    const structName = typeExpression.split(" ")[0];
    return parseGoStructToJson(
      `type ${structName} struct ${typeExpression.split("struct")[1]}`
    );
  }

  // 处理常见类型
  switch (typeExpression) {
    case "string":
    case "String":
    case "Time":
      return "";
    case "int":
    case "int8":
    case "int16":
    case "int32":
    case "int64":
    case "uint":
    case "uint8":
    case "uint16":
    case "uint32":
    case "uint64":
    case "float32":
    case "float64":
    case "complex64":
    case "complex128":
      return 0;
    case "bool":
      return false;
    default:
      return null; // 无法识别的类型
  }
}

export { parseGoStructToJson };

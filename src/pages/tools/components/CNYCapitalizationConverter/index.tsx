import {Button, Input, message} from "antd";
import React, {useCallback, useEffect, useState} from "react";

function isValidChineseMoneyFormat(text) {
  // 正则表达式，用于匹配大写人民币形式
  const chineseMoneyPattern = /^([零壹贰叁肆伍陆柒捌玖拾佰仟万亿元角分整]+)$/;

  // 检查文本是否匹配正则表达式
  return chineseMoneyPattern.test(text);
}

function isValidArabicCurrencyFormat(text) {
  // 正则表达式，用于匹配阿拉伯数字货币形式
  const arabicCurrencyPattern = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{1,2})?$/;

  // 检查文本是否匹配正则表达式
  return arabicCurrencyPattern.test(text);
}

const messageKey = 'messageKey';

const copyData = (content: string | number) => {
  navigator.clipboard.writeText(content.toString());
  message.success({
    content: '复制成功',
    duration: 1,
    key: messageKey
  });
};

/** 将数字转换为中文大写形式 */
function numberToChinese(num: number | string | string[]) {
  // 定义大写数字
  const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const cnIntRadice = ["", "拾", "佰", "仟"];
  const cnIntUnits = ["", "万", "亿", "兆"];
  const cnDecUnits = ["角", "分", "毫", "厘"];
  // 特殊字符
  const cnInteger = "整";
  const cnIntLast = "元";
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const maxNum = 999999999999999.9999; // 最大处理的数字

  // 输出的大写金额
  let integral; // 整数部分数字
  let decimal; // 小数部分数字
  let outputCharacters = ""; // 输出的大写金额
  let parts; // 分离金额后用的数组，预定义

  // 金额的检查
  if (num === "") {
    return "";
  }
  num = parseFloat(num as string);
  // 判断输入的数值是否大于定义的数值
  if (num >= maxNum) {
    return "";
  }
  // 格式化金额
  num = "" + num.toFixed(2); // 转换为字符串
  // 分离金额的整数部分和小数部分
  parts = num.split(".");
  if (parts.length > 1) {
    integral = parts[0];
    decimal = parts[1];
    // 删除小数点后的多余部分
    decimal = decimal.substr(0, 2);
  } else {
    integral = parts[0];
    decimal = "";
  }
  // 获取整型部分转换
  if (parseInt(integral, 10) > 0) {
    let zeroCount = 0;
    const IntLen = integral.length;
    for (let i = 0; i < IntLen; i++) {
      const n = integral.substr(i, 1);
      const p = IntLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      if (n === "0" || n === 0) {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          outputCharacters += cnNums[0];
        }
        zeroCount = 0; // 归零
        outputCharacters += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if ([0, "0"].includes(m) && zeroCount < 4) {
        outputCharacters += cnIntUnits[q];
      }
    }
    outputCharacters += cnIntLast;
  }
  // 小数部分
  if (decimal !== "") {
    const decLen = decimal.length;
    for (let i = 0; i < decLen; i++) {
      const n = decimal.substr(i, 1);
      if (n !== "0") {
        outputCharacters += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (outputCharacters === "") {
    outputCharacters = cnNums[0] + cnIntLast + cnInteger;
  }
  if (decimal === "") {
    outputCharacters += cnInteger;
  }
  return outputCharacters;
}

/**将中文转换为阿拉伯数字 */
function chineseToNumber(chineseRMB) {// 定义大写数字对应的阿拉伯数字
  // 汉字数字与阿拉伯数字的映射
  const chineseNumMap = {
    '零': 0,
    '壹': 1,
    '贰': 2,
    '叁': 3,
    '肆': 4,
    '伍': 5,
    '陆': 6,
    '柒': 7,
    '捌': 8,
    '玖': 9
  };

  // 单位与权重的映射
  const unitMap = {
    '元': 1,
    '角': 0.1,
    '分': 0.01
  };
  let result = 0;
  let unit = '元'; // 默认单位是元
  let tempNum = 0; // 用于累加连续的数字

  for (let i = chineseRMB.length - 1; i >= 0; i--) {
    const char = chineseRMB[i];
    const isNum = char in chineseNumMap;
    const isUnit = char in unitMap;

    if (isNum) {
      // 如果是数字，则累加
      tempNum = tempNum * 10 + chineseNumMap[char];
    } else if (isUnit) {
      // 如果是单位，则累加之前的数字，并更新单位
      result += tempNum * unitMap[char];
      tempNum = 0;
      unit = char;
    } else if (char === '整') {
      // “整”表示结束，无需处理
    } else {
      // 非数字和非单位字符，直接忽略或抛出错误
      // 这里简化处理，直接忽略
    }
  }

  // 处理最后剩下的数字（没有单位跟在后面的情况）
  result += tempNum * unitMap[unit];

  // 四舍五入到小数点后两位
  result = Math.round(result * 100) / 100;

  return result.toFixed(2); // 返回固定两位小数的字符串形式
}

const CNYCapitalizationConverter: React.FC = () => {
  /** 阿拉伯数字源数据 */
  const [sourceArabicNumerals, setSourceArabicNumerals] = useState<string | number>(0);
  /** 大写汉字形式源数据 */
  const [sourceCapitalChineseCharacters, setSourceCapitalChineseCharacters] = useState<string | number>(0);

  /** 阿拉伯数字转换结果 */
  const [targetArabicNumerals, setTargetArabicNumerals] = useState<string | number>(0);
  /** 大写汉字形式转换结果 */
  const [targetCapitalChineseCharacters, setTargetCapitalChineseCharacters] = useState<string | number>(0);

  useEffect(() => {
    const initArabicNumerals = 356840.97;
    setSourceArabicNumerals(initArabicNumerals);
    setSourceCapitalChineseCharacters(numberToChinese(initArabicNumerals));
    setTargetArabicNumerals(chineseToNumber(numberToChinese(initArabicNumerals)));
    setTargetCapitalChineseCharacters(numberToChinese(initArabicNumerals));
  }, []);

  const onSourceRgbColorValue = useCallback((e) => {
    setSourceArabicNumerals(e.target.value);
  }, []);

  const onClickNumberToChinese = useCallback(() => {
    if (!isValidArabicCurrencyFormat(sourceArabicNumerals)) {
      message.warning({
        content: '阿拉伯数字形式格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }
    const target = numberToChinese(sourceArabicNumerals);
    setTargetCapitalChineseCharacters(target);
  }, [sourceArabicNumerals]);

  const onSourceHexColorCodeChange = useCallback((e) => {
    setSourceCapitalChineseCharacters(e.target.value);
  }, []);

  const onClickChineseToNumber = useCallback(() => {
    if (!isValidChineseMoneyFormat(sourceCapitalChineseCharacters)) {
      message.warning({
        content: '大写人民币形式格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }
    setTargetArabicNumerals(chineseToNumber(sourceCapitalChineseCharacters));
  }, [sourceCapitalChineseCharacters]);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item" style={{
          width: '160px'
        }}>
          <div className="label">阿拉伯数字形式：</div>
          <Input value={sourceArabicNumerals} onChange={onSourceRgbColorValue} placeholder="请输入阿拉伯数字形式" onPressEnter={onClickNumberToChinese}  />
        </div>
        <Button className="convert-btn" onClick={onClickNumberToChinese}>转换</Button>
        <div className="converter-item">
          <div className="label">大写人民币形式：</div>
          <Input
            value={targetCapitalChineseCharacters}
            onClick={() => copyData(targetCapitalChineseCharacters)}
          />
        </div>
      </div>
      {/* <div className="converter-row">
        <div className="converter-item">
          <div className="label">大写人民币形式：</div>
          <Input
            placeholder="请输入大写人民币形式"
            value={sourceCapitalChineseCharacters}
            onChange={onSourceHexColorCodeChange}
            onPressEnter={onClickChineseToNumber}
          />
        </div>
        <Button className="convert-btn" onClick={onClickChineseToNumber}>转换</Button>
        <div className="converter-item">
          <div className="label">阿拉伯数字形式：</div>
          <Input value={targetArabicNumerals} onClick={() => copyData(targetArabicNumerals)} />
        </div>
      </div> */}
    </div>

    <div className="tool-description-container">
      <h1>大写人民币形式</h1>
      <div className="content">
      大写人民币形式是中国传统的货币书写方式，以汉字形式表达人民币金额。以下是大写人民币形式的基本规则和示例：
      </div>

      <div className="content">
        <ol>
          <li>数字表示：大写人民币使用汉字数字表示，例如：“壹”代表数字1，“贰”代表数字2，“叁”代表数字3，以此类推，肆、伍、陆、柒、捌、玖。</li>
          <li>单位表示：大写人民币使用汉字单位表示金额的数量级，包括元、角、分、拾、佰、仟、万、亿等。</li>
          <li>规则：
            <ul>
              <li>数字与单位之间的组合表示具体金额，例如：“壹佰元”表示100元，“伍角”表示0.5元，“肆分”表示0.04元。</li>
              <li>数字和单位之间没有空格，但不同的金额部分之间要用“元”隔开，例如：“壹佰元肆角伍分”表示100.45元。</li>
              <li>万、亿等单位之间也要用“元”隔开，例如：“壹佰万元”表示1000万元，“壹佰亿元”表示10亿元。</li>
            </ul>
          </li>
          <li>角和分的表示：大写人民币可以表示角和分，例如：“伍角”表示0.5元，“肆分”表示0.04元。</li>
          <li>零的使用：在大写人民币中，零的使用较为灵活，一般用于表示金额中的空位，但在单位间的零不可省略，例如：“壹仟零肆拾元”表示1040元，“壹亿零壹佰万元”表示1000100万元。</li>
        </ol>
      </div>

      <div className="content">
      大写人民币形式在书面财务报表、合同文件等场合经常使用，是中国传统的文化习惯之一。
      </div>
    </div>
  </div>;
};

export default CNYCapitalizationConverter;

import {FieldTimeOutlined} from '@ant-design/icons';
import {Button, Input, message,Select} from "antd";
import {isString} from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from "react";
const {Option} = Select;
import './index.less';


enum TimestampType {
  'MS' = 'ms',
  "SECOND" = 'second'
}


const messageKey = 'messageKey';

enum SystemType {
  Binary = 'binary',
  Octonary = 'octonary',
  Decimalism = 'decimalism',
  Hexadecimal = 'hexadecimal'
}

const cleanData = (data) => {
  return data.trim().replace(/\s+/g, '');
};

function binaryToOctal(binary) {
  const decimal = parseInt(binary, 2);
  return decimal.toString(8);
}

function binaryToDecimal(binary) {
  return parseInt(binary, 2).toString(10);
}

function binaryToHex(binary) {
  const decimal = parseInt(binary, 2);
  return decimal.toString(16).toUpperCase();
}

function octalToBinary(octal) {
  const decimal = parseInt(octal, 8);
  return decimal.toString(2);
}

function octalToDecimal(octal) {
  return parseInt(octal, 8).toString(10);
}

function octalToHex(octal) {
  const decimal = parseInt(octal, 8);
  return decimal.toString(16).toUpperCase();
}

function decimalToBinary(decimal) {
  decimal = parseInt(decimal, 10);
  return decimal.toString(2);
}

function decimalToOctal(decimal) {
  decimal = parseInt(decimal, 10);
  return decimal.toString(8);
}

function decimalToHex(decimal) {
  decimal = parseInt(decimal, 10);
  return decimal.toString(16).toUpperCase();
}

function hexToBinary(hex) {
  const decimal = parseInt(hex, 16);
  return decimal.toString(2);
}

function hexToDecimal(hex) {
  return parseInt(hex, 16).toString(10);
}

function hexToOctal(hex) {
  const decimal = parseInt(hex, 16);
  return decimal.toString(8);
}

const isValidBinary = (binary) => {
  const binaryRegex = /^[01]+$/;
  return binaryRegex.test(binary);
};

const isValidDecimal = (decimal) => {
  const decimalRegex = /^[0-9]+$/;
  return decimalRegex.test(decimal);
};

const isValidOctal = (octal) => {
  const octalRegex = /^[0-7]+$/;
  return octalRegex.test(octal);
};

const isValidHex = (hex) => {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  return hexRegex.test(hex);
};


const warning = (content = '数值格式错误') => {
  message.warning({
    content,
    duration: 1,
    key: messageKey
  });
};

const copyData = (content: string | number) => {
  navigator.clipboard.writeText(content.toString());
  message.success({
    content: '复制成功',
    duration: 1,
    key: messageKey
  });
};

const DigitSystemConverter: React.FC = () => {
  const [binary, setBinary] = useState<string | number>('');
  const [octonary, setOctonary] = useState<string | number>('');
  const [decimalism, setDecimalism] = useState<string | number>('');
  const [hexadecimal, setHexadecimal] = useState<string | number>('');

  useEffect(() => {
    if (isValidDecimal(cleanData(decimalism))) {
      if (!(parseInt(cleanData(decimalism)) <= Number.MAX_SAFE_INTEGER)) {
        warning("数值超出最大安全值，失去计算精度");
      }
    }
  }, [decimalism]);

  const onInputBlur = useCallback((e, type: SystemType) => {
    switch (type) {
    case SystemType.Binary: {
      if (!isValidBinary(cleanData(binary))) {
        return;
      }
      copyData(binary);
      break;
    }
    case SystemType.Octonary: {
      if (!isValidOctal(cleanData(octonary))) {
        return;
      }
      copyData(octonary);
      break;
    }
    case SystemType.Decimalism: {
      if (!isValidDecimal(cleanData(decimalism))) {
        return;
      }
      copyData(decimalism);
      break;
    }
    case SystemType.Hexadecimal: {
      if (!isValidHex(cleanData(hexadecimal))) {
        return;
      }
      copyData(hexadecimal);
      break;
    }
    default:
      break;
    }
  }, [binary, decimalism, hexadecimal, octonary]);

  const onInputChange = useCallback((e, type: SystemType) => {
    const value = e.target.value;
    const cleanedValue = cleanData(value);
    switch (type) {
    case SystemType.Binary: {
      setBinary(value);
      if (!isValidBinary(cleanedValue)) {
        return warning();
      }
      setOctonary(binaryToOctal(cleanedValue));
      setDecimalism(binaryToDecimal(cleanedValue));
      setHexadecimal(binaryToHex(cleanedValue));
      break;
    }
    case SystemType.Octonary: {
      setOctonary(value);
      if (!isValidOctal(cleanedValue)) {
        return warning();
      }
      setBinary(octalToBinary(cleanedValue));
      setDecimalism(octalToDecimal(cleanedValue));
      setHexadecimal(octalToHex(cleanedValue));
      break;
    }
    case SystemType.Decimalism: {
      setDecimalism(value);
      if (!isValidDecimal(cleanedValue)) {
        return warning();
      }
      setBinary(decimalToBinary(cleanedValue));
      setOctonary(decimalToOctal(cleanedValue));
      setHexadecimal(decimalToHex(cleanedValue));
      break;
    }
    case SystemType.Hexadecimal: {
      setHexadecimal(value);
      if (!isValidHex(cleanedValue)) {
        return warning();
      }
      setBinary(hexToBinary(cleanedValue));
      setOctonary(hexToOctal(cleanedValue));
      setDecimalism(hexToDecimal(cleanedValue));
      break;
    }
    default: {
      break;
    }
    }
  }, []);


  return <div className="digit-system-converter-tool-container">
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item">
          <div className="label">二进制：</div>
          <Input value={binary} onChange={(e) => onInputChange(e, SystemType.Binary)} placeholder="请输入二进制数值" onClick={(e) => onInputBlur(e, SystemType.Binary)}/>
        </div>
        <div className="converter-item">
          <div className="label">八进制：</div>
          <Input value={octonary} onChange={(e) => onInputChange(e, SystemType.Octonary)} placeholder="请输入八进制数值" onClick={(e) => onInputBlur(e, SystemType.Octonary)}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item">
          <div className="label">十进制：</div>
          <Input value={decimalism} onChange={(e) => onInputChange(e, SystemType.Decimalism)} placeholder="请输入十进制数值" onClick={(e) => onInputBlur(e, SystemType.Decimalism)}/>
        </div>
        <div className="converter-item">
          <div className="label">十六进制：</div>
          <Input value={hexadecimal} onChange={(e) => onInputChange(e, SystemType.Hexadecimal)} placeholder="请输入十六进制数值" onClick={(e) => onInputBlur(e, SystemType.Hexadecimal)}/>
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>进制介绍</h1>
      <div className="content">
      进制，亦称为“进位制”，是人为规定的数字表示方法。对于任何一种进制——X进制，就表示每一位置上的数运算时都是逢X进一位。十进制是日常生活中最常用的进制，通常称为“逢十进一”。十进制计数的基础是“逢十进一”，即每相邻的两个计数单位之间的进率都是十。除了十进制，常见的还有二进制、八进制和十六进制等。
      </div>
      <div className="content">
      二进制：在二进制中，只有两个数字0和1，基数为2，逢2进1。例如，二进制数1101转换为十进制是 (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰) = 8 + 4 + 0 + 1 = 13。
      </div>
      <div className="content">
      八进制：在八进制中，有0-7共八个数字，基数为8，逢8进1。例如，八进制数123转换为十进制是 (1 × 8²) + (2 × 8¹) + (3 × 8⁰) = 64 + 16 + 3 = 83。
      </div>
      <div className="content">
      十六进制：在十六进制中，有0-9和A-F（代表10-15）共十六个数字或符号，基数为16，逢16进1。例如，十六进制数A3F转换为十进制是 (10 × 16²) + (3 × 16¹) + (15 × 16⁰) = 2560 + 48 + 15 = 2623。
      </div>
      <div className="content">
      不同进制之间可以相互转换，以满足不同场合和需求下的数字表示和处理要求。在计算机科学中，二进制、八进制和十六进制等进制被广泛用于数据存储和计算，因为它们的基数是2的幂次方，便于进行位运算和内存管理。
      </div>
    </div>
  </div>;
};

export default DigitSystemConverter;

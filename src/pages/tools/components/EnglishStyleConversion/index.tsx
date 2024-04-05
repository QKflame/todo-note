import {Input} from "antd";
import React, {useCallback, useState} from "react";
import {success, warning} from "src/utils/message";
import {copyText} from "src/utils/util";
const TextArea = Input.TextArea;

enum ConvertType {
  allUpperCase,
  allLowercase,
  camelCase,
  lowerCamelCase,
  spaceToUnderline,
  spaceToCamelCase,
  underlineToSpace,
  camelCaseToSpace,
  underscoreToDash,
  dashToUnderscore,
  clearSpaces,
  clearNewLines,
}

function toCamelCase(text: string, separator = ' ') {
  let words: string[] = [];

  text = text.trim();

  if (separator === ' ') {
    words = text.split(/\s+/);
  } else if (separator === '_') {
    words = text.split(/_+/);
  } else if (separator === '-') {
    words = text.split(/-+/);
  }

  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return camelCaseWords.join('');
}

function capitalizeFirstLetter(text) {
  // 将字符串的第一个字符转换为大写，然后将其与剩余字符串拼接起来
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toLowerCaseFirstLetter(text) {
  // 将字符串的第一个字符转换为小写，然后将其与剩余字符串拼接起来
  return text.charAt(0).toLowerCase() + text.slice(1);
}

const convertTypes: Array<{
  label: string;
  value: ConvertType
}> = [
  {
    label: '全大写',
    value: ConvertType.allUpperCase
  },
  {
    label: '全小写',
    value: ConvertType.allLowercase,
  },
  {
    label: '首字母大写',
    value: ConvertType.camelCase
  },
  {
    label: '首字母小写',
    value: ConvertType.lowerCamelCase
  },
  {
    label: '空格转下划线',
    value: ConvertType.spaceToUnderline
  },
  {
    label: '空格转驼峰',
    value: ConvertType.spaceToCamelCase
  },
  {
    label: '下划线转空格',
    value: ConvertType.underlineToSpace
  },
  {
    label: '驼峰转空格',
    value: ConvertType.camelCaseToSpace
  },
  {
    label: '下划线转中划线',
    value: ConvertType.underscoreToDash
  },
  {
    label: '中划线转下划线',
    value: ConvertType.dashToUnderscore
  },
  {
    label: '清除空格',
    value: ConvertType.clearSpaces
  },
  {
    label: '清除换行',
    value: ConvertType.clearNewLines
  }
];

const EnglishStyleConversion: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  // const [currentConvertType, setCurrentConvertType] = useState<ConvertType>(ConvertType.allUpperCase);

  const onSourceTextChange = useCallback((e) => {
    setSourceText(e.target.value);
  }, []);

  const onClickConvertType = useCallback((value) => {
    if (!sourceText.length) {
      return warning("请输入转换文本");
    }
    switch(value) {
    case ConvertType.allUpperCase: {
      setSourceText(sourceText.toUpperCase());
      break;
    }
    case ConvertType.allLowercase: {
      setSourceText(sourceText.toLocaleLowerCase());
      break;
    }
    case ConvertType.camelCase: {
      setSourceText(capitalizeFirstLetter(sourceText));
      break;
    }
    case ConvertType.lowerCamelCase: {
      setSourceText(toLowerCaseFirstLetter(sourceText));
      break;
    }
    case ConvertType.spaceToUnderline: {
      setSourceText(sourceText.trim().replace(/\s+/g, '_'));
      break;
    }
    case ConvertType.spaceToCamelCase: {
      setSourceText(toCamelCase(sourceText, ' '));
      break;
    }
    case ConvertType.underlineToSpace: {
      setSourceText(sourceText.trim().replace(/_+/g, ' '));
      break;
    }
    case ConvertType.camelCaseToSpace: {
      setSourceText(sourceText.trim().replace(/([A-Z])/g, ' $1').toLowerCase());
      break;
    }
    case ConvertType.underscoreToDash: {
      setSourceText(sourceText.trim().replace(/_+/g, '-'));
      break;
    }
    case ConvertType.dashToUnderscore: {
      setSourceText(sourceText.trim().replace(/-+/g, '_'));
      break;
    }
    case ConvertType.clearSpaces: {
      setSourceText(sourceText.trim().replace(/\s+/g, ''));
      break;
    }
    case ConvertType.clearNewLines: {
      setSourceText(sourceText.trim().replace(/\n/g, ''));
      break;
    }
    case 'clear': {
      setSourceText('');
      break;
    }
    case 'copy': {
      copyText(sourceText);
      success("复制成功");
      break;
    }
    default: {
      break;
    }
    }
  }, [sourceText]);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">转换文本：</div>
          <TextArea rows={4} placeholder="请输入转换文本内容" value={sourceText} onChange={onSourceTextChange} spellCheck={false}/>
        </div>
      </div>

      <div className="convert-btns-container">
        {
          convertTypes.map(item => <div className="convert-btn-item" key={item.value} onClick={() => onClickConvertType(item.value)}>{item.label}</div>)
        }

        <div className="convert-btn-item clear-btn" onClick={() => onClickConvertType('clear')}>清空</div>
        <div className="convert-btn-item copy-btn" onClick={() => onClickConvertType('copy')}>复制</div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>驼峰命名法</h1>
      <div className="content">
      驼峰命名法是一种编程代码命名规范，也叫驼峰式命名法。它的名称来源于其类似于驼峰形状的外观。驼峰命名法分为大驼峰命名法和小驼峰命名法。
      </div>
      <div className="content">
      大驼峰命名法的特点是，第一个单词的首字母大写，后面的每个单词的首字母也大写。例如：SendMessage。大驼峰命名法通常用于类名、属性、命名空间等。
      </div>
      <div className="content">
      小驼峰命名法的特点是，第一个单词的首字母小写，后面的每个单词的首字母大写。例如：myMessage。小驼峰命名法通常用于变量、函数名等。
      </div>
    </div>
  </div>;
};

export default EnglishStyleConversion;

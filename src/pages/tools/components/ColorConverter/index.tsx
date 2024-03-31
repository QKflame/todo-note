import './index.less';

import {Button, Input, message} from "antd";
import React, {useCallback, useEffect, useState} from "react";

// 将RGB颜色值转换为十六进制颜色码
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const isValidHexColor = (hexColor) => {
  hexColor = hexColor.trim();
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(hexColor);
};

function hexToRgb(hex) {
  hex = hex.trim();
  // 去除 # 号
  hex = hex.replace(/^#/, '');

  // 检查是否为简写形式的十六进制颜色码，如果是则进行展开
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // 将十六进制颜色码转换为RGB颜色值
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
}

// 将rga形式的颜色值转换为RGB颜色值
const rgaToRgb = (rga) => {
  // 匹配rga(255,255,255)形式或rgb(255, 255, 255)形式的字符串，并提取括号内的数字
  const match = rga.match(/(?:rgba?\()?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)?/);

  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return {r, g, b};
  }

  return null;
};

const messageKey = 'messageKey';

const ColorBlock: React.FC<{
  color: string;
}> = ({color}) => {
  return <div style={{
    width: '18px',
    height: '18px',
    backgroundColor: color || '#fff',
    borderRadius: '2px',
    border: '1px solid #fff'
  }}></div>;
};

const copyData = (content: string | number) => {
  navigator.clipboard.writeText(content.toString());
  message.success({
    content: '复制成功',
    duration: 1,
    key: messageKey
  });
};

const ColorConverter: React.FC = () => {
  const [sourceRgbColorValue, setSourceRgbColorValue] = useState('');
  const [sourceHexColorCode, setSourceHexColorCode] = useState('');

  const [targetRgbColorValue, setTargetRgbColorValue] = useState('');
  const [targetHexColorCode, setTargetHexColorCode] = useState('');

  useEffect(() => {
    const initHexCode = '#f50057';
    setSourceHexColorCode(initHexCode);
    setSourceRgbColorValue('rgb(107, 182, 164)');
    setTargetRgbColorValue(hexToRgb(initHexCode));
    setTargetHexColorCode(rgbToHex(107, 182, 164));
  }, []);

  const onSourceRgbColorValue = useCallback((e) => {
    setSourceRgbColorValue(e.target.value);
  }, []);

  const onClickConvertRGBToHexCode = useCallback(() => {
    const target = rgaToRgb(sourceRgbColorValue);
    if (!target) {
      message.warning({
        content: 'RGB颜色值格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }
    setTargetHexColorCode(rgbToHex(target.r, target.g, target.b));
  }, [sourceRgbColorValue]);

  const onSourceHexColorCodeChange = useCallback((e) => {
    setSourceHexColorCode(e.target.value);
  }, []);

  const onClickConvertHexCodeToRGBBtn = useCallback(() => {
    if (!isValidHexColor(sourceHexColorCode)) {
      message.warning({
        content: '十六进制颜色码格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }
    setTargetRgbColorValue(hexToRgb(sourceHexColorCode));
  }, [sourceHexColorCode]);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item">
          <div className="label">RGB颜色值：</div>
          <Input value={sourceRgbColorValue} onChange={onSourceRgbColorValue} placeholder="请输入RGB颜色值" onPressEnter={onClickConvertRGBToHexCode} />
        </div>
        <Button className="convert-btn" onClick={onClickConvertRGBToHexCode}>转换</Button>
        <div className="converter-item">
          <div className="label">十六进制颜色码：</div>
          <Input
            value={targetHexColorCode}
            addonAfter={<ColorBlock color={targetHexColorCode}></ColorBlock>}
            onClick={() => copyData(targetHexColorCode)}
          />
        </div>
      </div>
      <div className="converter-row">
        <div className="converter-item">
          <div className="label">十六进制颜色码：</div>
          <Input
            placeholder="请输入十六进制颜色码"
            value={sourceHexColorCode}
            onChange={onSourceHexColorCodeChange}
            onPressEnter={onClickConvertHexCodeToRGBBtn}
          />
        </div>
        <Button className="convert-btn" onClick={onClickConvertHexCodeToRGBBtn}>转换</Button>
        <div className="converter-item">
          <div className="label">RGB颜色值：</div>
          <Input value={targetRgbColorValue} addonAfter={<ColorBlock color={targetRgbColorValue}></ColorBlock>} onClick={() => copyData(targetRgbColorValue)} />
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>RGB颜色值</h1>
      <div className="content">
      RGB颜色值是一种用于表示颜色的数值，它由红（R）、绿（G）、蓝（B）三个通道的数值组成，每个通道的取值范围是0到255之间的整数，不同的数值组合可以表示出不同的颜色。例如，红色在RGB颜色模式中所对应的值就是255，0，0；绿色在RGB颜色模式中所对应的值就是0，255，0；蓝色在RGB颜色模式中所对应的值就是0，0，255。
      </div>
      <h1>十六进制颜色码</h1>
      <div className="content">
      十六进制颜色码是一种用于表示颜色的数值，它由六个十六进制数字组成，每个数字对应红（R）、绿（G）、蓝（B）三个通道中的一个数值，取值范围是0到255之间的整数，不同的数值组合可以表示出不同的颜色。
      </div>
    </div>
  </div>;
};

export default ColorConverter;

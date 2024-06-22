import {LockOutlined, UnlockOutlined} from "@ant-design/icons";
import {Button, Input} from "antd";
import React, {useCallback, useState} from "react";
import {error, success, warning} from "src/utils/message";
import {copyText} from "src/utils/util";
const TextArea = Input.TextArea;

// Base64 编码
function encodeToBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

// Base64 解码
function decodeFromBase64(encodedText) {
  return decodeURIComponent(escape(atob(encodedText)));
}


const Base64: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const onSourceTextChange = useCallback((e) => {
    setSourceText(e.target.value);
  }, []);

  const onClickLockBtn = useCallback(() => {
    if (!sourceText) {
      return warning("请输入源文本内容");
    }
    setResult(encodeToBase64(sourceText));
  }, [sourceText]);

  const onClickUnlockBtn = useCallback(() => {
    if (!sourceText) {
      return warning("请输入源文本内容");
    }
    let ret = '';
    try {
      ret = decodeFromBase64(sourceText);
    } catch (e) {
      return error("解码失败，请检查源文本内容");
    }
    setResult(ret);
  }, [sourceText]);

  const onClickResult = useCallback(() => {
    if (!result) {
      return;
    }
    copyText(result);
    success("复制成功");
  }, [result]);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">源文本：</div>
          <TextArea rows={4} placeholder="请输入源文本内容" value={sourceText} onChange={onSourceTextChange} spellCheck={false}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">编/解码结果：</div>
          <TextArea rows={4} placeholder="此处显示编解码结果" value={result} onClick={onClickResult} spellCheck={false}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          {/* <div className="label">操作：</div> */}
          <div className="operation-btns">
            <Button onClick={onClickLockBtn} className="lock-btn">编码</Button>
            <Button onClick={onClickUnlockBtn} className="unlock-btn">解码</Button>
          </div>
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>Base64 编解码介绍</h1>
      <div className="content">
      Base64编解码是一种在计算机网络中广泛应用的编码方式，主要用于将二进制数据转换为可打印的ASCII字符。以下是关于Base64编解码的详细介绍：
      </div>
      <h2>编码原理：</h2>
      <div className="content">
        <ol>
          <li>将原始数据划分为连续的字节序列。</li>
          <li>将每个字节转换为8位二进制数。</li>
          <li>将这些二进制数按照6位一组进行分组，不足6位的用0补齐。</li>
          <li>将每个6位的二进制数转换为对应的十进制数。</li>
          <li>根据Base64字符表，将十进制数转换为相应的可打印ASCII字符。Base64字符表通常由64个字符组成，包括小写字母a-z、大写字母A-Z、数字0-9以及字符"+"和"/"。如果数据长度不是3的倍数，Base64会在编码后的字符串末尾添加"="符号来作为填充。</li>
        </ol>
      </div>
      <h2>解码原理：</h2>
      <div className="content">
      Base64解码是编码的逆过程。首先，将Base64编码后的字符串按照4个字符一组进行分组，并将每个字符转换回对应的十进制数。然后，将这些十进制数转换回6位二进制数，并将这些二进制数连接起来。最后，去掉因为填充而添加的"="符号，还原出原始的二进制数据。</div>
    </div>
  </div>;
};

export default Base64;

import {Button, Input} from "antd";
import React, {useCallback, useState} from "react";
import {error, success, warning} from "src/utils/message";
import {copyText} from "src/utils/util";
const TextArea = Input.TextArea;

// Urlencode 编码
function urlencode(text) {
  return encodeURIComponent(text);
}

// Urlencode 解码
function urldecode(encodedText) {
  return decodeURIComponent(encodedText);
}


const UrlEncode: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const onSourceTextChange = useCallback((e) => {
    setSourceText(e.target.value);
  }, []);

  const onClickLockBtn = useCallback(() => {
    if (!sourceText) {
      return warning("请输入源文本内容");
    }
    setResult(urlencode(sourceText));
  }, [sourceText]);

  const onClickUnlockBtn = useCallback(() => {
    if (!sourceText) {
      return warning("请输入源文本内容");
    }
    let ret = '';
    try {
      ret = urldecode(sourceText);
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
      <h1>Url 编解码介绍</h1>
      <div className="content">
      URL 编码和解码是在 Web 开发中常见的操作，用于处理 URL 中的特殊字符以及非 ASCII 字符。这些特殊字符包括保留字符（如冒号、正斜杠、问号等），以及不安全字符（如空格、标点符号等）。在 URL 中，这些字符可能会引起歧义或错误解释，因此需要进行编码以确保 URL 的正确性和可靠性。
      </div>
      <h2>URL 编码：</h2>
      <div className="content">
      URL 编码是将 URL 中的特殊字符转换为其相应的十六进制 ASCII 值，并在每个字符前加上 % 符号。URL 编码可以通过 JavaScript 中的 encodeURIComponent() 函数来实现。
      </div>
      <div className="content">例如，空格在 URL 中是 %20，问号是 %3F，等等。</div>
      <h2>URL 解码：</h2>
      <div className="content">
      URL 解码是对 URL 编码后的字符串进行解析，将其中的特殊字符转换回原始字符。URL 解码可以通过 JavaScript 中的 decodeURIComponent() 函数来实现。</div>
      <div className="content">例如，%20 解码后是空格，%3F 解码后是问号，等等。</div>
      <h2>编码和解码的重要性：</h2>
      <div className="content">
        <ul>
          <li>数据传输安全性： 在数据传输过程中，如果 URL 中的特殊字符没有被正确编码，可能导致 URL 解析错误，甚至引发安全漏洞。</li>
          <li>避免歧义和错误解释： 在 URL 中包含特殊字符，可能导致服务器端或客户端解析错误，影响系统的正常运行。</li>
          <li>兼容性： 对 URL 中的特殊字符进行编码可以确保其在各种不同的系统和环境下都能正确解析。</li>
        </ul>
      </div>
    </div>
  </div>;
};

export default UrlEncode;

import './index.less';

import {Empty, Input} from 'antd';
import React, {useCallback, useRef, useState} from "react";
import {error, success} from 'src/utils/message';
import {copyText} from 'src/utils/util';

const Textarea = Input.TextArea;

const Delete = () => {
  return <svg viewBox="0 0 1265 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5100" width="16" height="16"><path d="M1043.456 822.272H423.424c-13.312 0-17.92-4.096-31.744-15.872l-0.512-0.512-294.4-266.24c-6.656-6.144-10.24-14.848-10.24-23.552 0-9.216 3.584-17.92 10.24-23.552l293.376-263.68c13.824-15.872 26.112-16.896 35.84-16.896h616.96c16.896 0 30.72 13.824 30.72 30.72v549.376c0.512 16.384-13.312 30.208-30.208 30.208zM424.96 782.848h610.304v-532.48H423.936c-0.512 0-2.048 1.024-4.608 4.096l-1.024 1.024-289.28 260.096 288.256 260.608c3.072 2.56 5.632 5.12 7.68 6.656z m401.92-179.712L740.352 517.12l86.528-87.04c8.192-8.192 8.192-20.992 0-29.184-8.192-8.192-20.992-8.192-29.184 0l-86.528 86.528L624.64 401.92c-8.192-8.192-20.992-8.192-29.184 0-8.192 8.192-8.192 20.992 0 29.184l86.016 86.016-86.016 86.528c-8.192 8.192-8.192 20.992 0 29.184 8.192 8.192 20.992 8.192 29.184 0l86.016-86.016 86.528 86.528c8.192 8.192 20.992 8.192 29.184 0 8.704-9.216 8.704-22.016 0.512-30.208z" p-id="5101"></path></svg>;
};


const generateSynth = () => {
  return window.speechSynthesis;
};

const generateUtterance = (content: string) => {
  // 创建一个新的语音合成对象
  const utterance = new SpeechSynthesisUtterance(content);

  // 语音合成对象设置语言和声音
  utterance.lang = 'zh-CN';
  utterance.voice = generateSynth().getVoices().find(voice => voice.lang === 'zh-CN');
  return utterance;
};

const speak = (content: string) => {
  generateSynth().speak(generateUtterance(content));
};

function insertTextAtCursor(textarea, newText) {
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;

  // 在光标位置插入新文本
  textarea.value = textarea.value.substring(0, startPos) + newText + textarea.value.substring(endPos, textarea.value.length);

  // 移动光标位置到新插入文本的末尾
  textarea.selectionStart = startPos + newText.length;
  textarea.selectionEnd = startPos + newText.length;

  // 触发 input 或 change 事件，以便更新 textarea 的值
  const event = new Event('input', {bubbles: true});
  textarea.dispatchEvent(event);
}

class CalcStorage {
  key = 'CALC_TOOL_HISTORY';

  add(content: string, result: string) {
    let data: any = localStorage.getItem(this.key);
    if (!data) {
      localStorage.setItem(this.key, JSON.stringify([{
        content,
        result
      }]));
      return;
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = [];
    }

    data.unshift({
      content,
      result
    });

    if (data.length > 20) {
      data.slice(20);
    }

    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get() {
    let data: any = localStorage.getItem(this.key);
    if (!data) {
      return [];
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = [];
    }
    return data;
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

const calcStorage = new CalcStorage();

const speakMap = {
  '/': "除",
  '*': '乘',
  '-': '减',
  '+': '加',
  '=': '等于',
  '(': '括号',
  ')': '括号',
  '%': "百分号"
};

const Calculator: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState(calcStorage.get());

  const onClickKeyCode = useCallback((e) => {
    const keyCode = e.target.dataset.keycode;
    if (keyCode === '=') {
      try {
        const ret = eval(content);
        setResult(ret);
        calcStorage.add(content, ret);
        setHistory(calcStorage.get());
      } catch(e) {
        return error("计算错误，请检查输入内容");
      }
    }
  }, [content]);

  const onClickHistoryItem = useCallback(({content, result}) => {
    setContent(content);
    setResult(result);
  }, []);

  const onPressEnter = useCallback((e) => {
    e.preventDefault();
    try {
      const ret = eval(content);
      setResult(ret);
      calcStorage.add(content, ret);
      setHistory(calcStorage.get());
    } catch(e) {
      return error("计算错误，请检查输入内容");
    }
  }, [content]);

  const onClickClearBtn = useCallback(() => {
    calcStorage.clear();
    setHistory([]);
  }, []);

  const onClickResult = useCallback(() => {
    if (!result) {
      return;
    }
    copyText(result);
    success("复制成功");
  }, [result]);


  return <div className="calculator-tool-container">
    <div className="tool-operation-container">
      <div className="calc-container">
        <Textarea className="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} onPressEnter={onPressEnter}></Textarea>
        <div className="operation-containter">
          {/* <div className="voice-container">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9061" width="24" height="24"><path d="M539.733333 580.266667h-29.866666c-76.8 0-140.8-64-140.8-140.8V213.333333c0-76.8 64-140.8 140.8-140.8h29.866666c76.8 0 140.8 64 140.8 140.8v226.133334c0 76.8-64 140.8-140.8 140.8z" fill="#24AA7D" p-id="9062"></path><path d="M539.733333 601.6h-29.866666c-89.6 0-162.133333-72.533333-162.133334-162.133333V213.333333c0-89.6 72.533333-162.133333 162.133334-162.133333h29.866666c89.6 0 162.133333 72.533333 162.133334 162.133333v226.133334c0 89.6-72.533333 162.133333-162.133334 162.133333zM509.866667 96c-66.133333 0-119.466667 53.333333-119.466667 119.466667v226.133333c0 66.133333 53.333333 119.466667 119.466667 119.466667h29.866666c66.133333 0 119.466667-53.333333 119.466667-119.466667V213.333333c0-66.133333-53.333333-119.466667-119.466667-119.466666h-29.866666z" fill="#24AA7D" p-id="9063"></path><path d="M680.533333 256h-78.933333c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333334h78.933333c12.8 0 21.333333 8.533333 21.333334 21.333334s-8.533333 21.333333-21.333334 21.333333zM445.866667 256h-78.933334c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333334h78.933334c12.8 0 21.333333 8.533333 21.333333 21.333334s-8.533333 21.333333-21.333333 21.333333zM680.533333 347.733333h-78.933333c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333333h78.933333c12.8 0 21.333333 8.533333 21.333334 21.333333s-8.533333 21.333333-21.333334 21.333333zM445.866667 347.733333h-78.933334c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333333h78.933334c12.8 0 21.333333 8.533333 21.333333 21.333333s-8.533333 21.333333-21.333333 21.333333zM680.533333 439.466667h-78.933333c-12.8 0-21.333333-8.533333-21.333333-21.333334s8.533333-21.333333 21.333333-21.333333h78.933333c12.8 0 21.333333 8.533333 21.333334 21.333333s-8.533333 21.333333-21.333334 21.333334zM445.866667 439.466667h-78.933334c-12.8 0-21.333333-8.533333-21.333333-21.333334s8.533333-21.333333 21.333333-21.333333h78.933334c12.8 0 21.333333 8.533333 21.333333 21.333333s-8.533333 21.333333-21.333333 21.333334z" fill="#FCFCFC" p-id="9064"></path><path d="M473.6 878.933333c-12.8 0-21.333333-8.533333-21.333333-21.333333v-162.133333c0-12.8 8.533333-21.333333 21.333333-21.333334s21.333333 8.533333 21.333333 21.333334v162.133333c0 10.666667-10.666667 21.333333-21.333333 21.333333zM576 878.933333c-12.8 0-21.333333-8.533333-21.333333-21.333333v-162.133333c0-12.8 8.533333-21.333333 21.333333-21.333334s21.333333 8.533333 21.333333 21.333334v162.133333c0 10.666667-8.533333 21.333333-21.333333 21.333333z" fill="#24AA7D" p-id="9065"></path><path d="M576 859.733333c76.8 8.533333 142.933333 34.133333 185.6 70.4 29.866667 25.6-505.6 27.733333-475.733333 0 42.666667-36.266667 108.8-61.866667 185.6-70.4" fill="#24AA7D" p-id="9066"></path><path d="M516.266667 970.666667c-238.933333 0-245.333333-17.066667-251.733334-29.866667-4.266667-8.533333 0-19.2 6.4-25.6 46.933333-40.533333 117.333333-68.266667 198.4-76.8l4.266667 42.666667c-53.333333 6.4-102.4 21.333333-140.8 42.666666 87.466667 8.533333 292.266667 8.533333 379.733333 0-38.4-21.333333-87.466667-36.266667-138.666666-42.666666l4.266666-42.666667c81.066667 8.533333 149.333333 36.266667 196.266667 74.666667 8.533333 6.4 10.666667 17.066667 6.4 25.6-4.266667 14.933333-10.666667 29.866667-253.866667 32h-10.666666z" fill="#24AA7D" p-id="9067"></path><path d="M524.8 712.533333c-168.533333 0-307.2-123.733333-307.2-275.2v-87.466666c0-12.8 8.533333-21.333333 21.333333-21.333334s21.333333 8.533333 21.333334 21.333334v87.466666c0 128 119.466667 232.533333 264.533333 232.533334S789.333333 565.333333 789.333333 437.333333v-87.466666c0-12.8 8.533333-21.333333 21.333334-21.333334s21.333333 8.533333 21.333333 21.333334v87.466666c0 151.466667-138.666667 275.2-307.2 275.2z" fill="#24AA7D" p-id="9068"></path><path d="M473.6 695.466667h104.533333v183.466666h-104.533333z" fill="#24AA7D" p-id="9069"></path><path d="M586.666667 889.6h-125.866667v-204.8h125.866667v204.8z m-102.4-21.333333h83.2v-162.133334h-83.2v162.133334z" fill="#24AA7D" p-id="9070"></path></svg>
            <svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12659" width="22" height="22"><path d="M211.2 32l567.466667 981.333333c4.266667 6.4 10.666667 10.666667 19.2 10.666667 17.066667 0 25.6-17.066667 19.2-32L249.6 10.666667c-6.4-6.4-12.8-10.666667-21.333333-10.666667-17.066667 0-25.6 17.066667-17.066667 32zM746.666667 512V234.666667c0-130.133333-104.533333-234.666667-234.666667-234.666667-70.4 0-132.266667 29.866667-174.933333 78.933333l343.466666 595.2C721.066667 633.6 746.666667 576 746.666667 512zM512 746.666667c19.2 0 38.4-2.133333 57.6-6.4L277.333333 234.666667v277.333333c0 130.133333 104.533333 234.666667 234.666667 234.666667zM810.666667 405.333333c-12.8 0-21.333333 8.533333-21.333334 21.333334v85.333333c0 78.933333-34.133333 151.466667-87.466666 200.533333l21.333333 36.266667c66.133333-61.866667 108.8-149.333333 108.8-247.466667V426.666667c0-12.8-8.533333-21.333333-21.333333-21.333334z" fill="#666767" p-id="12660"></path><path d="M682.666667 981.333333h-149.333334v-149.333333c27.733333-2.133333 53.333333-8.533333 78.933334-17.066667l-21.333334-36.266666c-29.866667 8.533333-59.733333 12.8-93.866666 10.666666-149.333333-6.4-262.4-136.533333-262.4-285.866666V426.666667c0-12.8-8.533333-21.333333-21.333334-21.333334s-21.333333 8.533333-21.333333 21.333334v85.333333c0 168.533333 132.266667 307.2 298.666667 320v149.333333h-149.333334c-12.8 0-21.333333 8.533333-21.333333 21.333334s8.533333 21.333333 21.333333 21.333333h341.333334c12.8 0 21.333333-8.533333 21.333333-21.333333s-8.533333-21.333333-21.333333-21.333334z" fill="#666767" p-id="12661"></path></svg>
          </div> */}
          <div className="result" onClick={onClickResult}>
            {result}
          </div>
        </div>
        <div className="keyCode-container">
          <div className="keyCode-col">
            <div className="keyCode-row">
              <div className="keyCode" data-keycode="(" onClick={onClickKeyCode}>{"("}</div>
            </div>
            <div className="keyCode-row">
              <div className="keyCode" data-keycode=")" onClick={onClickKeyCode}>{")"}</div>
            </div>
            <div className="keyCode-row">
              <div className="keyCode" data-keycode="%" onClick={onClickKeyCode}>%</div>
            </div>
            <div className="keyCode-row">
              <div className="keyCode" data-keycode="delete" onClick={onClickKeyCode}><Delete></Delete></div>
            </div>
          </div>
          <div className="keyCode-col">
            <div className="keyCode-row">
              <div className="keyCode" data-keycode="7" onClick={onClickKeyCode}>7</div>
              <div className="keyCode" data-keycode="8" onClick={onClickKeyCode}>8</div>
              <div className="keyCode" data-keycode="9" onClick={onClickKeyCode}>9</div>
              <div className="keyCode" data-keycode="/" onClick={onClickKeyCode}>/</div>
            </div>

            <div className="keyCode-row">
              <div className="keyCode" data-keycode="4" onClick={onClickKeyCode}>4</div>
              <div className="keyCode" data-keycode="5" onClick={onClickKeyCode}>5</div>
              <div className="keyCode" data-keycode="6" onClick={onClickKeyCode}>6</div>
              <div className="keyCode" data-keycode="*" onClick={onClickKeyCode}>*</div>
            </div>

            <div className="keyCode-row">
              <div className="keyCode" data-keycode="1" onClick={onClickKeyCode}>1</div>
              <div className="keyCode" data-keycode="2" onClick={onClickKeyCode}>2</div>
              <div className="keyCode" data-keycode="3" onClick={onClickKeyCode}>3</div>
              <div className="keyCode" data-keycode="-" onClick={onClickKeyCode}>-</div>
            </div>

            <div className="keyCode-row">
              <div className="keyCode" data-keycode="0" onClick={onClickKeyCode}>0</div>
              <div className="keyCode" data-keycode="." onClick={onClickKeyCode}>.</div>
              <div className="keyCode equal-keyCode" data-keycode="=" onClick={onClickKeyCode}>=</div>
              <div className="keyCode" data-keycode="+" onClick={onClickKeyCode}>+</div>
            </div>
          </div>
        </div>
      </div>

      <div className="history-container">
        <div className="header">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6148" width="16" height="16"><path d="M512 68.266667C266.922667 68.266667 68.266667 266.922667 68.266667 512s198.656 443.733333 443.733333 443.733333 443.733333-198.656 443.733333-443.733333S757.077333 68.266667 512 68.266667z m0 68.266666c207.36 0 375.466667 168.106667 375.466667 375.466667s-168.106667 375.466667-375.466667 375.466667S136.533333 719.36 136.533333 512 304.64 136.533333 512 136.533333z" fill="#444444" p-id="6149"></path><path d="M546.133333 307.2v206.5408l142.148267 126.344533-45.3632 51.029334L477.866667 544.392533V307.2z" fill="#00B386" p-id="6150"></path></svg>
          <div className="title">操作历史</div>
          <div className="clear-btn" onClick={onClickClearBtn}>清空</div>
        </div>
        {
          history.length ?  <div className="history-items">
            {
              history.map((item, index) => (<div className="history-item" key={index} onClick={() => onClickHistoryItem(item)}>
                <div className="content">{item.content}</div>
                <div className="result">= {item.result}</div>
              </div>))
            }
          </div> : <Empty description={false} className="empty-container" />
        }

      </div>
    </div>
  </div>;
};

export default Calculator;

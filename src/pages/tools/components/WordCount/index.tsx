import {Button, Col, Input, Row} from "antd";
import React, {useCallback, useState} from "react";
import {warning} from "src/utils/message";

const TextArea = Input.TextArea;

interface Metrics {
  /** 文本长度 */
  textLength: number;
  /** 总字数 */
  totalWords: number;
  /** 总字符数（中文字数 + 英文字母数） */
  totalCharacters: number;
  /** 中文字数 */
  chineseCharacters: number;
  /** 英文单词数 */
  englishWords: number;
  /** 英文字母数 */
  englishLetters: number;
  /** 标点符号数 */
  punctuation: number;
  /** 数字数量 */
  numbers: number;
  /** 空格数 */
  spaces: number;
}

function calculateTextMetrics(text): Metrics {
  const chineseRegExp = /[\u4E00-\u9FA5]/g;
  const englishWordRegExp = /[a-zA-Z]+/g;
  const englishLetterRegExp = /[a-zA-Z]/g;
  // eslint-disable-next-line no-useless-escape
  const punctuationRegExp = /[.,\/#!$%\^&\*;:{}=\-_`~()，。！￥…（）【】；：‘“’”、？《》]/g;
  const numberRegExp = /\d/g;
  const spaceRegExp = /\s/g;

  const chineseCharacters = text.match(chineseRegExp) || [];
  const englishWords = text.match(englishWordRegExp) || [];
  const englishLetters = text.match(englishLetterRegExp) || [];
  const punctuation = text.match(punctuationRegExp) || [];
  const numbers = text.match(numberRegExp) || [];
  const spaces = text.match(spaceRegExp) || [];

  return {
    textLength: text.length,
    totalCharacters: chineseCharacters.length + englishLetters.length,
    totalWords: chineseCharacters.length + englishWords.length,
    chineseCharacters: chineseCharacters.length,
    englishWords: englishWords.length,
    englishLetters: englishLetters.length,
    punctuation: punctuation.length,
    numbers: numbers.length,
    spaces: spaces.length
  };
}

const WordCount: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<Metrics | null>(null);

  const onSourceTextChange = useCallback((e) => {
    setSourceText(e.target.value);
  }, []);

  const onClickSummaryBtn = useCallback(() => {
    if (!sourceText) {
      return warning("请输入源文本");
    }
    setSummaryResult(calculateTextMetrics(sourceText));
  }, [sourceText]);

  return <div>
    <div className="tool-operation-container table-tool-container word-count-tool-operation-container">
      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">源文本：</div>
          <TextArea rows={12} placeholder="请输入源文本内容" value={sourceText} onChange={onSourceTextChange}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">统计结果：</div>
          <div className="table">
            <Row className="row">
              <Col className="cell cell-enhance" span={8}>文本长度</Col>
              <Col className="cell" span={16}>{summaryResult?.textLength || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>总字数（中文字数+英文单词数）</Col>
              <Col className="cell" span={16}>{summaryResult?.totalWords || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>中文字数</Col>
              <Col className="cell" span={16}>{summaryResult?.chineseCharacters || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>英文单词数</Col>
              <Col className="cell" span={16}>{summaryResult?.englishWords || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>英文字母数</Col>
              <Col className="cell" span={16}>{summaryResult?.englishLetters || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>总字符数（中文字数+英文字母数）</Col>
              <Col className="cell" span={16}>{summaryResult?.totalCharacters || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>标点符号数</Col>
              <Col className="cell" span={16}>{summaryResult?.punctuation || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>数字</Col>
              <Col className="cell" span={16}>{summaryResult?.numbers || 0}</Col>
            </Row>

            <Row className="row">
              <Col className="cell cell-enhance" span={8}>空格数</Col>
              <Col className="cell" span={16}>{summaryResult?.spaces || 0}</Col>
            </Row>
          </div>
        </div>
      </div>



      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="operation-btns">
            <Button className="lock-btn" onClick={onClickSummaryBtn}>开始统计</Button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default WordCount;

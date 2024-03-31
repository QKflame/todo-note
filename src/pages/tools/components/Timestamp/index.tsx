import './index.less';

import {FieldTimeOutlined} from '@ant-design/icons';
import {Button, Input, message,Select} from "antd";
import {isString} from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from "react";
const {Option} = Select;

enum TimestampType {
  'MS' = 'ms',
  "SECOND" = 'second'
}

const copyData = (content: string | number) => {
  navigator.clipboard.writeText(content.toString());
  message.success({
    content: '复制成功',
    duration: 1,
    key: messageKey
  });
};

function dateTimeToTimestamps(dateTimeString) {
  // 创建一个Date对象
  const date = new Date(dateTimeString);

  // 获取秒级时间戳和毫秒级时间戳
  const secondsTimestamp = Math.floor(date.getTime() / 1000);
  const millisecondsTimestamp = date.getTime();

  return {secondsTimestamp: secondsTimestamp.toString(), millisecondsTimestamp: millisecondsTimestamp.toString()};
}


function formatBeijingTime(timestamp, type: TimestampType = TimestampType.MS) {
  if (type === TimestampType.SECOND) {
    timestamp = parseInt(timestamp) * 1000;
  }
  timestamp = parseInt(timestamp);
  // 使用毫秒创建一个Date对象
  const date = new Date(timestamp);

  // 转换为北京时间
  date.setHours(date.getHours()); // 北京时间比UTC时间多8小时

  // 构建时间字符串
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 拼接时间字符串
  const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return timeString;
}

function isSecondTimestamp(timestamp) {
  if (isString(timestamp)) {
    timestamp = timestamp.trim();
    timestamp = parseInt(timestamp);
  }
  // 如果时间戳是10位数并且小于等于当前时间戳的一秒后的时间戳，则认为是秒级时间戳
  return timestamp.toString().length === 10 && timestamp <= Math.floor(Date.now() / 1000) + 1;
}

function isMillisecondTimestamp(timestamp) {
  if (isString(timestamp)) {
    timestamp = timestamp.trim();
    timestamp = parseInt(timestamp);
  }
  // 如果时间戳是13位数并且小于等于当前时间戳的一秒后的时间戳乘以1000，则认为是毫秒级时间戳
  return timestamp.toString().length === 13 && timestamp <= (Math.floor(Date.now() / 1000) + 1) * 1000;
}

const isTimestamp = (value) => {
  const timestampRegex = /^[1-9]\d*$/;
  return timestampRegex.test(value.toString()) || /0/.test(value);
};

function isValidDateTimeFormat(dateTimeString) {
  // 尝试解析日期时间字符串
  const date = new Date(dateTimeString);

  // 检查解析结果是否有效
  return !isNaN(date.getTime());
}


const messageKey = 'messageKey';

const Timestamp: React.FC = () => {
  const [sourceTimestamp, setSourceTimestamp] = useState('');
  const [sourceTime, setSourceTime] = useState('');
  const [targetTimestamp, setTargetTimestamp] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [sourceTimestampSelectType, setSourceTimestampSelectType] = useState<TimestampType>(TimestampType.MS);
  const [targetTimestampSelectType, setTargetTimestampSelectType] = useState<TimestampType>(TimestampType.MS);

  useEffect(() => {
    const timestamp = new Date().getTime();
    setSourceTimestamp(timestamp.toString());
    setTargetTime(formatBeijingTime(timestamp));
    setSourceTime(formatBeijingTime(timestamp));
    setTargetTimestamp(dateTimeToTimestamps(formatBeijingTime(timestamp)).millisecondsTimestamp);
  }, []);

  const onClickConvertTimeToTimestampBtn = useCallback((e?: TimestampType) => {
    if (!isValidDateTimeFormat(sourceTime)) {
      message.warning({
        content: '时间格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }

    const type = e || targetTimestampSelectType;

    if (type === 'ms') {
      setTargetTimestamp(dateTimeToTimestamps(sourceTime).millisecondsTimestamp);
      return;
    }
    if (type === 'second') {
      setTargetTimestamp(dateTimeToTimestamps(sourceTime).secondsTimestamp);
    }

  }, [sourceTime, targetTimestampSelectType]);

  const onClickConvertTimestampToTimeBtn = useCallback((e?: TimestampType) => {
    if (!isTimestamp(sourceTimestamp)) {
      message.warning({
        content: '时间戳格式错误',
        duration: 1,
        key: messageKey
      });
      return;
    }
    const type = e || sourceTimestampSelectType;
    setTargetTime(formatBeijingTime(sourceTimestamp, type));
  }, [sourceTimestamp, sourceTimestampSelectType]);

  const onSourceTimestampSelectTypeChange = useCallback((e) => {
    setSourceTimestampSelectType(e);

    if (e === TimestampType.MS && isTimestamp(sourceTimestamp)) {
      setSourceTimestamp((parseInt(sourceTimestamp) * 1000).toString());
      return;
    }

    if (e === TimestampType.SECOND && isTimestamp(sourceTimestamp)) {
      setSourceTimestamp((Math.floor(parseInt(sourceTimestamp) / 1000)).toString());
    }

  }, [sourceTimestamp]);

  const onTargetTimestampSelectTypeChange = useCallback((e) => {
    setTargetTimestampSelectType(e);
    onClickConvertTimeToTimestampBtn(e);
  }, [onClickConvertTimeToTimestampBtn]);

  const sourceSelectTypeAfter = useMemo(() => {
    return (
      <Select value={sourceTimestampSelectType} className="timestamp-select" onChange={onSourceTimestampSelectTypeChange}>
        <Option value="ms">毫秒</Option>
        <Option value="second">秒</Option>
      </Select>
    );
  }, [onSourceTimestampSelectTypeChange, sourceTimestampSelectType]);

  const targetTimestampSelectTypeAfter = useMemo(() => {
    return (
      <Select value={targetTimestampSelectType} className="timestamp-select" onChange={onTargetTimestampSelectTypeChange}>
        <Option value="ms">毫秒</Option>
        <Option value="second">秒</Option>
      </Select>
    );
  }, [onTargetTimestampSelectTypeChange, targetTimestampSelectType]);

  const onSourceTimeStampChange = useCallback((e) => {
    setSourceTimestamp(e.target.value);
  }, []);

  const onSourceTimeChange = useCallback((e) => {
    setSourceTime(e.target.value);
  }, []);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item">
          <div className="label">时间戳：</div>
          <Input addonAfter={sourceSelectTypeAfter} value={sourceTimestamp} onChange={onSourceTimeStampChange} placeholder="请输入时间戳" onPressEnter={() => onClickConvertTimestampToTimeBtn()} />
        </div>
        <Button className="convert-btn" onClick={() => onClickConvertTimestampToTimeBtn()}>转换</Button>
        <div className="converter-item">
          <div className="label"><FieldTimeOutlined /> 北京时间：</div>
          <Input
            value={targetTime}
            onClick={() => copyData(targetTime)}
          />
        </div>
      </div>
      <div className="converter-row">
        <div className="converter-item">
          <div className="label"><FieldTimeOutlined /> 北京时间：</div>
          <Input
            placeholder="请输入北京时间"
            value={sourceTime}
            onChange={onSourceTimeChange}
            onPressEnter={() => onClickConvertTimeToTimestampBtn()}
          />
        </div>
        <Button className="convert-btn" onClick={() => onClickConvertTimeToTimestampBtn()}>转换</Button>
        <div className="converter-item">
          <div className="label">时间戳：</div>
          <Input addonAfter={targetTimestampSelectTypeAfter} value={targetTimestamp} onClick={() => copyData(targetTimestamp)}/>
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>时间戳介绍</h1>
      <div className="content">
      时间戳（timestamp）通常是一个字符序列，唯一地标识某一刻的时间。数字时间戳技术是数字签名技术一种变种的应用，时间戳是使用数字签名技术产生的数据，签名的对象包括了原始文件信息、签名参数、签名时间等信息。
      </div>
      <div className="content">
      时间戳系统用来产生和管理时间戳，对签名对象进行数字签名产生时间戳，以证明原始文件在签名时间之前已经存在。可信时间戳是由联合信任时间戳服务中心签发的一个电子凭证，用于证明电子数据文件自申请可信时间戳后内容保持完整、未被更改。根据《电子签名法》有关数据电文原件形式的要求，申请了可信时间戳认证的电子文件、电子档案或纸质档案的数字化副本等可视为法规规定的原件形式。
      </div>
      <div className="content">
      Unix时间戳定义为从格林威治时间1970年01月01日00时00分00秒（北京时间1970年01月01日08时00分00秒）起至指定时间的秒数，不考虑闰秒。一个小时表示为Unix时间戳格式为：3600秒，一天表示为Unix时间戳为86400秒，闰秒不计算。
      </div>
    </div>
  </div>;
};

export default Timestamp;

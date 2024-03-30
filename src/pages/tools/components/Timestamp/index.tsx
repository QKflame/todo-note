import './index.less';

import {FieldTimeOutlined} from '@ant-design/icons';
import {Button, Input, Select} from "antd";
import React, {useMemo} from "react";
const {Option} = Select;

const Timestamp: React.FC = () => {

  const selectAfter = useMemo(() => {
    return (
      <Select defaultValue="ms" className="timestamp-select">
        <Option value="ms">毫秒</Option>
        <Option value="second">秒</Option>
      </Select>
    );
  }, []);

  return <div>
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item">
          <div className="label">时间戳：</div>
          <Input addonAfter={selectAfter} defaultValue="mysite" />
        </div>
        <Button className="convert-btn">转换</Button>
        <div className="converter-item">
          <div className="label"><FieldTimeOutlined /> 北京时间：</div>
          <Input
          />
        </div>
      </div>
      <div className="converter-row">
        <div className="converter-item">
          <div className="label"><FieldTimeOutlined /> 北京时间：</div>
          <Input
          />
        </div>
        <Button className="convert-btn">转换</Button>
        <div className="converter-item">
          <div className="label">时间戳：</div>
          <Input addonAfter={selectAfter} defaultValue="mysite" />
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>时间戳介绍</h1>
      <div className="content">
      时间戳是指格林威治时间1970年01月01日00时00分00秒（北京时间1970年01月01日08时00分00秒）起至现在的总秒数。时间戳是使用数字签名技术产生的数据，签名的对象包括了原始文件信息、签名参数、签名时间等信息。时间戳系统用来产生和管理时间戳，对签名对象进行数字签名产生时间戳，以证明原始文件在签名时间之前已经存在。
      </div>
      <div className="content">
      可信时间戳是由联合信任时间戳服务中心签发的一个电子凭证，用于证明电子数据文件自申请可信时间戳后内容保持完整、未被更改。可信时间戳接入核准书的颁发，标志着可信时间戳在档案领域规范化应用已经开始，并将起到电子档案和档案数字化副本内容防篡改、保障档案的法律凭证的作用。根据《电子签名法》有关数据电文原件形式的要求，申请了可信时间戳认证的电子文件、电子档案或纸质档案的数字化副本等可视为法规规定的原件形式。
      </div>
    </div>
  </div>;
};

export default Timestamp;

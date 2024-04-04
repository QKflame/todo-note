import {Button, Checkbox,Col, Input,Row, Select} from "antd";
import React, {useCallback, useState} from "react";
const TextArea = Input.TextArea;

const passwordLengthOptions = Array.from({length: 100}).map((_, index) => ({label: index + 1, value: index + 1}));
const passwordCountOptions = Array.from({length: 10}).map((_, index) => ({label: index + 1, value: index +1}));

const defaultPasswordLength = 16;

function generatePasswords(includeLowercase, includeUppercase, includeNumbers, customSpecialChars = '', excludeChars = '', length = defaultPasswordLength, count = 5) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  customSpecialChars = customSpecialChars.replace(/\s/g, '');
  excludeChars = excludeChars.replace(/\s/g, '');
  const allChars = `${includeLowercase ? lowercaseChars : ''}${includeUppercase ? uppercaseChars : ''}${includeNumbers ? numberChars : ''}${customSpecialChars}`;

  // 从所有可能的字符中过滤掉排除字符
  const filteredChars = allChars.split('').filter(char => !excludeChars.includes(char)).join('');

  // 生成指定数量的密码
  const passwords = [];
  for (let i = 0; i < count; i++) {
    let password = '';
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * filteredChars.length);
      password += filteredChars[randomIndex];
    }
    passwords.push(password);
  }

  return passwords;
}

const PasswordGenerator: React.FC = () => {
  const [lowerCaseAz, setLowerCaseAz] = useState<boolean>(true);
  const [upperCaseAz, setUpperCaseAz] = useState<boolean>(true);
  const [numCharacter, setNumCharacter] = useState<boolean>(true);
  const [specialCharacter, setSpecialCharacter] = useState<boolean>(true);
  const [specialCharacterValue, setSpecialCharacterValue] = useState<string>('!@#$%^&*');
  const [excludedCharacter, setExcludedCharacter] = useState<boolean>(true);
  const [excludedCharacterValue, setExcludedCharacterValue] = useState<string>('iIl1o0O');
  const [passwordLength, setPasswordLength] = useState<number>(defaultPasswordLength);
  const [passwordCount, setPasswordCount] = useState<number>(5);
  const [passwords, setPasswords] = useState<string[]>([]);

  const onLowerCaseAzChange = useCallback((e) => {
    setLowerCaseAz(e.target.checked);
  }, []);

  const onUpperCaseAzChange = useCallback((e) => {
    setUpperCaseAz(e.target.checked);
  }, []);

  const onNumCharacterChange = useCallback((e) => {
    setNumCharacter(e.target.checked);
  }, []);

  const onSpecialCharacterChange = useCallback((e) => {
    setSpecialCharacter(e.target.checked);
  }, []);

  const onSpecialCharacterValueChange = useCallback((e) => {
    setSpecialCharacterValue(e.target.value);
  }, []);

  const onExcludedCharacterChange = useCallback((e) => {
    setExcludedCharacter(e.target.checked);
  }, []);

  const onExcludedCharacterValueChange = useCallback((e) => {
    setExcludedCharacterValue(e.target.value);
  }, []);

  const onPasswordLengthChange = useCallback((e) => {
    setPasswordLength(e);
  }, []);

  const onPasswordCountChange = useCallback((e) => {
    setPasswordCount(e);
  }, []);

  const onClickGeneratePasswordBtn = useCallback(() => {
    const result = generatePasswords(lowerCaseAz, upperCaseAz, numCharacter, specialCharacter ? specialCharacterValue : '', excludedCharacter ? excludedCharacterValue : '', passwordLength, passwordCount);
    setPasswords(result);
  }, [excludedCharacter, excludedCharacterValue, lowerCaseAz, numCharacter, passwordCount, passwordLength, specialCharacter, specialCharacterValue, upperCaseAz]);

  return <div>
    <div className="tool-operation-container table-tool-container">
      <div className="table">
        <Row className="row">
          <Col className="cell cell-enhance" span={6}>包含字符</Col>
          <Col className="cell" span={18}>
            <div className="form-items">
              <div className="form-item">
                <Checkbox onChange={onLowerCaseAzChange} checked={lowerCaseAz}></Checkbox>
                <div className="label">a-z</div>
              </div>
              <div className="form-item">
                <Checkbox onChange={onUpperCaseAzChange} checked={upperCaseAz}></Checkbox>
                <div className="label">A-Z</div>
              </div>
              <div className="form-item">
                <Checkbox onChange={onNumCharacterChange} checked={numCharacter}></Checkbox>
                <div className="label">0-9</div>
              </div>
              <div className="form-item">
                <Checkbox onChange={onSpecialCharacterChange} checked={specialCharacter}></Checkbox>
                <Input className="input" value={specialCharacterValue} onChange={onSpecialCharacterValueChange} disabled={!specialCharacter}></Input>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="row">
          <Col className="cell cell-enhance" span={6}>排除字符</Col>
          <Col className="cell" span={18}>
            <div className="form-items">
              <div className="form-item">
                <Checkbox onChange={onExcludedCharacterChange} checked={excludedCharacter}></Checkbox>
                <Input className="input" value={excludedCharacterValue} onChange={onExcludedCharacterValueChange} disabled={!excludedCharacter}></Input>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="row">
          <Col className="cell cell-enhance" span={6}>密码长度</Col>
          <Col className="cell" span={6}>
            <div className="form-items">
              <div className="form-item">
                <Select options={passwordLengthOptions} value={passwordLength} onChange={onPasswordLengthChange} style={{
                  width: '80px'
                }}></Select>
                <div className="label">位</div>
              </div>
            </div>
          </Col>
          <Col className="cell cell-enhance" span={6}>生成数量</Col>
          <Col className="cell" span={6}>
            <div className="form-items">
              <div className="form-item">
                <Select options={passwordCountOptions} value={passwordCount} onChange={onPasswordCountChange} style={{
                  width: '80px'
                }}></Select>
                <div className="label">个</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {
        passwords?.length ? <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">生成结果：</div>
            <TextArea rows={passwords.length} value={passwords.join('\n')} spellCheck={false}></TextArea>
          </div>
        </div> : null
      }


      <div className="converter-row">
        <div className="converter-item full-convert-item">
          {/* <div className="label">操作：</div> */}
          <div className="operation-btns">
            <Button className="lock-btn" onClick={onClickGeneratePasswordBtn}>生成密码</Button>
          </div>
        </div>
      </div>
    </div>

    <div className="tool-description-container">
      <h1>密码生成器介绍</h1>
      <div className="content">
      随机密码生成器是一种用于生成随机且安全的密码的工具。在网络安全领域中，密码是保护个人和组织数据安全的重要措施之一。为了防止密码被猜测或者破解，密码应该是随机的、复杂的，并且不易被推测出来。
      </div>
      <div className="content">
      随机密码生成器通过使用随机数生成算法，结合用户的要求，生成具有一定长度和特定字符组合的密码。这些要求可能包括是否包含小写字母、大写字母、数字、特殊字符等。用户还可以定义密码的长度以及要排除的字符，以确保生成的密码满足其安全性和使用要求。
      </div>
      <div className="content">
      生成的随机密码通常具有足够的复杂性，使其难以被猜测或者破解。因此，随机密码生成器在用户注册、登录、重置密码等场景中被广泛应用，帮助用户创建更加安全的密码，提高账户和数据的安全性。同时，它也为用户减轻了记忆密码的负担，因为用户可以使用生成器生成安全的随机密码，而不必依赖于容易被猜测或者记忆的密码。
      </div>
    </div>
  </div>;
};

export default PasswordGenerator;

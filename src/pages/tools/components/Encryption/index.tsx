import './index.less';

import {LockOutlined, UnlockOutlined} from '@ant-design/icons';
import {Button, Input,Radio} from 'antd';
import React, {useCallback, useState} from "react";

const {TextArea} = Input;

enum EncryptionAlgorithm {
  AES = 'AES',
  DES = 'DES',
  RC4 = 'RC4',
  Rabbit = 'Rabbit',
  TripleDes = 'TripleDes'
}

import CryptoJS  from "crypto-js";
import {warning} from 'src/utils/message';

// AES 加密方法
function encryptAES(text, key, iv) {
  // 将 key 和 iv 转换为 WordArray 对象
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv);

  // 进行 AES 加密
  const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回加密后的密文
  return encrypted.toString();
}

// AES 解密方法
function decryptAES(ciphertext, key, iv) {
  // 将 key 和 iv 转换为 WordArray 对象
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv);

  // 进行 AES 解密
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // 将解密后的结果转换为 UTF-8 字符串
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// TripleDES 加密方法
function encryptDES(text, key) {
  // 将 key 转换为 WordArray 对象
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);

  // 进行 TripleDES 加密
  const encrypted = CryptoJS.TripleDES.encrypt(text, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回加密后的密文
  return encrypted.toString();
}

// TripleDES 解密方法
function decryptDES(ciphertext, key) {
  // 将 key 转换为 WordArray 对象
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);

  // 进行 TripleDES 解密
  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  // 返回解密后的明文
  return decrypted.toString(CryptoJS.enc.Utf8);
}

const encryptionAlgorithmList = [EncryptionAlgorithm.AES, EncryptionAlgorithm.DES, EncryptionAlgorithm.RC4, EncryptionAlgorithm.Rabbit, EncryptionAlgorithm.TripleDes];

const Encryption: React.FC = () => {
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState<EncryptionAlgorithm>(encryptionAlgorithmList[0]);

  const [plaintext, setPlaintext] = useState<string>('');
  const [ciphertext, setCiphertext] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [iv, setIv] = useState<string>('');

  const onEncryptionAlgorithmChange = useCallback((e) => {
    setEncryptionAlgorithm(e.target.value);
  }, []);

  const onClickLockBtn = useCallback(() => {
    if (!plaintext) {
      return warning('请输入明文内容');
    }
    if (encryptionAlgorithm === EncryptionAlgorithm.AES) {
      setCiphertext(encryptAES(plaintext, password, iv));
    } else if (encryptionAlgorithm === EncryptionAlgorithm.DES) {
      if (!password || !([64, 128, 192].includes(password.length) || password.length > 192)) {
        return warning('密钥长度错误，请输入64、128、192或大于192位的密钥');
      }
      setCiphertext(encryptDES(plaintext, password));
    }
  }, [encryptionAlgorithm, iv, password, plaintext]);

  const onClickUnlockBtn = useCallback(() => {
    if (!ciphertext) {
      return warning('请输入密文内容');
    }
    if (encryptionAlgorithm === EncryptionAlgorithm.AES) {
      let result = null;
      try {
        result = decryptAES(ciphertext, password, iv);
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      if (!result) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      setPlaintext(result);
    } else if (encryptionAlgorithm === EncryptionAlgorithm.DES) {
      let result = null;
      try {
        result = decryptDES(ciphertext, password);
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      if (!result) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      setPlaintext(result);
    }
  }, [ciphertext, encryptionAlgorithm, iv, password]);

  const onPlainTextChange = useCallback((e) => {
    setPlaintext(e.target.value);
  }, []);

  const onCipherTextChange = useCallback((e) => {
    setCiphertext(e.target.value);
  }, []);

  const onPasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onIvChange = useCallback((e) => {
    setIv(e.target.value);
  }, []);

  return <div className="encryption-tool-container">
    <div className="tool-operation-container">
      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">明文：</div>
          <TextArea rows={4} placeholder="请输入明文内容" value={plaintext} onChange={onPlainTextChange}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">密文：</div>
          <TextArea rows={4} placeholder="请输入密文内容" value={ciphertext} onChange={onCipherTextChange}/>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">算法：</div>
          <Radio.Group onChange={onEncryptionAlgorithmChange} value={encryptionAlgorithm}>
            {
              encryptionAlgorithmList.map(item => <Radio key={item} value={item}>{item}</Radio>)
            }
          </Radio.Group>
        </div>
      </div>

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">密钥：</div>
          <Input placeholder="请输入加密密钥（非必填）" value={password} onChange={onPasswordChange}  />
        </div>
      </div>

      {
        [EncryptionAlgorithm.AES].includes(encryptionAlgorithm) ? <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">初始向量：</div>
            <Input placeholder="请输入初始向量（非必填）" value={iv} onChange={onIvChange}  />
          </div>
        </div> : null
      }

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          {/* <div className="label">操作：</div> */}
          <div className="operation-btns">
            <Button onClick={onClickLockBtn} className="lock-btn">加密</Button>
            <Button onClick={onClickUnlockBtn} className="unlock-btn">解密</Button>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Encryption;

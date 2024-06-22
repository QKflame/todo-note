import './index.less';

import {Button, Input,Radio, Tabs, TabsProps, Tooltip} from 'antd';
import React, {useCallback, useMemo, useState} from "react";

const {TextArea} = Input;

enum EncryptionAlgorithm {
  AES = 'AES',
  DES = 'DES',
  RC4 = 'RC4',
  Rabbit = 'Rabbit',
  TripleDes = 'TripleDes',
  MD5 = "MD5",
  SHA256 = 'SHA256',
  SHA512 = 'SHA512'
}

import CryptoJS  from "crypto-js";
import {warning} from 'src/utils/message';

// 确保密钥长度为 32 字节（256 位）
function ensureKeyLength(key, length) {
  if (key.length < length) {
    return key.padEnd(length, '0'); // 用'0'填充
  }
  if (key.length > length) {
    return key.substring(0, length); // 截断多余部分
  }
  return key;
}



// AES 加密函数
function encryptAES(plainText, secretKey) {
  secretKey = ensureKeyLength(secretKey, 32);
  const iv = CryptoJS.lib.WordArray.random(16); // 生成随机 IV
  const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    ciphertext: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex)
  };
}

// AES 解密函数
function decryptAES(encryptedText, secretKey) {
  secretKey = ensureKeyLength(secretKey, 32);
  const parts = encryptedText.split(':');
  const iv = CryptoJS.enc.Hex.parse(parts.shift());
  const encrypted = parts.join(':');
  const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// DES 加密函数
function encryptDES(plainText, secretKey) {
  const encrypted = CryptoJS.DES.encrypt(plainText, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encrypted;
}

// DES 解密函数
function decryptDES(encryptedText, secretKey) {
  const decrypted = CryptoJS.DES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function hashMD5(plainText) {
  return CryptoJS.MD5(plainText).toString(CryptoJS.enc.Hex);
}

// RC4 加密函数
function encryptRC4(plainText, secretKey) {
  const encrypted = CryptoJS.RC4.encrypt(plainText, secretKey);
  return encrypted.toString();
}

// RC4 解密函数
function decryptRC4(encryptedText, secretKey) {
  const decrypted = CryptoJS.RC4.decrypt(encryptedText, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Rabbit 加密函数
function encryptRabbit(plainText, secretKey) {
  const encrypted = CryptoJS.Rabbit.encrypt(plainText, secretKey);
  return encrypted.toString();
}

// Rabbit 解密函数
function decryptRabbit(encryptedText, secretKey) {
  const decrypted = CryptoJS.Rabbit.decrypt(encryptedText, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Triple DES 加密函数
function encryptTripleDES(plainText, secretKey) {
  const encrypted = CryptoJS.TripleDES.encrypt(plainText, secretKey);
  return encrypted.toString();
}

// Triple DES 解密函数
function decryptTripleDES(encryptedText, secretKey) {
  const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// SHA-256 哈希函数
function hashSHA256(plainText) {
  return CryptoJS.SHA256(plainText).toString(CryptoJS.enc.Hex);
}

// SHA-512 哈希函数
function hashSHA512(plainText) {
  return CryptoJS.SHA512(plainText).toString(CryptoJS.enc.Hex);
}

const encryptionAlgorithmList = [EncryptionAlgorithm.AES, EncryptionAlgorithm.DES, EncryptionAlgorithm.RC4, EncryptionAlgorithm.Rabbit, EncryptionAlgorithm.TripleDes, EncryptionAlgorithm.SHA256, EncryptionAlgorithm.SHA512, EncryptionAlgorithm.MD5];

export enum EncryptionToolMode {
  Encryption = 'encryption',
  Decryption = 'decryption'
}

export interface EncryptionToolProps {
  mode: EncryptionToolMode;
}

export function EncryptionTool(props: EncryptionToolProps) {
  const {mode} = props;

  /** 是否为加密模式 */
  const isEncryptionMode = mode === EncryptionToolMode.Encryption;
  /** 是否为解密模式 */
  const isDecryptionMode = mode === EncryptionToolMode.Decryption;

  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState<EncryptionAlgorithm>(encryptionAlgorithmList[0]);

  /** 加密结果 */
  const [encryptionResult, setEncryptionResult] = useState<string>('');
  /** 解密结果 */
  const [decryptionResult, setDecryptionResult] = useState<string>('');

  /** AES 初始向量 */
  const [aesIv, setAesIv] = useState<string>('');


  const [plaintext, setPlaintext] = useState<string>('');
  const [ciphertext, setCiphertext] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [iv, setIv] = useState<string>('');

  const onEncryptionAlgorithmChange = useCallback((e) => {
    setEncryptionResult('');
    setDecryptionResult('');
    setEncryptionAlgorithm(e.target.value);
  }, []);

  const onClickLockBtn = useCallback(() => {
    if (!plaintext) {
      return warning('请输入明文内容');
    }
    switch (encryptionAlgorithm) {
    case EncryptionAlgorithm.AES: {
      const {ciphertext, iv} =encryptAES(plaintext, password);
      setEncryptionResult(ciphertext);
      setAesIv(iv);
      break;
    }
    case EncryptionAlgorithm.DES: {
      setEncryptionResult(encryptDES(plaintext, password));
      break;
    }
    case EncryptionAlgorithm.MD5: {
      setEncryptionResult(hashMD5(plaintext));
      break;
    }
    case EncryptionAlgorithm.RC4: {
      setEncryptionResult(encryptRC4(plaintext, password));
      break;
    }
    case EncryptionAlgorithm.Rabbit: {
      setEncryptionResult(encryptRabbit(plaintext, password));
      break;
    }
    case EncryptionAlgorithm.TripleDes: {
      setEncryptionResult(encryptTripleDES(plaintext, password));
      break;
    }
    case EncryptionAlgorithm.SHA256: {
      setEncryptionResult(hashSHA256(plaintext));
      break;
    }
    case EncryptionAlgorithm.SHA512: {
      setEncryptionResult(hashSHA512(plaintext));
      break;
    }
    default: {
      break;
    }
    }
  }, [encryptionAlgorithm, password, plaintext]);

  const onClickUnlockBtn = useCallback(() => {
    if (!ciphertext) {
      return warning('请输入密文内容');
    }
    switch (encryptionAlgorithm) {
    case EncryptionAlgorithm.AES: {
      let result = null;
      try {
        result = decryptAES(`${iv}:${ciphertext}`, password);
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      if (!result) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      setDecryptionResult(result);
      break;
    }
    case EncryptionAlgorithm.DES: {
      let result = null;
      try {
        result = decryptDES(ciphertext, password);
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      if (!result) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      setDecryptionResult(result);
      break;
    }
    case EncryptionAlgorithm.RC4: {
      try {
        setDecryptionResult(decryptRC4(ciphertext, password));
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      break;
    }
    case EncryptionAlgorithm.Rabbit: {
      try {
        setDecryptionResult(decryptRabbit(ciphertext, password));
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      break;
    }
    case EncryptionAlgorithm.TripleDes: {
      try {
        setDecryptionResult(decryptTripleDES(ciphertext, password));
      } catch (e) {
        return warning("解密错误，请检查密钥或初始向量");
      }
      break;
    }
    default: {
      break;
    }
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

  const secretKeyPlaceholder = useMemo(() => {
    if (encryptionAlgorithm === EncryptionAlgorithm.AES) {
      return "请输入加密密钥，密钥长度为 32字节（256位），当密钥长度不符时，自动进行填充或截断";
    }
    return "请输入加密密钥";
  }, [encryptionAlgorithm]);

  const isSecretKeyHidden = useMemo(() => {
    return [EncryptionAlgorithm.MD5, EncryptionAlgorithm.SHA256, EncryptionAlgorithm.SHA512].includes(encryptionAlgorithm);
  }, [encryptionAlgorithm]);

  return <>
    <div className="tool-operation-container">
      {
        isEncryptionMode && <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">明文：</div>
            <TextArea rows={4} placeholder="请输入明文内容" value={plaintext} onChange={onPlainTextChange} spellCheck={false}/>
          </div>
        </div>
      }

      {
        isDecryptionMode && <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">密文：</div>
            <TextArea rows={4} placeholder="请输入密文内容" value={ciphertext} onChange={onCipherTextChange} spellCheck={false}/>
          </div>
        </div>
      }


      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="label">算法：</div>
          <Radio.Group onChange={onEncryptionAlgorithmChange} value={encryptionAlgorithm}>
            {
              encryptionAlgorithmList.map(item => <Tooltip key={item} title={item === EncryptionAlgorithm.MD5 && isDecryptionMode ? "MD5仅支持加密，无法反向解密" : item === EncryptionAlgorithm.SHA256 ? 'SHA256仅支持加密，无法反向解密' : item === EncryptionAlgorithm.SHA512 ? 'SHA512仅支持加密，无法反向解密'  : undefined}>
                <Radio key={item} value={item} disabled={[EncryptionAlgorithm.MD5, EncryptionAlgorithm.SHA256, EncryptionAlgorithm.SHA512].includes(item) && isDecryptionMode}>{item}</Radio>
              </Tooltip>)
            }
          </Radio.Group>
        </div>
      </div>

      {
        isSecretKeyHidden ? null :   <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">密钥：</div>
            <Input placeholder={secretKeyPlaceholder} value={password} onChange={onPasswordChange}  />
          </div>
        </div>
      }

      {
        [EncryptionAlgorithm.AES].includes(encryptionAlgorithm) && isDecryptionMode ? <div className="converter-row">
          <div className="converter-item full-convert-item">
            <div className="label">初始向量：</div>
            <Input placeholder="请输入初始向量" value={iv} onChange={onIvChange}  />
          </div>
        </div> : null
      }

      <div className="converter-row">
        <div className="converter-item full-convert-item">
          <div className="operation-btns">
            {isEncryptionMode && <Button onClick={onClickLockBtn} className="lock-btn">加密</Button>}
            {
              isDecryptionMode && <Button onClick={onClickUnlockBtn} className="unlock-btn">解密</Button>
            }
          </div>
        </div>
      </div>
    </div>

    {
      ((isEncryptionMode && encryptionResult) || (isDecryptionMode && decryptionResult)) && <div className="tool-operation-container" style={{marginTop: '20px'}}>
        <div className="converter-row">
          <div className="converter-item full-convert-item encrypt-decrypt-result">
            <div className="label">{isEncryptionMode ? '加密' : '解密'}结果：</div>
            <div>{
              isEncryptionMode ? encryptionResult : decryptionResult
            }</div>
          </div>
        </div>

        {
          isEncryptionMode && aesIv && encryptionAlgorithm === EncryptionAlgorithm.AES && <div className="converter-row">
            <div className="converter-item full-convert-item">
              <div className="label">加密向量（请记住，用于解密）：</div>
              <div>{
                aesIv
              }</div>
            </div>
          </div>
        }
      </div>
    }

    <div className="tool-description-container" style={{borderTop: 'none'}}>
      <h1>对称加密算法</h1>
      <h2>AES (Advanced Encryption Standard)</h2>
      <div className="content">
        <ul>
          <li>常用的对称加密算法，支持 128、192 和 256 位密钥长度。</li>
          <li>被广泛应用于各种安全协议和应用中，如TLS、VPN和磁盘加密。</li>
        </ul>
      </div>

      <h2>DES (Data Encryption Standard)</h2>
      <div className="content">
        <ul>
          <li>早期的一种对称加密算法，使用56位密钥。</li>
          <li>由于密钥长度较短，安全性较低，现在一般被更强的算法（如AES）所取代。</li>
        </ul>
      </div>

      <h2>3DES (Triple DES)</h2>
      <div className="content">
        <ul>
          <li>通过三次应用DES算法来增强安全性。</li>
          <li>用两个或三个56位密钥，但由于效率较低，也逐渐被AES取代。</li>
        </ul>
      </div>

      <h2>RC4</h2>
      <div className="content">
        <ul>
          <li>流加密算法，广泛应用于早期的加密协议，如WEP和TLS（较早版本）。</li>
          <li>由于存在已知的弱点，现在一般不推荐使用。</li>
        </ul>
      </div>

      <h1>非对称加密算法</h1>
      <h2>RSA (Rivest-Shamir-Adleman)</h2>
      <div className="content">
        <ul>
          <li>基于大数分解难题的非对称加密算法，常用的密钥长度为1024、2048和4096位。</li>
          <li>广泛应用于数字签名、密钥交换和证书颁发等领域。</li>
        </ul>
      </div>

      <h2>ECC (Elliptic Curve Cryptography)</h2>
      <div className="content">
        <ul>
          <li>基于椭圆曲线数学问题的非对称加密算法。</li>
          <li>提供与RSA相同级别安全性时，密钥长度更短，因此效率更高。</li>
        </ul>
      </div>

      <h2>DSA (Digital Signature Algorithm)</h2>
      <div className="content">
        <ul>
          <li>专用于数字签名的非对称算法。</li>
          <li>常用于数字证书和签名验证。</li>
        </ul>
      </div>

      <h1>哈希函数</h1>
      <h2>SHA-2 (Secure Hash Algorithm 2)</h2>
      <div className="content">
        <ul>
          <li>一组加密哈希函数，包括SHA-224、SHA-256、SHA-384和SHA-512。</li>
          <li>广泛用于数据完整性验证、数字签名和密码散列。</li>
        </ul>
      </div>

      <h2>SHA-3</h2>
      <div className="content">
        <ul>
          <li>基于Keccak算法的哈希函数，作为SHA-2的替代方案。</li>
          <li>提供更高的安全性和灵活性。</li>
        </ul>
      </div>

      <h2>MD5 (Message Digest Algorithm 5)</h2>
      <div className="content">
        <ul>
          <li>产生128位哈希值，曾广泛用于数据完整性验证。</li>
          <li>由于存在碰撞漏洞，现在一般不推荐用于安全应用。</li>
        </ul>
      </div>

      <h2>HMAC (Hash-based Message Authentication Code)</h2>
      <div className="content">
        <ul>
          <li>结合哈希函数和密钥的消息认证码，用于确保数据完整性和认证。</li>
          <li>常与SHA-2等哈希函数一起使用。</li>
        </ul>
      </div>
    </div>
  </>;
}

const Encryption: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '加密',
      children: <EncryptionTool mode={EncryptionToolMode.Encryption}/>,
    },
    {
      key: '2',
      label: '解密',
      children: <EncryptionTool mode={EncryptionToolMode.Decryption} />,
    },
  ];

  return <div className="encryption-tool-container">
    <Tabs defaultActiveKey="1" items={items} />
  </div>;
};

export default Encryption;

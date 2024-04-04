import Base64PNG from '../../assets/pngs/base64.png';
import CalculatorPNG from '../../assets/pngs/calculator.png';
import CNYPNG from '../../assets/pngs/CNY.png';
import ColorConverterPNG from '../../assets/pngs/colorConverter.png';
import DigitSystemConverterPNG from '../../assets/pngs/digitSystemConverter.png';
import EncryptionPNG from '../../assets/pngs/encryption.png';
import EnglishStyleConversionPNG from '../../assets/pngs/englishStyleConversion.png';
import PalettePNG from '../../assets/pngs/palette.png';
import PasswordGeneratorPNG from '../../assets/pngs/passwordGenerator.png';
import TimestampPNG from '../../assets/pngs/timestamp.png';
import URLEncodePNG from '../../assets/pngs/urlencode.png';
import WordCountPNG from '../../assets/pngs/wordCount.png';
import ZhouyiPNG from '../../assets/pngs/Zhouyi.png';










export enum ToolKeys {
  /** 时间戳转换 */
  Timestamp = 'timestamp',
  /** 计算器 */
  Calculator = 'calculator',
  /** 加密工具 */
  Encryption = 'encryption',
  /** 颜色转换 */
  ColorConverter = 'colorConverter',
  /** 进制转换 */
  DigitSystemConverter = 'digitSystemConverter',
  /** 调色板 */
  Palette = 'palette',
  /** 人民币大写转换器 */
  CNYCapitalizationConverter = 'CNYCapitalizationConverter',
  /** 周易 */
  ZhouYi = 'ZhouYi',
  Base64 = "Base64",
  EnglishStyleConversion = "EnglishStyleConversion",
  PasswordGenerator = "PasswordGenerator",
  WordCount = "WordCount",
  URLEncode = "URLEncode"
}

export interface Tool {
  /** 工具标题 */
  title: string;
  /** 工具描述 */
  description: string;
  /** 工具名称 */
  key: ToolKeys;
  /** 工具图标 */
  icon: string;
}

export const tools: Tool[] = [
  {
    key: ToolKeys.Timestamp,
    title: '时间戳转换',
    description: '时间戳与北京时间互相转换，支持秒级、毫秒级。',
    icon: TimestampPNG
  },
  {
    key: ToolKeys.Calculator,
    title: '计算器',
    description: '计算器',
    icon: CalculatorPNG
  },
  {
    key: ToolKeys.Encryption,
    title: '加密工具',
    description: '加密工具',
    icon: EncryptionPNG
  },
  {
    key: ToolKeys.ColorConverter,
    title: '颜色转换',
    description: '支持 RGB 颜色值和十六进制颜色码互相转换。',
    icon: ColorConverterPNG
  },
  {
    key: ToolKeys.DigitSystemConverter,
    title: '进制转换',
    description: '二进制、八进制、十进制、十六进制等常用进制转换。',
    icon: DigitSystemConverterPNG
  },
  {
    key: ToolKeys.Palette,
    title: '调色盘',
    description: '可视化选择和对比多种颜色，快速定制配色方案。',
    icon: PalettePNG
  },
  {
    key: ToolKeys.CNYCapitalizationConverter,
    title: '人民币大写转换器',
    description: '人民币大写转换器',
    icon: CNYPNG
  },
  // {
  //   key: ToolKeys.ZhouYi,
  //   title: '易经',
  //   description: '学习了解中华传统文化，辩证看待世间事物发展规律。',
  //   icon: ZhouyiPNG
  // },
  {
    key: ToolKeys.URLEncode,
    title: 'UrlEncode 编解码',
    description: '支持 utf-8 文本内容的 URL Encode、Decode。',
    icon: URLEncodePNG
  },
  {
    key: ToolKeys.Base64,
    title: 'Base64 编解码',
    description: '支持对文本内容进行 Base64 编码和解码操作。',
    icon: Base64PNG
  },
  {
    key: ToolKeys.EnglishStyleConversion,
    title: '英文格式转换',
    description: '支持大小写、驼峰、中划线、下划线、空格等格式转换。',
    icon: EnglishStyleConversionPNG
  },
  {
    key: ToolKeys.PasswordGenerator,
    title: '随机密码生成器',
    description: '根据不同规则任意搭配，自定义生成随机密码。',
    icon: PasswordGeneratorPNG
  },
  {
    key: ToolKeys.WordCount,
    title: '字数统计工具',
    description: '统计文本内容中的中英文字符、标点符号、空格等数据。',
    icon: WordCountPNG
  }
];

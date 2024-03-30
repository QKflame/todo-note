// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CalculatorPNG from '../../assets/pngs/calculator.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CNYPNG from '../../assets/pngs/CNY.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ColorConverterPNG from '../../assets/pngs/colorConverter.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DigitSystemConverterPNG from '../../assets/pngs/digitSystemConverter.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import EncryptionPNG from '../../assets/pngs/encryption.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PalettePNG from '../../assets/pngs/palette.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TimestampPNG from '../../assets/pngs/timestamp.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ZhouyiPNG from '../../assets/pngs/Zhouyi.png';

export enum ToolKeys  {
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
  ZhouYi = 'ZhouYi'
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
    description: '颜色转换',
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
    description: '调色盘',
    icon: PalettePNG
  },
  {
    key: ToolKeys.CNYCapitalizationConverter,
    title: '人民币大写转换器',
    description: '人民币大写转换器',
    icon: CNYPNG
  },
  {
    key: ToolKeys.ZhouYi,
    title: '周易',
    description: '学习了解中华传统文化，辩证看待世间事物发展规律。',
    icon: ZhouyiPNG
  }
];

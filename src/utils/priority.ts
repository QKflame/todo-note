export class Priority {
  static high = 0;
  static highText = '紧急';
  static highColorType = 'error';

  static middle = 1;
  static middleText = '重要';
  static middleColorType = 'warning';

  static low = 2;
  static lowText = '一般';
  static lowColorType = 'default';

  static map = {
    [this.high]: {
      text: this.highText,
      colorType: this.highColorType,
      rowClassName: 'high-priority-row'
    },
    [this.middle]: {
      text: this.middleText,
      colorType: this.middleColorType,
      rowClassName: 'middle-priority-row'
    },
    [this.low]: {
      text: this.lowText,
      colorType: this.lowColorType,
      rowClassName: 'low-priority-row'
    }
  };

  static isHigh(val) {
    return Number(val) === this.high;
  }

  static isMiddle(val) {
    return Number(val) === this.middle;
  }

  static isLow(val) {
    return Number(val) === this.low;
  }

  static getTextByValue(val) {
    return this.map[val]?.text;
  }

  static getColorTypeByValue(val) {
    return this.map[val]?.colorType;
  }

  static getRowClassNameByValue(val) {
    return this.map[val]?.rowClassName;
  }
}

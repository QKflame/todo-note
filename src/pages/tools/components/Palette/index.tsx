import './index.less';

import {message} from 'antd';
import {cloneDeep} from 'lodash';
import React, {useCallback, useState} from "react";

interface PaletteColor {
  groupName: string;
  color: string;
  colors: string[];
}

const paletteColors: Array<PaletteColor> = [
  {
    groupName: 'RED 红色',
    color: '#E15241',
    colors: [
      "#ffebee",
      "#ffcdd2",
      "#ef9a9a",
      "#e57373",
      "#ef5350",
      "#f44336",
      "#e53935",
      "#d32f2f",
      "#c62828",
      "#b71c1c",
      "#ff8a80",
      "#ff5252",
      "#ff1744",
      "#d50000"
    ]
  },
  {
    groupName: 'PINK 粉红色',
    color: '#D63864',
    colors: [
      "#fce4ec",
      "#f8bbd0",
      "#f48fb1",
      "#f06292",
      "#ec407a",
      "#e91e63",
      "#d81b60",
      "#c2185b",
      "#ad1457",
      "#880e4f",
      "#ff80ab",
      "#ff4081",
      "#f50057",
      "#c51162"
    ]
  },
  {
    groupName: 'PURPLE 紫色',
    color: '#9031AA',
    colors: [
      "#f3e5f5",
      "#e1bee7",
      "#ce93d8",
      "#ba68c8",
      "#ab47bc",
      "#9c27b0",
      "#8e24aa",
      "#7b1fa2",
      "#6a1b9a",
      "#4a148c",
      "#ea80fc",
      "#e040fb",
      "#d500f9",
      "#aa00ff"
    ]
  },
  {
    groupName: 'DEEP PURPLE 深紫色',
    color: '#613CB0',
    colors: [
      "#ede7f6",
      "#d1c4e9",
      "#b39ddb",
      "#9575cd",
      "#7e57c2",
      "#673ab7",
      "#5e35b1",
      "#512da8",
      "#4527a0",
      "#311b92",
      "#b388ff",
      "#7c4dff",
      "#651fff",
      "#6200ea"
    ]
  },
  {
    groupName: 'INDIGO 靛蓝色',
    color: '#4350AF',
    colors: [
      "#e8eaf6",
      "#c5cae9",
      "#9fa8da",
      "#7986cb",
      "#5c6bc0",
      "#3f51b5",
      "#3949ab",
      "#303f9f",
      "#283593",
      "#1a237e",
      "#8c9eff",
      "#536dfe",
      "#3d5afe",
      "#304ffe"
    ]
  },
  {
    groupName: 'BLUE 蓝色',
    color: '#4994EC',
    colors: [
      "#e3f2fd",
      "#bbdefb",
      "#90caf9",
      "#64b5f6",
      "#42a5f5",
      "#2196f3",
      "#1e88e5",
      "#1976d2",
      "#1565c0",
      "#0d47a1",
      "#82b1ff",
      "#448aff",
      "#2979ff",
      "#2962ff"
    ]
  },
  {
    groupName: 'LIGHT BLUE 浅蓝色',
    color: '#4BA6EE',
    colors: [
      "#e1f5fe",
      "#b3e5fc",
      "#81d4fa",
      "#4fc3f7",
      "#29b6f6",
      "#03a9f4",
      "#039be5",
      "#0288d1",
      "#0277bd",
      "#01579b",
      "#80d8ff",
      "#40c4ff",
      "#00b0ff",
      "#0091ea"
    ]
  },
  {
    groupName: 'CYAN 青色',
    color: '#54B9D1',
    colors: [
      "#e0f7fa",
      "#b2ebf2",
      "#80deea",
      "#4dd0e1",
      "#26c6da",
      "#00bcd4",
      "#00acc1",
      "#0097a7",
      "#00838f",
      "#006064",
      "#84ffff",
      "#18ffff",
      "#00e5ff",
      "#00b8d4"
    ]
  },
  {
    groupName: 'TEAL 青绿色',
    color: '#429488',
    colors: [
      "#e0f2f1",
      "#b2dfdb",
      "#80cbc4",
      "#4db6ac",
      "#26a69a",
      "#009688",
      "#00897b",
      "#00796b",
      "#00695c",
      "#004d40",
      "#a7ffeb",
      "#64ffda",
      "#1de9b6",
      "#00bfa5"
    ]
  },
  {
    groupName: 'GREEN 绿色',
    color: '#67AD5B',
    colors: [
      "#e8f5e9",
      "#c8e6c9",
      "#a5d6a7",
      "#81c784",
      "#66bb6a",
      "#4caf50",
      "#43a047",
      "#388e3c",
      "#2e7d32",
      "#1b5e20",
      "#b9f6ca",
      "#69f0ae",
      "#00e676",
      "#00c853"
    ]
  },
  {
    groupName: 'LIGHT GREEN 浅绿色',
    color: '#97C15C',
    colors: [
      "#f1f8e9",
      "#dcedc8",
      "#c5e1a5",
      "#aed581",
      "#9ccc65",
      "#8bc34a",
      "#7cb342",
      "#689f38",
      "#558b2f",
      "#33691e",
      "#ccff90",
      "#b2ff59",
      "#76ff03",
      "#64dd17"
    ]
  },
  {
    groupName: 'LIME 青橙绿色',
    color: '#D0DC59',
    colors: [
      "#f9fbe7",
      "#f0f4c3",
      "#e6ee9c",
      "#dce775",
      "#d4e157",
      "#cddc39",
      "#c0ca33",
      "#afb42b",
      "#9e9d24",
      "#827717",
      "#f4ff81",
      "#eeff41",
      "#c6ff00",
      "#aeea00"
    ]
  },
  {
    groupName: 'YELLOW 黄色',
    color: '#FCEC60',
    colors: [
      "#fffde7",
      "#fff9c4",
      "#fff59d",
      "#fff176",
      "#ffee58",
      "#ffeb3b",
      "#fdd835",
      "#fbc02d",
      "#f9a825",
      "#f57f17",
      "#ffff8d",
      "#ffff00",
      "#ffea00",
      "#ffd600"
    ]
  },
  {
    groupName: 'AMBER 琥珀色',
    color: '#F6C344',
    colors: [
      "#fff8e1",
      "#ffecb3",
      "#ffe082",
      "#ffd54f",
      "#ffca28",
      "#ffc107",
      "#ffb300",
      "#ffa000",
      "#ff8f00",
      "#ff6f00",
      "#ffe57f",
      "#ffd740",
      "#ffc400",
      "#ffab00"
    ]
  },
  {
    groupName: 'ORANGE 桔黄色',
    color: '#F19D38',
    colors: [
      "#fff3e0",
      "#ffe0b2",
      "#ffcc80",
      "#ffb74d",
      "#ffa726",
      "#ff9800",
      "#fb8c00",
      "#f57c00",
      "#ef6c00",
      "#e65100",
      "#ffd180",
      "#ffab40",
      "#ff9100",
      "#ff6d00"
    ]
  },
  {
    groupName: 'DEEP ORANGE 深桔黄色',
    color: '#EC6337',
    colors: [
      "#fbe9e7",
      "#ffccbc",
      "#ffab91",
      "#ff8a65",
      "#ff7043",
      "#ff5722",
      "#f4511e",
      "#e64a19",
      "#d84315",
      "#bf360c",
      "#ff9e80",
      "#ff6e40",
      "#ff3d00",
      "#dd2c00"
    ]
  },
  {
    groupName: 'BROWN 棕褐色',
    color: '#74574A',
    colors: [
      "#efebe9",
      "#d7ccc8",
      "#bcaaa4",
      "#a1887f",
      "#8d6e63",
      "#795548",
      "#6d4c41",
      "#5d4037",
      "#4e342e",
      "#3e2723",
      ...(new Array(4)).map(() => '')
    ]
  },
  {
    groupName: 'GREY 灰色',
    color: '#9E9E9E',
    colors: [
      "#fafafa",
      "#f5f5f5",
      "#eeeeee",
      "#e0e0e0",
      "#bdbdbd",
      "#9e9e9e",
      "#757575",
      "#616161",
      "#424242",
      "#212121",
      ...(new Array(4)).map(() => '')
    ]
  },
  {
    groupName: 'BLUE GREY 蓝灰色',
    color: '#667C89',
    colors: [
      "#eceff1",
      "#cfd8dc",
      "#b0bec5",
      "#90a4ae",
      "#78909c",
      "#607d8b",
      "#546e7a",
      "#455a64",
      "#37474f",
      "#263238",
      ...(new Array(4)).map(() => '')
    ]
  }
];

const colorLevelMap = {
  0: 'A700',
  1: 'A400',
  2: 'A200',
  3: 'A100',
  4: '900',
  5: '800',
  6: '700',
  7: '600',
  8: '500',
  9: '400',
  10: '300',
  11: '200',
  12: '100',
  13: '50'
};

const messageKey = 'messageKey';

const Palette: React.FC = () => {
  const [currentSelectedGroup, setCurrentSelectedGroup] = useState('');

  const onClickGroup = useCallback((item: PaletteColor) => {
    setCurrentSelectedGroup(item.groupName);
  }, []);

  const onClickColorBlock = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    message.success({
      content: '复制成功 ' + code,
      duration: 1,
      key: messageKey
    });
  }, []);

  return <div>
    {
      paletteColors.map(item => {
        return <div key={item.groupName} className="color-row" style={{
          backgroundColor: item.color
        }} onClick={() => onClickGroup(item)}>
          {
            item.groupName === currentSelectedGroup ? <div className="color-selected-container">
              {
                (cloneDeep(item.colors)).reverse().map((_item, index) => {
                  return !_item ? null : <div key={_item} className="color-block" style={{
                    backgroundColor: _item,
                    color: ['50', '100', 'A100', 'A200'].includes(colorLevelMap[index]) ? '#333' : '#fff'
                  }} onClick={() => onClickColorBlock(_item)}>
                    <span className="color-level">{colorLevelMap[index]}</span>
                    <span className="hex-code">{_item}</span>
                  </div>;
                })
              }
            </div> : <span className="group-name">{
              item.groupName
            }</span>
          }
        </div>;
      })
    }
  </div>;
};

export default Palette;

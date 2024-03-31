import './tools.less';
import './tool.common.less';

import {ProductOutlined, StarOutlined} from '@ant-design/icons';
import {Drawer, Empty, Segmented} from 'antd';
import cx from 'classnames';
import React, {memo, useCallback, useMemo, useState} from "react";

import ColorConverter from './components/ColorConverter';
import DigitSystemConverter from './components/DigitSystemConverter';
import Palette from './components/Palette';
import Timestamp from './components/Timestamp';
import {Tool, ToolKeys, tools} from "./config";

class CollectStorage {
  key = 'COLLECT_TOOLS';
  setItem(type: string) {
    const data = localStorage.getItem(this.key);
    if (!data) {
      localStorage.setItem(this.key, type);
      return;
    }
    const types = data.split(',');
    if (types.includes(type)) {
      return;
    }
    types.push(type);
    localStorage.setItem(this.key, types.join(','));
  }

  removeItem(type: string) {
    const data = localStorage.getItem(this.key);
    if (!data) {
      return;
    }
    let types = data.split(',');
    types = types.filter(item => item !== type);
    if (!types.length) {
      localStorage.removeItem(this.key);
      return;
    }
    localStorage.setItem(this.key, types.join(','));
  }

  getTypes() {
    const data = localStorage.getItem(this.key);
    if (!data) {
      return [];
    }
    return data.split(',');
  }
}

const collectStorage = new CollectStorage();


const Tools: React.FC = memo(() => {
  const onClickTool = (item: Tool) => {
    setCurrentSelectedTool(item);
    setIsToolDrawerOpen(true);
  };

  const onSegmentTypeChange = useCallback((e: any) => {
    setSegmentType(e);
    localStorage.setItem('TOOLS_SEGMENT_TYPE', e);
  }, []);

  const [segmentType, setSegmentType] = useState(localStorage.getItem('TOOLS_SEGMENT_TYPE') || 'all');
  const [collectTypes, setCollectTypes] = useState(collectStorage.getTypes());
  const [currentSelectedTool, setCurrentSelectedTool] = useState<Tool>(null);
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);

  const onClickCollect = useCallback((e: any, type: string) => {
    e.stopPropagation();
    if (collectTypes.includes(type)) {
      collectStorage.removeItem(type);
      setCollectTypes(collectStorage.getTypes());
      return;
    }
    collectStorage.setItem(type);
    setCollectTypes(collectStorage.getTypes());
  }, [collectTypes]);

  const filteredTools = useMemo(() => {
    if (segmentType === 'all') {
      return tools;
    }
    return tools.filter(item => collectTypes.includes(item.key));
  }, [collectTypes, segmentType]);

  const onToolDrawerClose = useCallback(() => {
    setIsToolDrawerOpen(false);
  }, []);

  const renderTool = useCallback(() => {
    const key = currentSelectedTool?.key;
    if (key === ToolKeys.Timestamp) {
      return <Timestamp></Timestamp>;
    }
    if (key === ToolKeys.ColorConverter) {
      return <ColorConverter></ColorConverter>;
    }
    if (key === ToolKeys.Palette) {
      return <Palette></Palette>;
    }
    if (key === ToolKeys.DigitSystemConverter) {
      return <DigitSystemConverter></DigitSystemConverter>;
    }
  }, [currentSelectedTool?.key]);

  return <div className="tools-page-container">
    <Segmented
      className="segmented-container"
      value={segmentType}
      onChange={onSegmentTypeChange}
      options={[{
        label: "我收藏的",
        value: 'favorite',
        icon: <StarOutlined />
      }, {
        label: '全部工具',
        value: 'all',
        icon: <ProductOutlined />
      }]}
    />
    {
      !filteredTools.length ? <Empty className="empty-container" description="暂无收藏工具" style={{
        marginTop: '160px',
      }} /> : null
    }
    <div className="tools-container">
      {
        filteredTools.map(item => {
          return <div key={item.key} className={cx('tool-container', `${item.key}-tool-container`)} onClick={() => onClickTool(item)}>
            <div className="tool-header">
              <div className="tool-avatar">
                <img src={item.icon}></img>
              </div>
              <div className="tool-title-collect-container">
                <div className="tool-title">{item.title}</div>
                <div className="tool-collect-container">
                  <span onClick={(e) => onClickCollect(e, item.key)} className="collect-icon-container">
                    {
                      collectTypes.includes(item.key) ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7439" width="16" height="16"><path d="M937.984 359.168c-31.1296-141.568-141.8752-230.0928-299.3664-198.2976-49.408 9.984-88.4224 37.12-123.1872 72.6528-2.9184-1.28-4.096-1.4848-4.9152-2.2016-2.2016-1.8432-4.352-3.7888-6.3488-5.8368C459.0592 178.688 403.2 157.184 338.9952 154.624c-76.7488-3.072-141.9776 22.1184-190.7712 81.8176-85.7088 104.8576-88.0128 262.0416-7.8336 374.4256 40.8064 57.1904 90.1632 106.1376 144.5376 149.8624 56.0128 45.0048 113.2544 88.576 170.8544 131.5328 36.1472 26.9312 75.4176 28.8768 109.1584 4.4032 98.304-71.2192 197.2224-141.7728 279.3472-232.4992 78.9504-87.0912 119.8592-186.0608 93.696-304.9984zM285.7984 554.5472a39.9872 39.9872 0 0 1-55.7568-8.9088c-76.6464-105.728-21.2992-200.4992-18.944-204.4928 11.3664-18.8928 35.8912-25.0368 54.784-13.6704a39.8592 39.8592 0 0 1 13.8752 54.3744c-3.2768 5.8368-29.1328 56.1664 14.8992 116.8896a39.9872 39.9872 0 0 1-8.8576 55.808z" fill="#F23D4F" p-id="7440"></path><path d="M807.9872 178.5856c-46.848-23.3472-104.0896-30.9248-169.3184-17.7664-49.408 9.984-88.4224 37.12-123.1872 72.6528-2.9184-1.28-4.096-1.4848-4.9152-2.2016-2.2016-1.8432-4.352-3.7888-6.3488-5.8368C459.0592 178.688 403.2 157.184 338.9952 154.624c-76.7488-3.072-141.9776 22.1184-190.7712 81.8176-85.7088 104.8576-88.0128 262.0416-7.8336 374.4256 40.8064 57.1904 90.1632 106.1376 144.5376 149.8624 30.7712 24.7296 61.9008 48.9984 93.2864 72.96 251.7504-55.0912 440.2176-279.2448 440.2176-547.4816 0-36.8128-3.6352-72.7552-10.4448-107.6224zM285.7984 554.5472a39.9872 39.9872 0 0 1-55.7568-8.9088c-76.6464-105.728-21.2992-200.4992-18.944-204.4928 11.3664-18.8928 35.8912-25.0368 54.784-13.6704a39.8592 39.8592 0 0 1 13.8752 54.3744c-3.2768 5.8368-29.1328 56.1664 14.8992 116.8896a39.9872 39.9872 0 0 1-8.8576 55.808z" fill="#FC4956" p-id="7441"></path><path d="M638.6688 160.8704c-49.408 9.984-88.4224 37.12-123.1872 72.6528-2.9184-1.28-4.096-1.4848-4.9152-2.2016-2.2016-1.8432-4.352-3.7888-6.3488-5.8368C459.0592 178.688 403.2 157.184 338.9952 154.624c-76.7488-3.072-141.9776 22.1184-190.7712 81.8176-85.7088 104.8576-88.0128 262.0416-7.8336 374.4256 8.192 11.4688 16.8448 22.5792 25.7024 33.4336 257.536-28.16 462.4896-230.7072 494.4896-487.0656-7.2192 0.9728-14.4896 2.1504-21.9136 3.6352z m-352.8704 393.6768a39.9872 39.9872 0 0 1-55.7568-8.9088c-76.6464-105.728-21.2992-200.4992-18.944-204.4928 11.3664-18.8928 35.8912-25.0368 54.784-13.6704a39.8592 39.8592 0 0 1 13.8752 54.3744c-3.2768 5.8368-29.1328 56.1664 14.8992 116.8896a39.9872 39.9872 0 0 1-8.8576 55.808z" fill="#FF5C64" p-id="7442"></path><path d="M338.9952 154.624c-76.7488-3.072-141.9776 22.1184-190.7712 81.8176-46.2336 56.576-68.1472 128.4096-65.9968 200.192 38.0416-8.192 74.5984-20.2752 109.312-35.7376 5.0688-34.9696 18.432-57.856 19.5584-59.7504 11.3664-18.8928 35.8912-25.0368 54.784-13.6704 8.4992 5.12 14.3872 12.8512 17.2544 21.6064 64.2048-44.6464 118.6816-102.1952 159.488-169.1648-31.3856-15.7184-66.048-23.808-103.6288-25.2928z" fill="#FF716E" p-id="7443"></path></svg> : <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5983" width="16" height="16"><path d="M700 192c92.8 0 166.4 72.8 166.4 166.4 0 129.6-133.6 251.2-336.8 435.2l-17.6 16-17.6-16C291.2 609.6 157.6 488 157.6 358.4c0-92.8 72.8-166.4 166.4-166.4 52.8 0 104.8 24 140 64.8l48.8 56.8 48.8-56.8c33.6-40 86.4-64.8 138.4-64.8m0-64c-72.8 0-142.4 33.6-188 87.2C466.4 162.4 396.8 128 324 128c-128.8 0-230.4 100.8-230.4 230.4 0 157.6 142.4 287.2 357.6 482.4L512 896l60.8-55.2c215.2-196 357.6-324.8 357.6-482.4 0-128.8-100.8-230.4-230.4-230.4z" p-id="5984" fill="#555555"></path></svg>
                    }
                  </span>
                  <span>
                    {
                      collectTypes.includes(item.key) ? '已收藏' : '加入收藏'
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="tool-desc">{item.description}</div>
          </div>;
        })
      }
    </div>
    <Drawer
      width={720}
      open={isToolDrawerOpen}
      onClose={onToolDrawerClose}
      autoFocus={true}
      mask={true}
      title={
        <div className="tool-drawer-title-container">
          <img src={currentSelectedTool?.icon} className="icon"></img>
          <div className="title">{currentSelectedTool?.title}</div>
        </div>
      }
      closeIcon={<div style={{fontSize: 12}} className="close">关闭</div>}
      className="tool-drawer-container"
      destroyOnClose={true}
    >
      {renderTool()}
    </Drawer>
  </div>;
});

export default Tools;

import './header.less';

import {
  CarryOutOutlined,
  ReadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {Avatar, Menu, MenuProps} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppSelector} from 'src/hooks/store';
import {MenuType} from 'src/utils/types';

const menuItems: MenuProps['items'] = [
  {
    label: '待办中心',
    key: MenuType.Todo,
    icon: <CarryOutOutlined />
  },
  {
    label: '笔记专栏',
    key: MenuType.Note,
    icon: <ReadOutlined />
  }
];

const Header = () => {
  const navigate = useNavigate();
  const headerHeight = useAppSelector((state) => state.style.headerHeight);
  const headerMarginBottom = useAppSelector(
    (state) => state.style.headerMarginBottom
  );

  const [selectedKeys, setSelectedKeys] = useState([]);

  const location = useLocation();

  const onClickMenu = useCallback(
    (e: { key: string }) => {
      const currentPath = location.pathname;
      const targetPath = '/' + e.key;
      if (currentPath === targetPath) {
        return;
      }
      navigate(targetPath);
    },
    [location, navigate]
  );

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/todo') {
      setSelectedKeys(['todo']);
      return;
    }
    if (location.pathname === '/note') {
      setSelectedKeys(['note']);
    }
  }, [location.pathname]);

  return (
    <div
      className="app-header"
      style={{height: headerHeight, marginBottom: headerMarginBottom}}
    >
      <div>
        <Menu
          mode="horizontal"
          items={menuItems}
          onClick={onClickMenu}
          selectedKeys={selectedKeys}
        ></Menu>
      </div>
      <div>
        <Avatar
          style={{backgroundColor: '#1890ff', verticalAlign: 'middle'}}
          shape="square"
          size={32}
          icon={<UserOutlined />}
        />
      </div>
    </div>
  );
};

export default Header;

import './header.less';

import {CalendarOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, MenuProps} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppSelector} from 'src/hooks/store';

const menuItems: MenuProps['items'] = [
  {
    label: '我的待办',
    key: 'todo',
    icon: <CalendarOutlined />
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
  console.log('location', location);

  const onClickMenu = useCallback(
    (e: { key: string }) => {
      navigate(e.key);
    },
    [navigate]
  );

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/todo') {
      setSelectedKeys(['todo']);
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

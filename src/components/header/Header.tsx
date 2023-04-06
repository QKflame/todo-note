import {Avatar, Menu, MenuProps} from 'antd';
import './header.less';
import {CheckSquareOutlined, UserOutlined} from '@ant-design/icons';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

const menuItems: MenuProps['items'] = [
  {
    label: '我的待办',
    key: 'todo',
    icon: <CheckSquareOutlined />
  }
];

const Header = () => {
  const navigate = useNavigate();

  const onClickMenu = useCallback((e: { key: string }) => {
    navigate(e.key);
  }, []);

  return (
    <div className="app-header">
      <div>
        <Menu mode="horizontal" items={menuItems} onClick={onClickMenu}></Menu>
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

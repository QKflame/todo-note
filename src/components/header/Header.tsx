import {Avatar, Menu, MenuProps} from 'antd';
import './header.less';
import {CheckSquareOutlined, UserOutlined} from '@ant-design/icons';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from 'src/hooks/store';
import styled from 'styled-components';

const menuItems: MenuProps['items'] = [
  {
    label: '我的待办',
    key: 'todo',
    icon: <CheckSquareOutlined />
  }
];

const Header = () => {
  const navigate = useNavigate();
  const headerHeight = useAppSelector((state) => state.style.headerHeight);

  const onClickMenu = useCallback((e: { key: string }) => {
    navigate(e.key);
  }, []);

  const Wrapper = styled.div`
    height: ${headerHeight};
  `;

  return (
    <Wrapper className="app-header">
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
    </Wrapper>
  );
};

export default Header;

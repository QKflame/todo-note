import './header.less';

import {UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, MenuProps} from 'antd';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from 'src/hooks/store';
import styled from 'styled-components';

const menuItems: MenuProps['items'] = [
  {
    label: '我的待办',
    key: 'todo'
  }
];

const Header = () => {
  const navigate = useNavigate();
  const headerHeight = useAppSelector((state) => state.style.headerHeight);
  const headerMarginBottom = useAppSelector(
    (state) => state.style.headerMarginBottom
  );

  const onClickMenu = useCallback((e: { key: string }) => {
    navigate(e.key);
  }, []);

  const Wrapper = styled.div`
    height: ${headerHeight};
    margin-bottom: ${headerMarginBottom};
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

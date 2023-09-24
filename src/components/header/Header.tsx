import './header.less';

import Icon, {
  CarryOutOutlined,
  ReadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Input,
  Menu,
  MenuProps,
  Modal,
  Popover,
  Result
} from 'antd';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import usePageType from 'src/hooks/usePageType';
import {setKeyword, setSearchDialogVisible} from 'src/store/search';
import {TodoItem} from 'src/types';
import {MenuType} from 'src/utils/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LocaleSvg from '../../assets/icons/locale.svg';

const {Search} = Input;

const menuItems: MenuProps['items'] = [
  {
    label: '待办事项',
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
  const searchDialogVisible = useAppSelector(
    (state) => state.search.searchDialogVisible
  );

  /** 弹窗中搜索的关键词 */
  const searchKeyword = useAppSelector((state) => state.search.keyword);
  const {isTodo, isNote} = usePageType();
  const dispatch = useAppDispatch();
  const [fullData, setFullData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');

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

  const onConfirmSearch = useCallback(
    (e) => {
      if (!e.target.value) {
        return;
      }
      dispatch(setSearchDialogVisible(true));
    },
    [dispatch]
  );

  const onKeywordChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      dispatch(setKeyword(value));
    },
    [dispatch]
  );

  const onCancelSearchDialog = useCallback(() => {
    dispatch(setSearchDialogVisible(false));
  }, [dispatch]);

  const afterSearchDialogClose = useCallback(() => {
    setSearchValue('');
    dispatch(setKeyword(''));
    setFullData([]);
  }, [dispatch]);

  const searchPlaceholder = useMemo(() => {
    return isTodo
      ? '输入待办事项标题及内容进行搜索'
      : '输入笔记标题及内容进行搜索';
  }, [isTodo]);

  const onDialogSearchValueChange = useCallback(
    (e) => {
      const value = e.target.value;
      dispatch(setKeyword(value));
    },
    [dispatch]
  );

  const onConfirmDialogSearch = useCallback(() => {
    if (!searchKeyword) {
    }
  }, [searchKeyword]);

  const handleSetFilteredData = useCallback(() => {
    setFilteredData(
      fullData.filter((item) => {
        const regExp = new RegExp(searchKeyword, 'g');
        return regExp.test(item.name) || regExp.test(item.content);
      })
    );
  }, [fullData, searchKeyword]);

  useEffect(() => {
    if (searchDialogVisible) {
      window.api.getTodoFullData({}).then((res) => {});
    }
    window.api.getTodoFullData({}).then((res) => {
      setFullData(res?.result || []);
      handleSetFilteredData();
    });
  }, [handleSetFilteredData, searchDialogVisible]);

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
      <div style={{display: 'flex', alignItems: 'center'}}>
        {/* <Avatar
          style={{backgroundColor: '#1890ff', verticalAlign: 'middle'}}
          shape="square"
          size={32}
          icon={<UserOutlined />}
        /> */}
        {/* <Input
          className="global-search-container"
          placeholder={searchPlaceholder}
          size="middle"
          value={searchValue}
          onChange={onKeywordChange}
          suffix={<SearchOutlined />}
          onPressEnter={onConfirmSearch}
          allowClear={true}
        />
        <Popover
          placement="bottom"
          content={
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Button type="text">中文</Button>
              <Button type="text">English</Button>
            </div>
          }
          trigger="hover"
        >
          <Icon
            component={LocaleSvg}
            style={{
              fontSize: 20,
              marginLeft: 12,
              cursor: 'pointer',
              color: '#999'
            }}
          ></Icon>
        </Popover> */}
      </div>

      <Modal
        title="全局搜索"
        // open={true}
        open={searchDialogVisible}
        onCancel={onCancelSearchDialog}
        afterClose={afterSearchDialogClose}
        footer={null}
        className="global-search-dialog"
      >
        <div className="body-container">
          <Search
            placeholder={searchPlaceholder}
            value={searchKeyword}
            onChange={onDialogSearchValueChange}
            enterButton
            size="large"
            onSearch={onConfirmDialogSearch}
            onPressEnter={onConfirmDialogSearch}
          />
          {!filteredData?.length && (
            <Result
              status="404"
              title="未找到匹配结果"
              subTitle="请更换关键词再次进行查询"
            />
          )}
          <div className="filtered-data-container">
            {filteredData.map((item: TodoItem) => {
              return <div key={item.id}></div>;
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;

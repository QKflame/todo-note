import './header.less';

import {
  Input,
  Menu,
  MenuProps,
  Modal,
  Result
} from 'antd';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import usePageType from 'src/hooks/usePageType';
import {setKeyword, setSearchDialogVisible} from 'src/store/search';
import {TodoItem} from 'src/types';
import {MenuType} from 'src/utils/types';

const {Search} = Input;

const menuItems: MenuProps['items'] = [
  {
    label: '待办事项',
    key: MenuType.Todo,
    icon: <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8432" width="18" height="18"><path d="M756.053333 73.984a114.944 114.944 0 0 1 114.944 113.066667V428.117333l-2.432 74.752a262.954667 262.954667 0 0 0-136.661333-38.058666c-145.408 0-263.296 117.333333-263.296 262.058666a261.717333 261.717333 0 0 0 130.090667 226.133334l-123.733334-0.853334H172.032a114.944 114.944 0 0 1-114.986667-113.024V188.928a114.944 114.944 0 0 1 113.066667-114.901333h585.941333z m-409.301333 586.24H215.637333a29.866667 29.866667 0 0 0 0 59.733333h131.114667a29.866667 29.866667 0 0 0 0-59.733333z m87.381333-216.106667h-218.453333a29.866667 29.866667 0 1 0 0 59.776h218.453333a29.866667 29.866667 0 1 0 0-59.733333z m212.309334-216.106666H214.954667a29.866667 29.866667 0 0 0 0.725333 59.776h431.445333a29.866667 29.866667 0 0 0-0.682666-59.733334z" fill="#55D6A4" p-id="8433"></path><path d="M731.989333 498.986667a228.992 228.992 0 1 1 0 458.026666 228.992 228.992 0 0 1 0-458.026666z m24.192 103.594666a23.04 23.04 0 0 0-23.04 23.04v109.653334l-65.92 77.994666-0.426666 0.512a23.04 23.04 0 0 0 35.584 29.184l68.821333-81.408a22.954667 22.954667 0 0 0 7.978667-17.450666V624.938667a23.04 23.04 0 0 0-23.04-22.357334z" fill="#55D6A4" p-id="8434"></path></svg>
  },
  {
    label: '笔记专栏',
    key: MenuType.Note,
    icon: <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10868" width="18" height="18"><path d="M334.12987 788.779221m-187.012987 0a187.012987 187.012987 0 1 0 374.025974 0 187.012987 187.012987 0 1 0-374.025974 0Z" fill="#FFDEBB" p-id="10869"></path><path d="M114.094545 861.779117C114.094545 925.124156 164.987013 975.792208 228.608 975.792208h611.893195c63.617662 0 114.511792-50.673039 114.511792-114.013091V163.883221C955.012987 100.543169 904.118857 49.87013 840.501195 49.87013H230.925299C167.307636 49.87013 116.413506 100.543169 116.413506 163.883221v82.920727H86.336831C77.082597 246.803948 68.987013 254.866286 68.987013 264.075636v50.674702c0 9.212675 8.095584 17.276675 17.349818 17.276675H116.413506v64.493714H86.336831C77.082597 396.520727 68.987013 404.57974 68.987013 413.792416v50.674701c0 9.211013 8.095584 17.271688 17.349818 17.271688H116.413506v62.188052H86.336831C77.082597 543.926857 68.987013 551.995844 68.987013 561.205195v52.972052c0 9.216 8.095584 17.276675 17.349818 17.276675H116.413506v64.492052H86.336831C77.082597 695.945974 68.987013 704.008312 68.987013 713.219325v50.673039c0 9.212675 8.095584 17.278338 17.349818 17.278337H116.413506v54.125715l-2.313974 26.487688-0.004987-0.004987z m94.138182-164.849039H167.433974v-64.432208h40.798753c9.329039 0 17.487792-8.059013 17.487792-17.263376v-50.626494c0-9.202701-8.158753-17.25839-17.487792-17.25839H167.433974v-64.432207h40.798753c9.329039 0 17.487792-8.052364 17.487792-17.256728v-50.63148c0-9.204364-8.158753-17.25839-17.487792-17.25839H167.433974v-64.432208h40.798753c9.329039 0 17.487792-8.054026 17.487792-17.258389v-50.626494c0-9.204364-8.158753-17.261714-17.487792-17.261714H167.433974V164.200727c0-31.069091 24.481247-55.229506 55.949299-55.229506h616.610909c31.474701 0 55.950961 24.165403 55.950961 55.229506v697.260883c0 31.069091-24.47626 55.229506-55.950961 55.229507H223.384935c-31.468052 0-55.949299-24.160416-55.949299-55.229507v-80.540259h40.798754c9.329039 0 17.487792-8.052364 17.487792-17.256728v-47.17548c0-11.505039-8.158753-19.559065-17.487792-19.559065z m162.819325-272.751377h380.342857c25.357299 0 46.10161-21.274597 46.10161-47.28187V235.054545c0-26.002286-20.744312-47.28187-46.103272-47.28187H371.052052c-25.353974 0-46.10161 21.274597-46.10161 47.28187v140.660364c0 27.189195 20.744312 48.463792 46.10161 48.463792z" fill="#86BC9F" p-id="10870"></path></svg>
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

import './todoList.less';

import Slider from '@mui/material/Slider';
import {styled as _styled} from '@mui/material/styles';
import {useRequest} from 'ahooks';
import {Button, Checkbox, Input, message, Select, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {
  toggleOnlyShowHighPriorityChecked,
  toggleOnlyShowUnfinishedChecked
} from 'src/store/todos';
import {TodoItem} from 'src/types';
import styled from 'styled-components';

import TodoDrawer from '../todoDrawer/TodoDrawer';

const StyledSlider = _styled(Slider)({
  height: 3,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 16,
    height: 16,
    borderRadius: '50% 50% 50% 0',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': {display: 'none'},
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
});

const RedSlider = _styled(StyledSlider)({
  color: '#8c8c8c',
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#8c8c8c'
  }
});

const BlueSlider = _styled(StyledSlider)({
  color: '#448EF7',
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#448EF7'
  }
});

const GreenSlider = _styled(StyledSlider)({
  color: '#72C140',
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#72C140'
  }
});

const TodoList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [todoDrawerOpen, setTodoDrawerOpen] = useState(false);
  const [datasource, setDatasource] = useState<Array<TodoItem>>([]);

  const onlyShowUnfinishedChecked = useAppSelector(
    (state) => state.todos.onlyShowUnfinishedChecked
  );
  const onlyShowHighPriorityChecked = useAppSelector(
    (state) => state.todos.onlyShowHighPriorityChecked
  );

  const dispatch = useAppDispatch();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;

  const Wrapper = styled.div``;

  const onClickTitle = useCallback((row: any) => {
    setTodoDrawerOpen(true);
  }, []);

  const onTodoDrawerClose = useCallback(() => {
    setTodoDrawerOpen(false);
  }, []);

  const onClickPriority = useCallback(() => {
    console.log('点击优先级');
  }, []);

  const {run: getTodoLists} = useRequest(window.api.getTodoList, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.result) {
        setDatasource(res.result);
      }
    }
  });

  useEffect(() => {
    getTodoLists();
  }, []);

  const columns: ColumnsType<TodoItem> = useMemo(
    () => [
      {
        title: '事项',
        dataIndex: 'name',
        filters: [],
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value: string, record) => record.name.startsWith(value),
        width: '30%',
        render: (value) => (
          <span onClick={onClickTitle} style={{color: '#448EF7'}}>
            {value}
          </span>
        )
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        width: '60px',
        render: (value: number) => {
          let color = '#448EF7';
          switch (value) {
          case 0:
            color = '#EC5B56';
            break;
          case 1:
            color = '#EFB041';
            break;
          default:
            break;
          }
          // return <Tag color={color}>{'P' + value}</Tag>;
          return (
            <Select
              size="small"
              defaultValue={value}
              // onChange={handleChange}
              options={[
                {value: 0, label: '高'},
                {value: 1, label: '中'},
                {value: 2, label: '低'}
              ]}
            />
          );
        }
      },
      {
        title: '进度',
        dataIndex: 'progress',
        width: '80px',
        render: (value: number) => {
          const props: any = {
            defaultValue: value,
            'ria-label': 'Default',
            valueLabelDisplay: 'auto'
          };
          return value === 100 ? (
            <GreenSlider {...props} />
          ) : value > 50 ? (
            <BlueSlider {...props} />
          ) : (
            <RedSlider {...props} />
          );
        }
      },
      {
        title: '创建时间',
        dataIndex: 'age',
        width: '60px',
        align: 'center',
        render: () => <span onClick={onClickPriority}>2小时前</span>
      },
      {
        title: '修改时间',
        dataIndex: 'age',
        width: '60px',
        align: 'center',
        render: () => <span onClick={onClickPriority}>3天前</span>
      }
    ],
    []
  );

  const onClickBtn = useCallback(() => {
    window.api.createTodo().then((res) => {
      console.log('res', res);
    });
  }, []);

  const onCreateTodo = useCallback((e) => {
    window.api
      .createTodo({
        name: e.target.value
      })
      .then((res) => {
        if (res.changes) {
          message.success('创建成功');
          getTodoLists();
        }
      });
    e.target.value = '';
  }, []);

  const filteredDatasource = useMemo(() => {
    let arr = datasource;
    if (onlyShowUnfinishedChecked) {
      arr = arr.filter((item) => {
        return item.progress !== 100;
      });
    }
    if (onlyShowHighPriorityChecked) {
      arr = arr.filter((item) => {
        return item.priority === 0;
      });
    }
    return arr;
  }, [datasource, onlyShowUnfinishedChecked, onlyShowHighPriorityChecked]);

  const onOnlyShowUnfinishedCheckboxChange = useCallback(() => {
    dispatch(toggleOnlyShowUnfinishedChecked());
  }, []);

  const onOnlyShowHighPriorityCheckboxChange = useCallback(() => {
    dispatch(toggleOnlyShowHighPriorityChecked());
  }, []);

  return (
    <Wrapper className="todo-list">
      <div className="action-bar-wrapper">
        <div className="left-actions-wrapper">
          <Input
            size="middle"
            placeholder="+ 输入待办任务，点击回车即可创建"
            className="w-400 create-todo-input"
            onPressEnter={onCreateTodo}
          />
        </div>
        <div className="right-actions-wrapper">
          <Checkbox
            checked={onlyShowUnfinishedChecked}
            onChange={onOnlyShowUnfinishedCheckboxChange}
          >
            只显示未完成
          </Checkbox>
          <Checkbox
            checked={onlyShowHighPriorityChecked}
            onChange={onOnlyShowHighPriorityCheckboxChange}
          >
            只显示高优先级
          </Checkbox>
          <Button type="primary" onClick={onClickBtn} className="ml-10">
            批量设置
          </Button>
          <Button danger onClick={onClickBtn} className="ml-10">
            批量删除
          </Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowKey="id"
        dataSource={filteredDatasource}
        size="middle"
        pagination={false}
        rowClassName="todo-item-row"
      />

      <TodoDrawer
        open={todoDrawerOpen}
        onClose={onTodoDrawerClose}
      ></TodoDrawer>
    </Wrapper>
  );
};

export default TodoList;

import './todoList.less';

import {PlusOutlined} from '@ant-design/icons';
import Slider, {
  SliderThumb,
  SliderValueLabelProps
} from '@mui/material/Slider';
import {styled as _styled} from '@mui/material/styles';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Dropdown,
  Input,
  Select,
  Table,
  Tag
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';

import TodoDrawer from '../todoDrawer/TodoDrawer';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  priority: number;
  progress: number;
}

const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    priority: Math.floor(Math.random() * 2) + 1,
    progress: Math.floor(Math.random() * 100) + 1,
    // progress: 100,
    address: `London, Park Lane no. ${i}`
  });
}

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
  const [loading, setLoading] = useState(false);
  const [todoDrawerOpen, setTodoDrawerOpen] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

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

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: '事项',
        dataIndex: 'name',
        filters: [],
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value: string, record) => record.name.startsWith(value),
        width: '30%',
        render: () => <span onClick={onClickTitle}>标题</span>
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
    console.log('点击按钮');
    window.api.createTodo().then((res) => {
      console.log('res', res);
    });
  }, []);

  useEffect(() => {
    window.api.getTodoList().then((res: any) => {
      console.log('res', res);
    });
  }, []);

  return (
    <Wrapper className="todo-list">
      <div className="action-bar-wrapper">
        <div className="left-actions-wrapper">
          <Input
            size="middle"
            placeholder="+ 输入待办任务，点击回车即可创建"
            className="w-400 create-todo-input"
          />
        </div>
        <div className="right-actions-wrapper">
          <Checkbox>只显示未完成</Checkbox>
          <Checkbox>只显示高优先级</Checkbox>
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
        dataSource={data}
        size="middle"
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

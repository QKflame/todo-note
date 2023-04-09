import './todoList.less';

import {Button, ConfigProvider, Slider, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

import TodoDrawer from '../todoDrawer/TodoDrawer';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  });
}

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
        dataIndex: 'age',
        width: '100px',
        render: () => <span onClick={onClickPriority}>优先级</span>
      },
      {
        title: '进度',
        dataIndex: 'address',
        width: '200px',
        render: () => (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: 'red'
              }
            }}
          >
            <Slider defaultValue={30} />
          </ConfigProvider>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'age',
        width: '180px',
        align: 'center',
        render: () => <span onClick={onClickPriority}>2023-04-08 19:55</span>
      },
      {
        title: '修改时间',
        dataIndex: 'age',
        width: '180px',
        align: 'center',
        render: () => <span onClick={onClickPriority}>2023-04-08 19:55</span>
      }
    ],
    []
  );

  return (
    <Wrapper className="todo-list">
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

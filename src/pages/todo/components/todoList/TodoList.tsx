import './todoList.less';

import {Button, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

import TodoDrawer from '../todoDrawer/TodoDrawer';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
];

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

  const onClickRow = useCallback((row: any) => {
    setTodoDrawerOpen(true);
  }, []);

  const onTodoDrawerClose = useCallback(() => {
    setTodoDrawerOpen(false);
  }, []);

  return (
    <Wrapper className="todo-list">
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        size="middle"
        rowClassName="todo-item-row"
        onRow={(row) => {
          return {
            onClick: () => onClickRow(row)
          };
        }}
      />

      <TodoDrawer
        open={todoDrawerOpen}
        onClose={onTodoDrawerClose}
      ></TodoDrawer>
    </Wrapper>
  );
};

export default TodoList;

import './todoList.less';

import {
  AlertOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  FieldTimeOutlined,
  RetweetOutlined,
  RocketOutlined,
  UndoOutlined
} from '@ant-design/icons';
import {useRequest} from 'ahooks';
import {
  Alert,
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Progress,
  Result,
  Segmented,
  Slider,
  Table,
  Tag,
  TreeSelect
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import {cloneDeep, debounce, orderBy, throttle} from 'lodash';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {isTrashSelector} from 'src/store/group';
import {
  resetTodoDetail,
  setTodoDetail,
  toggleIsTodoDrawerOpened
} from 'src/store/todos';
import {TodoItem} from 'src/types';
import {Priority} from 'src/utils/priority';
import {
  convertGroupList,
  convertTimestampToDuration,
  formatTimestamp,
  formatTodoDeadline
} from 'src/utils/util';

import TodoDrawer from '../todoDrawer/TodoDrawer';

const TableEmpty = () => (
  <Result
    status="404"
    title={<div style={{fontSize: 14}}>暂无数据</div>}
    subTitle="暂未查询到相关待办事项"
  />
);

const TodoList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [datasource, setDatasource] = useState<Array<TodoItem>>([]);
  const [todoName, setTodoName] = useState('');

  const [batchRemoveOpened, setBatchRemoveOpened] = useState(false);

  const [batchRemoveForm] = Form.useForm();

  // 只显示未完成
  const onlyShowUnfinishedChecked = useAppSelector(
    (state) => state.todos.onlyShowUnfinishedChecked
  );

  const isTrash = useAppSelector(isTrashSelector);

  // 只显示高优先级
  const onlyShowHighPriorityChecked = useAppSelector(
    (state) => state.todos.onlyShowHighPriorityChecked
  );

  // 控制抽屉是否显示
  const isTodoDrawerOpened = useAppSelector(
    (state) => state.todos.isTodoDrawerOpened
  );

  // 当前打开抽屉的 todo
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);

  const currentTodoGroupId = useAppSelector(
    (state) => state.group.currentTodoGroupId
  );

  const dispatch = useAppDispatch();

  // 监听选中
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(cloneDeep(newSelectedRowKeys));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  // 监听点击 title
  const onClickTitle = useCallback(
    (row: TodoItem) => {
      if (isTrash) {
        return;
      }
      // 获取 todo 的详细信息
      window.api.getTodoDetail({id: row.id}).then((res) => {
        dispatch(setTodoDetail(res));
        dispatch(toggleIsTodoDrawerOpened());
      });
    },
    [dispatch, isTrash]
  );

  const {run: queryTodoList, loading: isTableLoading} = useRequest(
    window.api.getTodoList,
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res?.result) {
          setDatasource(res.result);
        }
      }
    }
  );

  const getTodoList = useCallback(() => {
    queryTodoList({groupId: currentTodoGroupId});
  }, [currentTodoGroupId, queryTodoList]);

  const onTodoDrawerClose = useCallback(() => {
    dispatch(toggleIsTodoDrawerOpened());
    dispatch(resetTodoDetail());
    getTodoList();
  }, [dispatch, getTodoList]);

  useEffect(() => {
    getTodoList();
  }, [getTodoList]);

  const onSaveSuccess = useCallback(() => {
    getTodoList();
  }, [getTodoList]);

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
    return isTrash
      ? orderBy(arr, ['deleteTime'], ['desc'])
      : orderBy(arr, ['id'], ['desc']);
  }, [
    datasource,
    onlyShowUnfinishedChecked,
    onlyShowHighPriorityChecked,
    isTrash
  ]);

  // 监听优先级发生变化
  const onPriorityChange = useCallback(
    (id: number, value: number) => {
      window.api.updateTodoPriority({id, priority: value}).then((res) => {
        if (res.changes === 1) {
          getTodoList();
        }
      });
    },
    [getTodoList]
  );

  // 监听进度发生变化
  const onProgressChange = debounce((value: number, id: number) => {
    window.api.updateTodoProgress({id, progress: value}).then((res) => {
      if (res.changes === 1) {
        getTodoList();
      }
    });
  }, 0);

  // 监听确认选择截止时间
  const onConfirmSelectDeadline = useCallback(
    (e, id) => {
      const timestamp = new Date(e.$d).getTime();
      window.api.updateTodoDeadline({id, deadline: timestamp}).then((res) => {
        if (res.changes === 1) {
          getTodoList();
        }
      });
    },
    [getTodoList]
  );

  // 监听  deadline 发生变化
  const onDeadlineChange = useCallback(
    (e, id) => {
      if (e === null) {
        window.api.updateTodoDeadline({id, deadline: null}).then((res) => {
          if (res.changes === 1) {
            getTodoList();
          }
        });
      }
    },
    [getTodoList]
  );

  const columns: ColumnsType<TodoItem> = useMemo(
    () => [
      {
        title: '事项',
        dataIndex: 'name',
        filters: filteredDatasource.map((item) => {
          return {
            text: item.name,
            value: item.id
          };
        }),
        filterSearch: true,
        onFilter: (value: number, record) => {
          return record.id === value;
        },
        width: ' 160px',
        textWrap: 'word-break',
        ellipsis: true,
        render: (value, item: TodoItem) => (
          <span
            onClick={() => onClickTitle(item)}
            style={{
              color: '#448EF7',
              display: 'block',
              width: '100%',
              paddingRight: '60px',
              whiteSpace: 'nowrap',
              wordBreak: 'break-all',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '32px',
              lineHeight: '32px',
              fontSize: 13
            }}
          >
            {value}
          </span>
        )
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        width: '60px',
        align: 'center',
        filters: [
          {
            text: Priority.highText,
            value: Priority.high
          },
          {
            text: Priority.middleText,
            value: Priority.middle
          },
          {
            text: Priority.lowText,
            value: Priority.low
          }
        ],
        filterSearch: true,
        onFilter: (value: number, record) => {
          return record.priority === value;
        },
        render: (value: number, item: TodoItem) => {
          const isHigh = Priority.isHigh(value);
          const isMiddle = Priority.isMiddle(value);
          return isTrash ? (
            <Tag
              icon={
                isHigh ? (
                  <AlertOutlined />
                ) : isMiddle ? (
                  <RocketOutlined />
                ) : (
                  <CoffeeOutlined />
                )
              }
              color={Priority.getColorTypeByValue(value)}
            >
              {Priority.getTextByValue(value)}
            </Tag>
          ) : (
            <Popover
              overlayClassName="priority-popover-container"
              content={
                <Segmented
                  value={value}
                  options={[
                    {
                      label: (
                        <Tag
                          icon={<CoffeeOutlined />}
                          color={Priority.lowColorType}
                        >
                          {Priority.lowText}
                        </Tag>
                      ),
                      value: Priority.low
                    },
                    {
                      label: (
                        <Tag
                          icon={<RocketOutlined />}
                          color={Priority.middleColorType}
                        >
                          {Priority.middleText}
                        </Tag>
                      ),
                      value: Priority.middle
                    },
                    {
                      label: (
                        <Tag
                          icon={<AlertOutlined />}
                          color={Priority.highColorType}
                        >
                          {Priority.highText}
                        </Tag>
                      ),
                      value: Priority.high
                    }
                  ]}
                  onChange={(v: number) => {
                    onPriorityChange(item.id, v);
                  }}
                />
              }
              title="设置优先级"
              trigger="hover"
            >
              <Tag
                icon={
                  value === 0 ? (
                    <AlertOutlined />
                  ) : value === 1 ? (
                    <RocketOutlined />
                  ) : (
                    <CoffeeOutlined />
                  )
                }
                color={
                  value === 0 ? 'error' : value === 1 ? 'warning' : 'default'
                }
              >
                {value === 0 ? '紧急' : value === 1 ? '重要' : '一般'}
              </Tag>
            </Popover>
          );
        }
      },
      {
        title: '进度',
        dataIndex: 'progress',
        width: '40px',
        align: 'center',
        filters: [
          {
            text: '未开始',
            value: 0
          },
          {
            text: '进行中',
            value: 1
          },
          {
            text: '已完成',
            value: 100
          }
        ],
        filterSearch: true,
        onFilter: (value: number, record) => {
          if (value === 1) {
            return record.progress > 0 && record.progress < 100;
          }
          return record.progress === value;
        },
        render: (value: number, item: TodoItem) => {
          return isTrash ? (
            <Progress
              type="circle"
              percent={value}
              size={20}
              showInfo={false}
            />
          ) : (
            <Popover
              content={
                <div className="progress-popover-container">
                  <Slider
                    value={value}
                    onChange={(v: number) => onProgressChange(v, item.id)}
                  />
                </div>
              }
              title="设置进度"
              trigger="hover"
            >
              <div
                onClick={() => {
                  if (value >= 0 && value < 50) {
                    onProgressChange(50, item.id);
                    return;
                  }

                  if (value >= 50 && value < 100) {
                    onProgressChange(100, item.id);
                    return;
                  }

                  onProgressChange(0, item.id);
                }}
              >
                <Progress
                  type="circle"
                  percent={value}
                  size={20}
                  showInfo={false}
                />
              </div>
            </Popover>
          );
        }
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        width: '60px',
        render: (value, item: TodoItem) => {
          return isTrash ? (
            <div style={{fontSize: 12, color: 'gray', display: 'inline'}}>
              <FieldTimeOutlined />
              <span style={{marginLeft: '6px'}}>
                {formatTodoDeadline(value)}
              </span>
            </div>
          ) : (
            <Popover
              content={
                <DatePicker
                  {...(value
                    ? {
                      defaultValue: dayjs(value)
                    }
                    : {})}
                  placeholder="请选择截止时间"
                  showTime
                  onOk={(v) => onConfirmSelectDeadline(v, item.id)}
                  onChange={(v) => onDeadlineChange(v, item.id)}
                />
              }
              title="截止时间"
              trigger="hover"
            >
              <div style={{fontSize: 12, color: 'gray', display: 'inline'}}>
                <FieldTimeOutlined />
                <span style={{marginLeft: '6px'}}>
                  {item.progress === 100 ? '已完成' : formatTodoDeadline(value)}
                </span>
              </div>
            </Popover>
          );
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '60px',
        render: (value) => {
          return (
            <Popover
              content={formatTimestamp(value)}
              title="创建时间"
              trigger="hover"
            >
              <div style={{fontSize: 12, color: 'gray', display: 'inline'}}>
                <ClockCircleOutlined />
                <span style={{marginLeft: '6px'}}>
                  {convertTimestampToDuration(value)}
                </span>
              </div>
            </Popover>
          );
        }
      },
      ...(isTrash
        ? []
        : [
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            width: '60px',
            render: (value: number) => {
              return (
                <Popover
                  content={formatTimestamp(value)}
                  title="修改时间"
                  trigger="hover"
                >
                  <div
                    style={{fontSize: 12, color: 'gray', display: 'inline'}}
                  >
                    <ClockCircleOutlined />
                    <span style={{marginLeft: '6px'}}>
                      {convertTimestampToDuration(value)}
                    </span>
                  </div>
                </Popover>
              );
            }
          }
        ]),
      ...(!isTrash
        ? []
        : [
          {
            title: '删除时间',
            dataIndex: 'deleteTime',
            width: '60px',
            render: (value: number) => {
              return (
                <Popover
                  content={formatTimestamp(value)}
                  title="删除时间"
                  trigger="hover"
                >
                  <div
                    style={{fontSize: 12, color: 'gray', display: 'inline'}}
                  >
                    <ClockCircleOutlined />
                    <span style={{marginLeft: '6px'}}>
                      {convertTimestampToDuration(value)}
                    </span>
                  </div>
                </Popover>
              );
            }
          }
        ])
    ],
    [
      filteredDatasource,
      isTrash,
      onClickTitle,
      onConfirmSelectDeadline,
      onDeadlineChange,
      onPriorityChange,
      onProgressChange
    ]
  );

  // 点击批量完成按钮
  const onClickBatchFinish = throttle(
    () => {
      if (!selectedRowKeys.length) {
        message.warning('请选择待办事项');
        return;
      }
      Modal.confirm({
        title: '批量完成',
        content: '是否批量完成已选择的待办事项？',
        okText: '确认',
        cancelText: '取消',
        icon: <CheckCircleFilled style={{color: '#72C240'}} />,
        onOk: () => {
          window.api.batchFinishTodo({ids: selectedRowKeys}).then(() => {
            message.success('操作成功');
            setSelectedRowKeys([]);
            getTodoList();
          });
        }
      });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  /** 点击批量移动 */
  const onClickBatchRemove = throttle(
    () => {
      if (!selectedRowKeys.length) {
        message.warning('请选择待办事项');
        return;
      }
      setBatchRemoveOpened(true);
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 点击批量删除按钮
  const onClickBatchDelete = throttle(
    () => {
      if (!selectedRowKeys.length) {
        message.warning('请选择待办事项');
        return;
      }
      if (isTrash) {
        Modal.confirm({
          title: '批量删除',
          content: (
            <div>
              <div style={{marginBottom: 10}}>
                是否批量删除已选择的待办事项？
              </div>
              <Alert
                message="在废纸篓中进行删除后，无法恢复，请谨慎操作!"
                type="error"
              />
            </div>
          ),
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            window.api
              .batchDeleteTodo({ids: selectedRowKeys, hard: true})
              .then(() => {
                message.success('删除成功');
                setSelectedRowKeys([]);
                getTodoList();
              });
          }
        });
        return;
      }
      Modal.confirm({
        title: '批量删除',
        content: (
          <div>
            <div style={{marginBottom: 10}}>
              是否批量删除已选择的待办事项？
            </div>
            <Alert message="删除之后可在废纸篓中进行恢复" type="info" />
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          window.api.batchDeleteTodo({ids: selectedRowKeys}).then(() => {
            message.success('删除成功');
            setSelectedRowKeys([]);
            getTodoList();
          });
        }
      });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 点击批量恢复按钮
  const onClickBatchRecover = throttle(
    () => {
      if (!selectedRowKeys.length) {
        message.warning('请选择待办事项');
        return;
      }

      Modal.confirm({
        title: '批量恢复',
        content: (
          <div>
            <div style={{marginBottom: 10}}>
              是否批量恢复已选择的待办事项？
            </div>
            <Alert
              message="若待办事项所属分组已被删除，则恢复至 「近期待办」 分组中，若未被删除，则恢复至原分组中。"
              type="info"
            />
          </div>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          window.api.batchRecoverTodo({ids: selectedRowKeys}).then(() => {
            message.success('恢复成功');
            setSelectedRowKeys([]);
            getTodoList();
          });
        }
      });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  const onCreateTodo = useCallback(
    (e) => {
      if (!e?.target?.value?.trim?.()) {
        return;
      }
      window.api
        .createTodo({
          name: e.target.value.trim(),
          groupId: currentTodoGroupId
        })
        .then((res) => {
          if (res.changes) {
            message.success('创建成功');
            getTodoList();
            setTodoName('');
          }
        });
      e.target.value = '';
    },
    [currentTodoGroupId, getTodoList]
  );

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [currentTodoGroupId]);

  const onTodoNameChange = useCallback((e) => {
    setTodoName(e.target.value);
  }, []);

  const [removeGroup, setRemoveGroup] = useState<string>();

  /** 监听点击确认批量移动按钮 */
  const onConfirmBatchRemove = throttle(
    () => {
      if (!removeGroup) {
        message.warning('请选择移动分组');
        return;
      }

      window.api
        .batchRemoveGroup({ids: selectedRowKeys, groupId: removeGroup})
        .then(() => {
          setRemoveGroup('');
          batchRemoveForm.resetFields();
          message.success('移动成功');
          onCancelBatchRemove();
          getTodoList();
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  /** 监听点击取消批量移动按钮 */
  const onCancelBatchRemove = useCallback(() => {
    setBatchRemoveOpened(false);
  }, []);

  const groups = useAppSelector((state) => state.group.todoGroups);

  const groupList = useMemo(() => {
    return convertGroupList(groups, currentTodoGroupId);
  }, [currentTodoGroupId, groups]);

  const onRemoveGroupChange = useCallback((newValue: string) => {
    setRemoveGroup(newValue);
  }, []);

  const filterTreeNode = useCallback((inputValue, treeNode) => {
    return treeNode?.title?.includes(inputValue);
  }, []);

  const handleSwitchLeft = useCallback(() => {
    const currentTodoId = todoDetail.id;
    const index = filteredDatasource.findIndex(
      (item) => item.id === currentTodoId
    );
    let targetTodoId = -1;
    const length = filteredDatasource.length;
    if (index === 0) {
      targetTodoId = filteredDatasource[length - 1].id;
    } else if (index === length - 1) {
      targetTodoId = filteredDatasource[0].id;
    } else {
      targetTodoId = filteredDatasource[index - 1].id;
    }
    window.api.getTodoDetail({id: targetTodoId}).then((res) => {
      dispatch(setTodoDetail(res));
    });
  }, [dispatch, filteredDatasource, todoDetail.id]);

  const [tableHeight, setTableHeight] = useState(null);

  useEffect(() => {
    const updateTableHeight = throttle(() => {
      const innerHeight = window.innerHeight;
      const headerHeight = 60;
      const pagePadding = 2 * 20;
      const toolbarHeight = 56;
      const tableHeaderHeight = 48;
      setTableHeight(
        innerHeight -
          headerHeight -
          pagePadding -
          toolbarHeight -
          tableHeaderHeight -
          10
      );
    }, 300);

    updateTableHeight();

    window.addEventListener('resize', updateTableHeight);

    return () => {
      window.removeEventListener('resize', updateTableHeight);
    };
  }, []);

  const handleSwitchRight = useCallback(() => {}, []);

  return (
    <div className="todo-list">
      <div className="action-bar-wrapper">
        {!isTrash && (
          <div className="left-actions-wrapper">
            <Input
              size="middle"
              placeholder="+ 输入待办任务，点击回车即可创建"
              className="w-400 create-todo-input"
              onPressEnter={onCreateTodo}
              value={todoName}
              onChange={onTodoNameChange}
            />
          </div>
        )}
        <div className="right-actions-wrapper">
          {!isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchRemove}
              className="ml-10"
              icon={<RetweetOutlined />}
            >
              批量移动
            </Button>
          )}
          {!isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchFinish}
              className="ml-10"
              icon={<CheckOutlined />}
            >
              批量完成
            </Button>
          )}
          {isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchRecover}
              className="ml-10"
              icon={<UndoOutlined />}
            >
              批量恢复
            </Button>
          )}
          <Button
            danger
            onClick={onClickBatchDelete}
            className="ml-10"
            icon={<ClearOutlined />}
          >
            批量删除
          </Button>
        </div>
      </div>

      {isTrash && (
        <Alert
          showIcon
          type="warning"
          message="废纸篓中的数据不可设置内容、优先级及进度等信息，若要设置，请恢复之后进行操作。"
          style={{marginBottom: 20}}
        ></Alert>
      )}

      <ConfigProvider>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          rowKey="id"
          dataSource={filteredDatasource}
          size="middle"
          pagination={false}
          // loading={isTableLoading}
          scroll={{
            y: tableHeight
          }}
          rowClassName={(record) => {
            let className = ['todo-item-row'];
            if (record.id === todoDetail.id) {
              className = ['selected-todo-item-row'];
            }
            className.push(Priority.getRowClassNameByValue(record.priority));
            return className.join(' ');
          }}
        />
      </ConfigProvider>

      <TodoDrawer
        open={isTodoDrawerOpened}
        onClose={onTodoDrawerClose}
        onSaveSuccess={onSaveSuccess}
        onSwitchLeft={handleSwitchLeft}
        onSwitchRight={handleSwitchRight}
      ></TodoDrawer>

      <Modal
        title="移动分组"
        open={batchRemoveOpened}
        onOk={onConfirmBatchRemove}
        onCancel={onCancelBatchRemove}
      >
        <Form
          name="editGroupForm"
          colon={false}
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{maxWidth: 600, marginTop: 20}}
          autoComplete="off"
          form={batchRemoveForm}
        >
          <Form.Item label="移动到" name="group">
            <TreeSelect
              showSearch
              value={removeGroup}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="请选择移动分组"
              allowClear
              treeDefaultExpandAll
              onChange={onRemoveGroupChange}
              treeData={groupList}
              filterTreeNode={filterTreeNode}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(TodoList);

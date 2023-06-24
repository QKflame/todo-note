import './todoList.less';

import {
  AlertOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  RocketOutlined
} from '@ant-design/icons';
import {useRequest} from 'ahooks';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Progress,
  Segmented,
  Slider,
  Table,
  Tag,
  Tree,
  TreeSelect
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {cloneDeep, debounce, orderBy, throttle} from 'lodash';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {isTrashSelector} from 'src/store/plan';
import {
  resetTodoDetail,
  setTodoDetail,
  toggleIsTodoDrawerOpened,
  toggleOnlyShowHighPriorityChecked,
  toggleOnlyShowUnfinishedChecked
} from 'src/store/todos';
import {TodoItem} from 'src/types';
import {
  convertPlanList,
  convertTimestampToDuration,
  formatTimestamp
} from 'src/utils/util';

import TodoDrawer from '../todoDrawer/TodoDrawer';

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

  const currentPlanId = useAppSelector((state) => state.plan.currentPlanId);

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
    (row: any) => {
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

  const onTodoDrawerClose = useCallback(() => {
    dispatch(toggleIsTodoDrawerOpened());
    dispatch(resetTodoDetail());
  }, [dispatch]);

  const {run: queryTodoLists} = useRequest(window.api.getTodoList, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.result) {
        setDatasource(res.result);
      }
    }
  });

  const getTodoLists = useCallback(() => {
    queryTodoLists({planId: currentPlanId});
  }, [currentPlanId, queryTodoLists]);

  useEffect(() => {
    getTodoLists();
  }, [getTodoLists]);

  const onSaveSuccess = useCallback(() => {
    getTodoLists();
  }, [getTodoLists]);

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
          getTodoLists();
        }
      });
    },
    [getTodoLists]
  );

  // 监听进度发生变化
  const onProgressChange = debounce((value: number, id: number) => {
    window.api.updateTodoProgress({id, progress: value}).then((res) => {
      if (res.changes === 1) {
        getTodoLists();
      }
    });
  }, 500);

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
        filters: [
          {
            text: '紧急',
            value: 0
          },
          {
            text: '重要',
            value: 1
          },
          {
            text: '一般',
            value: 2
          }
        ],
        filterSearch: true,
        onFilter: (value: number, record) => {
          return record.priority === value;
        },
        render: (value: number, item: TodoItem) => {
          return isTrash ? (
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
          ) : (
            <Popover
              content={
                <Segmented
                  value={value}
                  options={[
                    {
                      label: (
                        <Tag icon={<CoffeeOutlined />} color="default">
                          一般
                        </Tag>
                      ),
                      value: 2
                    },
                    {
                      label: (
                        <Tag icon={<RocketOutlined />} color="warning">
                          重要
                        </Tag>
                      ),
                      value: 1
                    },
                    {
                      label: (
                        <Tag icon={<AlertOutlined />} color="error">
                          紧急
                        </Tag>
                      ),
                      value: 0
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
        width: '30px',
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
                <Slider
                  defaultValue={value}
                  onChange={(v: number) => onProgressChange(v, item.id)}
                />
              }
              title="设置进度"
              trigger="hover"
            >
              <Progress
                type="circle"
                percent={value}
                size={20}
                showInfo={false}
              />
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
            getTodoLists();
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
                getTodoLists();
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
            getTodoLists();
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
            getTodoLists();
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
      window.api
        .createTodo({
          name: e.target.value,
          planId: currentPlanId
        })
        .then((res) => {
          if (res.changes) {
            message.success('创建成功');
            getTodoLists();
            setTodoName('');
          }
        });
      e.target.value = '';
    },
    [currentPlanId, getTodoLists]
  );

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [currentPlanId]);

  // const onOnlyShowUnfinishedCheckboxChange = useCallback(() => {
  //   dispatch(toggleOnlyShowUnfinishedChecked());
  // }, [dispatch]);

  // const onOnlyShowHighPriorityCheckboxChange = useCallback(() => {
  //   dispatch(toggleOnlyShowHighPriorityChecked());
  // }, [dispatch]);

  const onTodoNameChange = useCallback((e) => {
    setTodoName(e.target.value);
  }, []);

  const [removeGroup, setRemoveGroup] = useState<string>();

  /** 监听点击确认批量移动按钮 */
  const onConfirmBatchRemove = useCallback(
    throttle(
      () => {
        if (!removeGroup) {
          message.warning('请选择移动分组');
          return;
        }

        window.api
          .batchRemoveGroup({ids: selectedRowKeys, planId: removeGroup})
          .then((res) => {
            setRemoveGroup('');
            batchRemoveForm.resetFields();
            message.success('移动成功');
            onCancelBatchRemove();
            getTodoLists();
          });
      },
      3000,
      {
        leading: true,
        trailing: false
      }
    ),
    [removeGroup]
  );

  /** 监听点击取消批量移动按钮 */
  const onCancelBatchRemove = useCallback(() => {
    setBatchRemoveOpened(false);
  }, []);

  const plans = useAppSelector((state) => state.plan.plans);

  const planList = useMemo(() => {
    return convertPlanList(plans, currentPlanId);
  }, [currentPlanId, plans]);

  const onRemoveGroupChange = useCallback((newValue: string) => {
    setRemoveGroup(newValue);
  }, []);

  const filterTreeNode = useCallback((inputValue, treeNode) => {
    return treeNode?.title?.includes(inputValue);
  }, []);

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
          {/* <Checkbox
            checked={onlyShowUnfinishedChecked}
            onChange={onOnlyShowUnfinishedCheckboxChange}
          >
            未完成
          </Checkbox>
          <Checkbox
            checked={onlyShowHighPriorityChecked}
            onChange={onOnlyShowHighPriorityCheckboxChange}
          >
            高优先级
          </Checkbox> */}
          {/* <Button type="primary" onClick={onClickBtn} className="ml-10">
            批量设置
          </Button> */}
          {!isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchRemove}
              className="ml-10"
            >
              批量移动
            </Button>
          )}
          {!isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchFinish}
              className="ml-10"
            >
              批量完成
            </Button>
          )}
          {isTrash && (
            <Button
              type="primary"
              onClick={onClickBatchRecover}
              className="ml-10"
            >
              批量恢复
            </Button>
          )}
          <Button danger onClick={onClickBatchDelete} className="ml-10">
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

      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowKey="id"
        dataSource={filteredDatasource}
        size="middle"
        pagination={false}
        rowClassName={(record) => {
          if (record.id === todoDetail.id) {
            return 'selected-todo-item-row';
          }
          return 'todo-item-row';
        }}
      />

      <TodoDrawer
        open={isTodoDrawerOpened}
        onClose={onTodoDrawerClose}
        onSaveSuccess={onSaveSuccess}
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
              treeData={planList}
              filterTreeNode={filterTreeNode}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(TodoList);

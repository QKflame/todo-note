import './groupMenu.less';

import {
  EllipsisOutlined,
  PlusOutlined,
  RestOutlined
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  MenuProps,
  message,
  Modal
} from 'antd';
import cx from 'classnames';
import {isNull, throttle} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import usePageType from 'src/hooks/usePageType';
import {
  setCurrentNoteGroupId,
  setCurrentTodoGroupId,
  setNoteGroups,
  setTodoGroups
} from 'src/store/group';
import {buildTree, findObjectById} from 'src/utils/util';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const GroupMenu: React.FC = () => {
  const currentTodoGroupId = useAppSelector(
    (state) => state.group.currentTodoGroupId
  );
  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );
  const {isTodo, isNote} = usePageType();
  const todoGroups = useAppSelector((state) => state.group.todoGroups);
  const noteGroups = useAppSelector((state) => state.group.noteGroups);
  const groups = isTodo ? todoGroups : noteGroups;
  const dispatch = useAppDispatch();

  const [selectedKeys, setSelectedKeys] = useState([
    isTodo ? currentTodoGroupId.toString() : currentNoteGroupId.toString()
  ]);

  const [createGroupOpened, setCreateGroupOpened] = useState(false);
  const [createSubGroupOpened, setCreateSubGroupOpened] = useState(false);
  const [editGroupOpened, setEditGroupOpened] = useState(false);

  const [createGroupForm] = Form.useForm();
  const [createSubGroupForm] = Form.useForm();
  const [editGroupForm] = Form.useForm();

  const onClickMenuItem = useCallback(
    (key) => {
      if (isTodo && key === currentTodoGroupId) {
        return;
      }
      if (isNote && key === currentNoteGroupId) {
        return;
      }

      if (isTodo) {
        dispatch(setCurrentTodoGroupId({groupId: key}));
      } else {
        dispatch(setCurrentNoteGroupId({groupId: key}));
      }
      setSelectedKeys([key.toString()]);
    },
    [currentNoteGroupId, currentTodoGroupId, dispatch, isNote, isTodo]
  );

  const getTodoGroupList = useCallback(() => {
    window.api.getTodoGroupList().then((res) => {
      if (res.result) {
        const tree = buildTree(
          res.result.map((item) => {
            return {
              ...item,
              id: item.id.toString(),
              parentId: isNull(item.parentId) ? null : item.parentId.toString()
            };
          })
        );
        dispatch(setTodoGroups({groups: tree}));
      }
    });
  }, [dispatch]);

  const getNoteGroupList = useCallback(() => {
    window.api.getNoteGroupList().then((res) => {
      if (res.result) {
        const tree = buildTree(
          res.result.map((item) => {
            return {
              ...item,
              id: item.id.toString(),
              parentId: isNull(item.parentId) ? null : item.parentId.toString()
            };
          })
        );
        dispatch(setNoteGroups({groups: tree}));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getTodoGroupList();
    getNoteGroupList();
  }, [getNoteGroupList, getTodoGroupList]);

  // 监听点击创建分组按钮
  const onClickCreateGroupBtn = useCallback(() => {
    setCreateGroupOpened(true);
  }, []);

  /** 监听删除分组 */
  const onDeleteGroup = useCallback(
    (groupId) => {
      Modal.confirm({
        title: '删除分组',
        content: (
          <div>
            <div style={{marginBottom: 10}}>是否确认删除当前分组？</div>
            <Alert
              message="当前分组下的待办事项也将被删除，可前往废纸篓进行恢复！"
              type="error"
            ></Alert>
          </div>
        ),
        onOk: () => {
          window.api.deleteTodoGroup({id: groupId}).then(() => {
            message.success('删除成功');
            if (isTodo) {
              getTodoGroupList();
              setSelectedKeys(['-1']);
              dispatch(setCurrentTodoGroupId({groupId: '-1'}));
              return;
            }
            if (isNote) {
              getNoteGroupList();
              setSelectedKeys(['-3']);
              dispatch(setCurrentTodoGroupId({groupId: '-3'}));
            }
          });
        }
      });
    },
    [dispatch, getNoteGroupList, getTodoGroupList, isNote, isTodo]
  );

  /** 监听编辑分组 */
  const onEditGroup = useCallback(() => {
    const groupDetail = findObjectById(
      groups,
      isTodo ? currentTodoGroupId : currentNoteGroupId
    );
    editGroupForm.setFieldValue('groupName', groupDetail.title);
    setEditGroupOpened(true);
  }, [currentNoteGroupId, currentTodoGroupId, editGroupForm, groups, isTodo]);

  /** 监听点击创建子分组 */
  const onCreateSubGroup = useCallback(() => {
    setCreateSubGroupOpened(true);
  }, []);

  const getGroupMenuItem = useCallback(
    (item) => {
      return getItem(
        <div
          className={cx('group-menu-item', {
            'active-group-menu-item': selectedKeys.indexOf(item.id) > -1,
            'active-group-menu-group-item':
              item?.children?.length && selectedKeys.indexOf(item.id) > -1
          })}
          key={item.id}
          onClick={() => onClickMenuItem(item.id)}
        >
          <div className="group-menu-name">{item.title}</div>
          <Dropdown
            overlayClassName="group-menu-dropdown-container"
            menu={{
              items: item?.children?.length
                ? [
                  {
                    key: 'editGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={onEditGroup}
                      >
                          编辑
                      </Button>
                    )
                  },
                  {
                    key: 'createGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={onCreateSubGroup}
                      >
                          创建
                      </Button>
                    )
                  }
                ]
                : [
                  {
                    key: 'editGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={onEditGroup}
                      >
                          编辑
                      </Button>
                    )
                  },
                  {
                    key: 'createGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={onCreateSubGroup}
                      >
                          创建
                      </Button>
                    )
                  },
                  {
                    key: 'deleteGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={() => onDeleteGroup(item.id)}
                      >
                          删除
                      </Button>
                    )
                  }
                ]
            }}
            placement="bottom"
            arrow={{pointAtCenter: true}}
          >
            {/* <HolderOutlined className="menu-action-btn" /> */}
            <EllipsisOutlined className="menu-action-btn" />
          </Dropdown>
        </div>,
        item.id.toString(),
        null,
        item?.children?.length ? item.children.map(getGroupMenuItem) : undefined
      );
    },
    [
      onClickMenuItem,
      onCreateSubGroup,
      onDeleteGroup,
      onEditGroup,
      selectedKeys
    ]
  );

  const getMenuItems = useCallback(() => {
    return [
      getItem(
        <div className="group-container">
          <div className="">个人分组</div>
          <PlusOutlined
            className="group-menu-add-btn"
            onClick={onClickCreateGroupBtn}
          />
        </div>,
        'personalGroup',
        null,
        [
          isTodo
            ? getItem(
              <div
                className="group-menu-item"
                key="-1"
                onClick={() => onClickMenuItem('-1')}
              >
                <div className="group-menu-name">近期待办</div>
              </div>,
              '-1'
            )
            : isNote
              ? getItem(
                <div
                  className="group-menu-item"
                  key="-3"
                  onClick={() => onClickMenuItem('-3')}
                >
                  <div className="group-menu-name">随手笔记</div>
                </div>,
                '-3'
              )
              : undefined,
          ...groups.map(getGroupMenuItem)
        ],
        'group'
      ),

      getItem(
        '系统分组',
        'systemGroup',
        null,
        [
          isTodo
            ? getItem(
              <div
                className="group-menu-item"
                key="-2"
                onClick={() => onClickMenuItem('-2')}
              >
                <div className="group-menu-name">废纸篓</div>
              </div>,
              '-2',
              <RestOutlined />
            )
            : isNote
              ? getItem(
                <div
                  className="group-menu-item"
                  key="-4"
                  onClick={() => onClickMenuItem('-4')}
                >
                  <div className="group-menu-name">废纸篓</div>
                </div>,
                '-4',
                <RestOutlined />
              )
              : undefined
        ],
        'group'
      )
    ];
  }, [
    onClickCreateGroupBtn,
    isTodo,
    isNote,
    groups,
    getGroupMenuItem,
    onClickMenuItem
  ]);

  // 确认创建分组
  const onConfirmCreateGroup = throttle(
    () => {
      const {groupName} = createGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      if (isTodo) {
        window.api
          .createTodoGroup({
            title: groupName
          })
          .then((res) => {
            if (res.changes === 1) {
              message.success('创建成功');
              onCancelCreateGroup();
              getTodoGroupList();
            }
          });
        return;
      }
      window.api
        .createNoteGroup({
          title: groupName
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            onCancelCreateGroup();
            getNoteGroupList();
          }
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 确认创建子分组
  const onConfirmCreateSubGroup = throttle(
    () => {
      const {groupName} = createSubGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      if (isTodo) {
        window.api
          .createTodoGroup({
            title: groupName,
            parentId: currentTodoGroupId
          })
          .then((res) => {
            if (res.changes === 1) {
              message.success('创建成功');
              onCancelCreateSubGroup();
              getTodoGroupList();
            }
          });
        return;
      }
      window.api
        .createNoteGroup({
          title: groupName,
          parentId: currentNoteGroupId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            onCancelCreateSubGroup();
            getNoteGroupList();
          }
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 确认修改分组
  const onConfirmEditGroup = throttle(
    () => {
      const {groupName} = editGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      const groupDetail = findObjectById(
        groups,
        isTodo ? currentTodoGroupId : currentNoteGroupId
      );
      if (isTodo) {
        window.api
          .updateTodoGroup({
            title: groupName,
            id: currentTodoGroupId,
            parentId: groupDetail.parentId
          })
          .then((res) => {
            if (res.changes === 1) {
              message.success('修改成功');
              onCancelEditGroup();
              getTodoGroupList();
            }
          });
        return;
      }
      window.api
        .updateNoteGroup({
          title: groupName,
          id: currentNoteGroupId,
          parentId: groupDetail.parentId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('修改成功');
            onCancelEditGroup();
            getNoteGroupList();
          }
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 取消创建分组
  const onCancelCreateGroup = useCallback(() => {
    createGroupForm.resetFields();
    setCreateGroupOpened(false);
  }, [createGroupForm]);

  // 取消创建子分组
  const onCancelCreateSubGroup = useCallback(() => {
    createSubGroupForm.resetFields();
    setCreateSubGroupOpened(false);
  }, [createSubGroupForm]);

  // 取消编辑分组
  const onCancelEditGroup = useCallback(() => {
    editGroupForm.resetFields();
    setEditGroupOpened(false);
  }, [editGroupForm]);

  return (
    <div className="group-menu-container" style={{width: 280}}>
      <Menu selectedKeys={selectedKeys} mode="inline" items={getMenuItems()} />
      <div className="divider"></div>

      <Modal
        title="创建分组"
        open={createGroupOpened}
        onOk={onConfirmCreateGroup}
        onCancel={onCancelCreateGroup}
      >
        <Form
          name="basic"
          colon={false}
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{maxWidth: 600, marginTop: 20}}
          autoComplete="off"
          form={createGroupForm}
        >
          <Form.Item label="分组名称" name="groupName">
            <Input
              style={{width: '100%'}}
              onPressEnter={onConfirmCreateGroup}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="创建分组"
        open={createSubGroupOpened}
        onOk={onConfirmCreateSubGroup}
        onCancel={onCancelCreateSubGroup}
      >
        <Form
          name="createSubGroupForm"
          colon={false}
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{maxWidth: 600, marginTop: 20}}
          autoComplete="off"
          form={createSubGroupForm}
        >
          <Form.Item label="分组名称" name="groupName">
            <Input
              style={{width: '100%'}}
              onPressEnter={onConfirmCreateSubGroup}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑分组"
        open={editGroupOpened}
        onOk={onConfirmEditGroup}
        onCancel={onCancelEditGroup}
      >
        <Form
          name="editGroupForm"
          colon={false}
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{maxWidth: 600, marginTop: 20}}
          autoComplete="off"
          form={editGroupForm}
        >
          <Form.Item label="分组名称" name="groupName">
            <Input
              style={{width: '100%'}}
              onPressEnter={onConfirmEditGroup}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupMenu;

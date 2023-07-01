import './groupMenu.less';

import {HolderOutlined, PlusOutlined, RestOutlined} from '@ant-design/icons';
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
import {setCurrentGroupId, setGroups} from 'src/store/group';
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
  const currentGroupId = useAppSelector((state) => state.group.currentGroupId);
  const groups = useAppSelector((state) => state.group.groups);
  const dispatch = useAppDispatch();

  const [selectedKeys, setSelectedKeys] = useState([currentGroupId.toString()]);

  const [createGroupOpened, setCreateGroupOpened] = useState(false);
  const [createSubGroupOpened, setCreateSubGroupOpened] = useState(false);
  const [editGroupOpened, setEditGroupOpened] = useState(false);

  const [createGroupForm] = Form.useForm();
  const [createSubGroupForm] = Form.useForm();
  const [editGroupForm] = Form.useForm();

  const onClickMenuItem = useCallback(
    (key) => {
      if (key === currentGroupId) {
        return;
      }
      dispatch(setCurrentGroupId({groupId: key}));
      setSelectedKeys([key.toString()]);
    },
    [currentGroupId, dispatch]
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
        dispatch(setGroups({groups: tree}));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getTodoGroupList();
  }, [getTodoGroupList]);

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
            getTodoGroupList();
            setSelectedKeys(['-1']);
            dispatch(setCurrentGroupId({groupId: '-1'}));
          });
        }
      });
    },
    [dispatch, getTodoGroupList]
  );

  /** 监听编辑分组 */
  const onEditGroup = useCallback(() => {
    const groupDetail = findObjectById(groups, currentGroupId);
    editGroupForm.setFieldValue('groupName', groupDetail.title);
    setEditGroupOpened(true);
  }, [currentGroupId, editGroupForm, groups]);

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
            <HolderOutlined className="menu-action-btn" />
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
        <div className="group-menu-container">
          <div className="">个人分组</div>
          <PlusOutlined
            className="group-menu-add-btn"
            onClick={onClickCreateGroupBtn}
          />
        </div>,
        'personalGroup',
        null,
        [
          getItem(
            <div
              className="group-menu-item"
              key="-1"
              onClick={() => onClickMenuItem('-1')}
            >
              <div className="group-menu-name">近期待办</div>
            </div>,
            '-1'
          ),
          ...groups.map(getGroupMenuItem)
        ],
        'group'
      ),

      getItem(
        '系统分组',
        'systemGroup',
        null,
        [
          getItem(
            <div
              className="group-menu-item"
              key="-1"
              onClick={() => onClickMenuItem('-2')}
            >
              <div className="group-menu-name">废纸篓</div>
            </div>,
            '-2',
            <RestOutlined />
          )
        ],
        'group'
      )
    ];
  }, [getGroupMenuItem, onClickCreateGroupBtn, onClickMenuItem, groups]);

  // 确认创建分组
  const onConfirmCreateGroup = throttle(
    () => {
      const {groupName} = createGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
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
      window.api
        .createTodoGroup({
          title: groupName,
          parentId: currentGroupId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            onCancelCreateSubGroup();
            getTodoGroupList();
          }
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  // 修改分组
  const onConfirmEditGroup = throttle(
    () => {
      const {groupName} = editGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      const groupDetail = findObjectById(groups, currentGroupId);
      window.api
        .updateTodoGroup({
          title: groupName,
          id: currentGroupId,
          parentId: groupDetail.parentId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('修改成功');
            onCancelEditGroup();
            getTodoGroupList();
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

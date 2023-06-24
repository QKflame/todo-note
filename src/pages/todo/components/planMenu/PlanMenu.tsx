import './planMenu.less';

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
import {setCurrentPlanId, setPlans} from 'src/store/plan';
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

const PlanMenu: React.FC = () => {
  const currentPlanId = useAppSelector((state) => state.plan.currentPlanId);
  const plans = useAppSelector((state) => state.plan.plans);
  const dispatch = useAppDispatch();

  const [selectedKeys, setSelectedKeys] = useState([currentPlanId.toString()]);

  const [createGroupOpened, setCreateGroupOpened] = useState(false);
  const [createSubGroupOpened, setCreateSubGroupOpened] = useState(false);
  const [editGroupOpened, setEditGroupOpened] = useState(false);

  const [createGroupForm] = Form.useForm();
  const [createSubGroupForm] = Form.useForm();
  const [editGroupForm] = Form.useForm();

  const onClickMenuItem = useCallback(
    (key) => {
      if (key === currentPlanId) {
        return;
      }
      dispatch(setCurrentPlanId({planId: key}));
      setSelectedKeys([key.toString()]);
    },
    [currentPlanId, dispatch]
  );

  const getPlanGroupList = useCallback(() => {
    window.api.getPlanGroupList().then((res) => {
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
        dispatch(setPlans({plans: tree}));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getPlanGroupList();
  }, [getPlanGroupList]);

  // 监听点击创建分组按钮
  const onClickCreateGroupBtn = useCallback(() => {
    setCreateGroupOpened(true);
  }, []);

  /** 监听删除分组 */
  const onDeleteGroup = useCallback(
    (planGroupId) => {
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
          window.api.deletePlanGroup({id: planGroupId}).then(() => {
            message.success('删除成功');
            getPlanGroupList();
            setSelectedKeys(['-1']);
            dispatch(setCurrentPlanId({planId: '-1'}));
          });
        }
      });
    },
    [dispatch, getPlanGroupList]
  );

  /** 监听编辑分组 */
  const onEditPlanGroup = useCallback(() => {
    const planDetail = findObjectById(plans, currentPlanId);
    editGroupForm.setFieldValue('groupName', planDetail.title);
    setEditGroupOpened(true);
  }, [currentPlanId, editGroupForm, plans]);

  /** 监听点击创建子分组 */
  const onCreateSuPlanGroup = useCallback(() => {
    setCreateSubGroupOpened(true);
  }, []);

  const getPlanMenuItem = useCallback(
    (item) => {
      return getItem(
        <div
          className={cx('plan-menu-item', {
            'active-plan-menu-item': selectedKeys.indexOf(item.id) > -1,
            'active-plan-menu-group-item':
              item?.children?.length && selectedKeys.indexOf(item.id) > -1
          })}
          key={item.id}
          onClick={() => onClickMenuItem(item.id)}
        >
          <div className="plan-menu-name">{item.title}</div>
          <Dropdown
            overlayClassName="plan-menu-dropdown-container"
            menu={{
              items: item?.children?.length
                ? [
                  {
                    key: 'editGroup',
                    label: (
                      <Button
                        type="text"
                        className="dropdown-action-name"
                        onClick={onEditPlanGroup}
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
                        onClick={onCreateSuPlanGroup}
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
                        onClick={onEditPlanGroup}
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
                        onClick={onCreateSuPlanGroup}
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
        item?.children?.length ? item.children.map(getPlanMenuItem) : undefined
      );
    },
    [
      onClickMenuItem,
      onCreateSuPlanGroup,
      onDeleteGroup,
      onEditPlanGroup,
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
              className="plan-menu-item"
              key="-1"
              onClick={() => onClickMenuItem('-1')}
            >
              <div className="plan-menu-name">近期待办</div>
            </div>,
            '-1'
          ),
          ...plans.map(getPlanMenuItem)
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
              className="plan-menu-item"
              key="-1"
              onClick={() => onClickMenuItem('-2')}
            >
              <div className="plan-menu-name">废纸篓</div>
            </div>,
            '-2',
            <RestOutlined />
          )
        ],
        'group'
      )
    ];
  }, [getPlanMenuItem, onClickCreateGroupBtn, onClickMenuItem, plans]);

  // 确认创建分组
  const onConfirmCreateGroup = throttle(
    () => {
      const {groupName} = createGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      window.api
        .createPlanGroup({
          title: groupName
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            onCancelCreateGroup();
            getPlanGroupList();
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
        .createPlanGroup({
          title: groupName,
          parentId: currentPlanId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            onCancelCreateSubGroup();
            getPlanGroupList();
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
  const onConfirmEditGroup = throttle(
    () => {
      const {groupName} = editGroupForm.getFieldsValue();
      if (!groupName) {
        message.warning('请输入分组名称');
        return;
      }
      window.api
        .updatePlanGroup({
          title: groupName,
          id: currentPlanId
        })
        .then((res) => {
          if (res.changes === 1) {
            message.success('修改成功');
            onCancelEditGroup();
            getPlanGroupList();
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
    <div className="plan-menu-container" style={{width: 280}}>
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

export default PlanMenu;

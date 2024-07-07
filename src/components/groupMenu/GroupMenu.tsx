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
import {BiDotsHorizontalRounded} from 'react-icons/bi';
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
              message={isNote ? "当前分组下的笔记也将被删除，可前往废纸篓进行恢复！" : "当前分组下的待办事项也将被删除，可前往废纸篓进行恢复！"}
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
            {/* <EllipsisOutlined className="menu-action-btn" /> */}
            <BiDotsHorizontalRounded className="menu-action-btn" />
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
              // <RestOutlined />
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12924" width="18" height="18"><path d="M762.317 937.667a8 8 0 0 1-8 8h-486.65a8 8 0 0 1-8-8v-49.861a8 8 0 0 1 8-8h486.651a8 8 0 0 1 8 8v49.861z" fill="#A2CBEB" p-id="12925"></path><path d="M887.992 106.606a8 8 0 0 1-8 8H144.636a8 8 0 0 1-8-8V78.768a8 8 0 0 1 8-8h735.356a8 8 0 0 1 8 8v27.838z" fill="#E4F0F7" p-id="12926"></path><path d="M869.268 121.601H154.732c-15.796 0-28.646-12.85-28.646-28.646s12.85-28.646 28.646-28.646h714.536c15.794 0 28.646 12.85 28.646 28.646s-12.852 28.646-28.646 28.646zM154.732 81.903c-6.095 0-11.052 4.957-11.052 11.052s4.957 11.052 11.052 11.052h714.536c6.095 0 11.052-4.957 11.052-11.052s-4.957-11.052-11.052-11.052H154.732z m612.379 803.363H256.889c-4.858 0-8.797-3.691-8.797-8.549s3.939-8.549 8.797-8.549h510.222c4.858 0 8.797 3.691 8.797 8.549s-3.939 8.549-8.797 8.549z m11.537-99.434a8.769 8.769 0 0 1-6.22-2.577L175.365 186.191c-2.204-2.202-2.112-10.329 0-12.439 3.432-3.436 9.007-3.436 12.439 0l597.064 597.064a8.794 8.794 0 0 1 0 12.439 8.773 8.773 0 0 1-6.22 2.577z" fill="#1F75AA" p-id="12927"></path><path d="M790.869 678.958a8.769 8.769 0 0 1-6.22-2.577L227.275 119.009a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.007-3.436 12.439 0l557.375 557.372a8.794 8.794 0 0 1 0 12.439 8.77 8.77 0 0 1-6.22 2.577z m11.365-107.723a8.769 8.769 0 0 1-6.22-2.577l-449.64-449.636a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.003-3.436 12.439 0l449.64 449.636a8.794 8.794 0 0 1 0 12.439 8.77 8.77 0 0 1-6.219 2.577z m10.326-108.759a8.769 8.769 0 0 1-6.22-2.577L465.457 119.015a8.794 8.794 0 0 1 0-12.439c2.194-2.197 10.085-2.357 12.439 0L818.78 447.459a8.794 8.794 0 0 1 0 12.439 8.766 8.766 0 0 1-6.22 2.578z m12.272-106.818a8.769 8.769 0 0 1-6.22-2.577L584.549 119.015a8.794 8.794 0 0 1 0-12.439c2.419-2.419 10.305-2.135 12.439 0l234.064 234.066c2.923 2.921 3.004 9.438 0 12.439a8.769 8.769 0 0 1-6.22 2.577z m11.327-107.764a8.769 8.769 0 0 1-6.22-2.577L703.634 119.013a8.794 8.794 0 0 1 0-12.439c2.636-2.636 10.527-1.912 12.439 0l126.306 126.303c2.67 2.669 2.654 9.787 0 12.439a8.766 8.766 0 0 1-6.22 2.578zM753.52 879.793a8.769 8.769 0 0 1-6.22-2.577L189.256 319.169c-2.527-2.525-2.213-10.227 0-12.439 3.432-3.436 9.003-3.436 12.439 0L759.74 864.776a8.794 8.794 0 0 1 0 12.439 8.766 8.766 0 0 1-6.22 2.578z m-119.093-0.004a8.769 8.769 0 0 1-6.22-2.577L203.139 452.143c-2.869-2.867-2.542-9.899 0-12.439 3.432-3.436 9.007-3.436 12.439 0l425.068 425.068a8.794 8.794 0 0 1 0 12.439 8.763 8.763 0 0 1-6.219 2.578z m-119.083 0.004a8.765 8.765 0 0 1-6.22-2.577L217.067 585.16a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.007-3.436 12.439 0l292.06 292.056a8.801 8.801 0 0 1 0 12.439 8.77 8.77 0 0 1-6.222 2.577z m-119.087 0.004a8.769 8.769 0 0 1-6.22-2.577L230.999 718.179a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.003-3.436 12.439 0l159.038 159.041a8.794 8.794 0 0 1 0 12.439 8.763 8.763 0 0 1-6.219 2.577z" fill="#1F75AA" p-id="12928"></path><path d="M246.069 800.741a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l594.45-594.448a8.794 8.794 0 0 1 12.439 0c2.153 2.152 1.959 10.481 0 12.439l-594.45 594.448a8.761 8.761 0 0 1-6.219 2.577zM235.24 692.48a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l570.881-570.879a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L241.46 689.903a8.765 8.765 0 0 1-6.22 2.577z m-12.192-106.895a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l463.984-463.984a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L229.268 583.008a8.765 8.765 0 0 1-6.22 2.577z m-11.28-107.811a8.765 8.765 0 0 1-6.22-2.577c-2.925-2.924-2.307-10.134 0-12.439L561.736 106.57c2.583-2.583 10.433-2.006 12.439 0a8.794 8.794 0 0 1 0 12.439L217.988 475.196a8.762 8.762 0 0 1-6.22 2.578z m-11.269-107.821a8.769 8.769 0 0 1-6.22-2.577c-2.698-2.696-2.453-9.988 0-12.439l248.367-248.365c2.932-2.935 9.517-2.922 12.439 0a8.794 8.794 0 0 1 0 12.439L206.719 367.376a8.765 8.765 0 0 1-6.22 2.577z m-11.258-107.831a8.765 8.765 0 0 1-6.22-2.577c-2.317-2.316-2.777-9.664 0-12.439L323.557 106.57c3.432-3.436 9.007-3.436 12.439 0a8.794 8.794 0 0 1 0 12.439L195.461 259.545a8.765 8.765 0 0 1-6.22 2.577z m96.872 617.667a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l540.429-540.429a8.794 8.794 0 0 1 12.439 0c2.235 2.233 2.068 10.373 0 12.439L292.332 877.211a8.762 8.762 0 0 1-6.219 2.578z m119.072 0.017a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l407.397-407.397a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L411.404 877.229a8.763 8.763 0 0 1-6.219 2.577z m119.091 0a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l274.363-274.367a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L530.496 877.229a8.769 8.769 0 0 1-6.22 2.577z m119.089 0a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l141.366-141.37c3.436-3.436 9.003-3.436 12.439 0s3.436 9.003 0 12.439l-141.365 141.37a8.769 8.769 0 0 1-6.22 2.577z" fill="#1F75AA" p-id="12929"></path><path d="M734.299 959.691h-444.6c-22.207 0-40.301-17.873-40.553-40.329l-82.409-804.88c-0.494-4.832 3.022-9.073 7.856-9.569 4.847-0.483 9.153 3.061 9.647 7.895l82.452 805.478c0.03 0.301 0.045 0.541 0.045 0.842 0 12.749 10.515 23.466 22.961 23.466h444.599c12.448 0 22.963-10.707 22.963-23.456 0-0.301 0.017-0.564 0.047-0.865l82.471-805.365c0.494-4.83 4.742-8.325 9.647-7.848a8.798 8.798 0 0 1 7.852 9.652l-82.428 804.652c-0.251 22.452-18.343 40.327-40.55 40.327z" fill="#1F75AA" p-id="12930"></path></svg>
            )
            : isNote
              ? getItem(
                <div
                  className="group-menu-item"
                  key="-4"
                  onClick={() => onClickMenuItem('-4')}
                >
                  {/* 笔记专栏的废纸篓 */}
                  <div className="group-menu-name">废纸篓</div>
                </div>,
                '-4',
                // <RestOutlined />
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12924" width="18" height="18"><path d="M762.317 937.667a8 8 0 0 1-8 8h-486.65a8 8 0 0 1-8-8v-49.861a8 8 0 0 1 8-8h486.651a8 8 0 0 1 8 8v49.861z" fill="#A2CBEB" p-id="12925"></path><path d="M887.992 106.606a8 8 0 0 1-8 8H144.636a8 8 0 0 1-8-8V78.768a8 8 0 0 1 8-8h735.356a8 8 0 0 1 8 8v27.838z" fill="#E4F0F7" p-id="12926"></path><path d="M869.268 121.601H154.732c-15.796 0-28.646-12.85-28.646-28.646s12.85-28.646 28.646-28.646h714.536c15.794 0 28.646 12.85 28.646 28.646s-12.852 28.646-28.646 28.646zM154.732 81.903c-6.095 0-11.052 4.957-11.052 11.052s4.957 11.052 11.052 11.052h714.536c6.095 0 11.052-4.957 11.052-11.052s-4.957-11.052-11.052-11.052H154.732z m612.379 803.363H256.889c-4.858 0-8.797-3.691-8.797-8.549s3.939-8.549 8.797-8.549h510.222c4.858 0 8.797 3.691 8.797 8.549s-3.939 8.549-8.797 8.549z m11.537-99.434a8.769 8.769 0 0 1-6.22-2.577L175.365 186.191c-2.204-2.202-2.112-10.329 0-12.439 3.432-3.436 9.007-3.436 12.439 0l597.064 597.064a8.794 8.794 0 0 1 0 12.439 8.773 8.773 0 0 1-6.22 2.577z" fill="#1F75AA" p-id="12927"></path><path d="M790.869 678.958a8.769 8.769 0 0 1-6.22-2.577L227.275 119.009a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.007-3.436 12.439 0l557.375 557.372a8.794 8.794 0 0 1 0 12.439 8.77 8.77 0 0 1-6.22 2.577z m11.365-107.723a8.769 8.769 0 0 1-6.22-2.577l-449.64-449.636a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.003-3.436 12.439 0l449.64 449.636a8.794 8.794 0 0 1 0 12.439 8.77 8.77 0 0 1-6.219 2.577z m10.326-108.759a8.769 8.769 0 0 1-6.22-2.577L465.457 119.015a8.794 8.794 0 0 1 0-12.439c2.194-2.197 10.085-2.357 12.439 0L818.78 447.459a8.794 8.794 0 0 1 0 12.439 8.766 8.766 0 0 1-6.22 2.578z m12.272-106.818a8.769 8.769 0 0 1-6.22-2.577L584.549 119.015a8.794 8.794 0 0 1 0-12.439c2.419-2.419 10.305-2.135 12.439 0l234.064 234.066c2.923 2.921 3.004 9.438 0 12.439a8.769 8.769 0 0 1-6.22 2.577z m11.327-107.764a8.769 8.769 0 0 1-6.22-2.577L703.634 119.013a8.794 8.794 0 0 1 0-12.439c2.636-2.636 10.527-1.912 12.439 0l126.306 126.303c2.67 2.669 2.654 9.787 0 12.439a8.766 8.766 0 0 1-6.22 2.578zM753.52 879.793a8.769 8.769 0 0 1-6.22-2.577L189.256 319.169c-2.527-2.525-2.213-10.227 0-12.439 3.432-3.436 9.003-3.436 12.439 0L759.74 864.776a8.794 8.794 0 0 1 0 12.439 8.766 8.766 0 0 1-6.22 2.578z m-119.093-0.004a8.769 8.769 0 0 1-6.22-2.577L203.139 452.143c-2.869-2.867-2.542-9.899 0-12.439 3.432-3.436 9.007-3.436 12.439 0l425.068 425.068a8.794 8.794 0 0 1 0 12.439 8.763 8.763 0 0 1-6.219 2.578z m-119.083 0.004a8.765 8.765 0 0 1-6.22-2.577L217.067 585.16a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.007-3.436 12.439 0l292.06 292.056a8.801 8.801 0 0 1 0 12.439 8.77 8.77 0 0 1-6.222 2.577z m-119.087 0.004a8.769 8.769 0 0 1-6.22-2.577L230.999 718.179a8.794 8.794 0 0 1 0-12.439c3.432-3.436 9.003-3.436 12.439 0l159.038 159.041a8.794 8.794 0 0 1 0 12.439 8.763 8.763 0 0 1-6.219 2.577z" fill="#1F75AA" p-id="12928"></path><path d="M246.069 800.741a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l594.45-594.448a8.794 8.794 0 0 1 12.439 0c2.153 2.152 1.959 10.481 0 12.439l-594.45 594.448a8.761 8.761 0 0 1-6.219 2.577zM235.24 692.48a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l570.881-570.879a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L241.46 689.903a8.765 8.765 0 0 1-6.22 2.577z m-12.192-106.895a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l463.984-463.984a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L229.268 583.008a8.765 8.765 0 0 1-6.22 2.577z m-11.28-107.811a8.765 8.765 0 0 1-6.22-2.577c-2.925-2.924-2.307-10.134 0-12.439L561.736 106.57c2.583-2.583 10.433-2.006 12.439 0a8.794 8.794 0 0 1 0 12.439L217.988 475.196a8.762 8.762 0 0 1-6.22 2.578z m-11.269-107.821a8.769 8.769 0 0 1-6.22-2.577c-2.698-2.696-2.453-9.988 0-12.439l248.367-248.365c2.932-2.935 9.517-2.922 12.439 0a8.794 8.794 0 0 1 0 12.439L206.719 367.376a8.765 8.765 0 0 1-6.22 2.577z m-11.258-107.831a8.765 8.765 0 0 1-6.22-2.577c-2.317-2.316-2.777-9.664 0-12.439L323.557 106.57c3.432-3.436 9.007-3.436 12.439 0a8.794 8.794 0 0 1 0 12.439L195.461 259.545a8.765 8.765 0 0 1-6.22 2.577z m96.872 617.667a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l540.429-540.429a8.794 8.794 0 0 1 12.439 0c2.235 2.233 2.068 10.373 0 12.439L292.332 877.211a8.762 8.762 0 0 1-6.219 2.578z m119.072 0.017a8.765 8.765 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l407.397-407.397a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L411.404 877.229a8.763 8.763 0 0 1-6.219 2.577z m119.091 0a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l274.363-274.367a8.794 8.794 0 0 1 12.439 0 8.794 8.794 0 0 1 0 12.439L530.496 877.229a8.769 8.769 0 0 1-6.22 2.577z m119.089 0a8.769 8.769 0 0 1-6.22-2.577 8.794 8.794 0 0 1 0-12.439l141.366-141.37c3.436-3.436 9.003-3.436 12.439 0s3.436 9.003 0 12.439l-141.365 141.37a8.769 8.769 0 0 1-6.22 2.577z" fill="#1F75AA" p-id="12929"></path><path d="M734.299 959.691h-444.6c-22.207 0-40.301-17.873-40.553-40.329l-82.409-804.88c-0.494-4.832 3.022-9.073 7.856-9.569 4.847-0.483 9.153 3.061 9.647 7.895l82.452 805.478c0.03 0.301 0.045 0.541 0.045 0.842 0 12.749 10.515 23.466 22.961 23.466h444.599c12.448 0 22.963-10.707 22.963-23.456 0-0.301 0.017-0.564 0.047-0.865l82.471-805.365c0.494-4.83 4.742-8.325 9.647-7.848a8.798 8.798 0 0 1 7.852 9.652l-82.428 804.652c-0.251 22.452-18.343 40.327-40.55 40.327z" fill="#1F75AA" p-id="12930"></path></svg>
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

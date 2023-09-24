import './noteList.less';

import {EllipsisOutlined} from '@ant-design/icons';
import {
  Alert,
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  TreeSelect
} from 'antd';
import cx from 'classnames';
import {isArray, orderBy, throttle} from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/hooks/store';
import {
  setCurrentNoteDetail,
  setCurrentNoteId,
  setNoteList
} from 'src/store/notes';
import {NoteItem} from 'src/types/note';
import {convertGroupList, convertTimestampToDuration} from 'src/utils/util';

const Header: React.FC<{ getNoteList: () => void }> = React.memo((props) => {
  const [noteTitle, setNoteTitle] = useState('');
  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );

  // 是否为废纸篓界面
  const isTrash = useMemo(() => {
    return currentNoteGroupId === '-4';
  }, [currentNoteGroupId]);

  /** 创建分组 */
  const onCreateNote = throttle(
    () => {
      if (!noteTitle?.trim()) {
        return;
      }

      window.api
        .createNote({title: noteTitle, groupId: currentNoteGroupId})
        .then((res) => {
          if (res.changes === 1) {
            message.success('创建成功');
            setNoteTitle('');
            props.getNoteList();
          }
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  /** 监听笔记标题发生变化 */
  const onNoteTitleChange = useCallback((e) => {
    setNoteTitle(e.target.value);
  }, []);

  return !isTrash ? (
    <div className="header-container">
      <Input
        size="middle"
        placeholder="+ 输入笔记标题，点击回车即可创建"
        className="create-note-input"
        onPressEnter={onCreateNote}
        value={noteTitle}
        onChange={onNoteTitleChange}
      />
    </div>
  ) : (
    <></>
  );
});

const List: React.FC<{ getNoteList: () => void }> = React.memo((props) => {
  const noteList = useAppSelector((state) => state.notes.noteList);
  const currentNoteId = useAppSelector((state) => state.notes.currentNoteId);
  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );

  const currentNoteDetail = useAppSelector(
    (state) => state.notes.currentNoteDetail
  );

  // 是否为废纸篓界面
  const isTrash = useMemo(() => {
    return currentNoteGroupId === '-4';
  }, [currentNoteGroupId]);

  const dispatch = useDispatch();
  const [isRemoveGroupModalOpen, setIsRemoveGroupModalOpen] = useState(false);
  const [moveGroupForm] = Form.useForm();
  const [moveTargetGroup, setMoveTargetGroup] = useState<string>();
  const groups = useAppSelector((state) => state.group.noteGroups);

  const groupList = useMemo(() => {
    return convertGroupList(groups, currentNoteGroupId, 'note');
  }, [currentNoteGroupId, groups]);

  const filterTreeNode = useCallback((inputValue, treeNode) => {
    return treeNode?.title?.includes(inputValue);
  }, []);

  const onClickNoteItem = useCallback(
    (item: NoteItem) => {
      dispatch(setCurrentNoteId(item.id));
      window.api.getNoteDetail({noteId: item.id}).then((res) => {
        dispatch(setCurrentNoteDetail(res?.result));
      });
    },
    [dispatch]
  );

  /** 监听点击删除笔记按钮 */
  const onClickDeleteNoteBtn = useCallback(
    (item: NoteItem, index: number) => {
      Modal.confirm({
        title: '删除笔记',
        content: (
          <div>
            <div style={{marginBottom: 10}}>是否确认删除当前笔记？</div>
            <Alert
              message={
                isTrash
                  ? '在废纸篓进行删除后，无法恢复，请谨慎操作！'
                  : '当前笔记被删除后，可前往废纸篓进行恢复！'
              }
              type="error"
            ></Alert>
          </div>
        ),
        onOk: () => {
          window.api
            .deleteNote({
              noteId: item.id,
              isTrash,
              groupId: item.groupId
            })
            .then((res) => {
              if (res.changes === 1) {
                message.success('删除成功');
                const noteListLength = noteList.length;
                if (index + 1 < noteListLength) {
                  dispatch(setCurrentNoteId(noteList[index + 1].id));
                } else if (index - 1 >= 0) {
                  dispatch(setCurrentNoteId(noteList[index - 1].id));
                } else if (index - 1 === -1) {
                  dispatch(setCurrentNoteId(''));
                  dispatch(setCurrentNoteDetail(null));
                }
                // 重新获取笔记列表
                props.getNoteList();
              }
            });
        }
      });
    },
    [dispatch, isTrash, noteList, props]
  );

  /** 监听点击恢复按钮 */
  const onClickRecoverBtn = useCallback(
    (item: NoteItem, index: number) => {
      Modal.confirm({
        title: '恢复笔记',
        content: (
          <div>
            <div style={{marginBottom: 10}}>是否确认恢复当前笔记？</div>
            <Alert
              message="若笔记所属分组已被删除，则恢复至 「随手笔记」分组中，若未被删除，则恢复至原分组中"
              type="info"
            ></Alert>
          </div>
        ),
        onOk: () => {
          window.api
            .recoverNote({
              noteId: currentNoteId,
              groupId: item.originGroupId
            })
            .then(() => {
              message.success('恢复成功');
              const noteListLength = noteList.length;
              if (index + 1 < noteListLength) {
                dispatch(setCurrentNoteId(noteList[index + 1].id));
              } else if (index - 1 >= 0) {
                dispatch(setCurrentNoteId(noteList[index - 1].id));
              } else if (index - 1 === -1) {
                dispatch(setCurrentNoteId(''));
                dispatch(setCurrentNoteDetail(null));
              }
              // 重新获取笔记列表
              props.getNoteList();
            });
        }
      });
    },
    [currentNoteId, dispatch, noteList, props]
  );

  /** 监听点击移动分组按钮 */
  const onClickMoveGroupBtn = useCallback(() => {
    setIsRemoveGroupModalOpen(true);
  }, []);

  /** 确认移动分组 */
  const onConfirmMoveGroup = throttle(
    () => {
      if (!moveTargetGroup) {
        message.warning('请选择移动分组');
        return;
      }

      window.api
        .moveNoteGroup({noteId: currentNoteId, groupId: moveTargetGroup})
        .then(() => {
          setMoveTargetGroup('');
          moveGroupForm.resetFields();
          message.success('移动成功');
          onCancelMoveGroup();
          props.getNoteList();
        });
    },
    3000,
    {
      leading: true,
      trailing: false
    }
  );

  /** 监听分组变化 */
  const onMoveGroupChange = useCallback((value: string) => {
    setMoveTargetGroup(value);
  }, []);

  /** 取消移动分组 */
  const onCancelMoveGroup = useCallback(() => {
    setIsRemoveGroupModalOpen(false);
  }, []);

  return (
    <div className="list-container">
      {noteList.length > 0 ? (
        noteList.map((item, index) => {
          return (
            <div
              className={cx('list-item-container', {
                'selected-list-item': item.id === currentNoteId
              })}
              key={item.id}
              onClick={() => {
                onClickNoteItem(item);
              }}
            >
              <div className="title-container">
                <div className="title">{item.title}</div>
                {item.id === currentNoteId ? (
                  <Dropdown
                    overlayClassName="group-menu-dropdown-container"
                    menu={{
                      items: [
                        {
                          key: 'editGroup',
                          label: (
                            <Button
                              type="text"
                              className="dropdown-action-name"
                              onClick={() => {
                                onClickDeleteNoteBtn(item, index);
                              }}
                            >
                              删除
                            </Button>
                          )
                        },
                        isTrash
                          ? {
                            key: 'createGroup',
                            label: (
                              <Button
                                type="text"
                                className="dropdown-action-name"
                                onClick={() => {
                                  onClickRecoverBtn(item, index);
                                }}
                              >
                                  恢复
                              </Button>
                            )
                          }
                          : {
                            key: 'createGroup',
                            label: (
                              <Button
                                type="text"
                                className="dropdown-action-name"
                                onClick={onClickMoveGroupBtn}
                              >
                                  移动
                              </Button>
                            )
                          }
                      ]
                    }}
                    placement="bottom"
                    arrow={{pointAtCenter: true}}
                  >
                    <EllipsisOutlined className="menu-action-btn" />
                  </Dropdown>
                ) : null}
              </div>
              <div className="content-container">
                <div className="content">{item.content}</div>
              </div>
              <div className="footer-container">
                <div className="updateTime">
                  {convertTimestampToDuration(item.updateTime)}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无笔记，可立即创建"
          style={{
            fontSize: 12,
            position: 'relative',
            top: 200
          }}
        />
      )}

      <Modal
        title="移动分组"
        open={isRemoveGroupModalOpen}
        onOk={onConfirmMoveGroup}
        onCancel={onCancelMoveGroup}
      >
        <Form
          name="editGroupForm"
          colon={false}
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          style={{maxWidth: 600, marginTop: 20}}
          autoComplete="off"
          form={moveGroupForm}
        >
          <Form.Item label="移动到" name="group">
            <TreeSelect
              showSearch
              value={moveTargetGroup}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="请选择移动分组"
              allowClear
              treeDefaultExpandAll
              onChange={onMoveGroupChange}
              treeData={groupList}
              filterTreeNode={filterTreeNode}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

const NoteList: React.FC = React.memo(() => {
  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );
  const currentNoteId = useAppSelector((state) => state.notes.currentNoteId);

  const dispatch = useDispatch();

  const getNoteList = useCallback(() => {
    window.api.getNoteList({groupId: currentNoteGroupId}).then((res) => {
      if (isArray(res?.result)) {
        const noteList = orderBy(res.result, ['createTime'], ['desc']);
        dispatch(setNoteList(noteList));

        const currentNoteIndex = noteList.findIndex(
          (item) => item.id === currentNoteId
        );
        if (currentNoteIndex === -1 && noteList.length) {
          dispatch(setCurrentNoteId(noteList[0].id));
          window.api.getNoteDetail({noteId: noteList[0].id}).then((res) => {
            dispatch(setCurrentNoteDetail(res?.result));
          });
        } else if (!noteList.length) {
          dispatch(setCurrentNoteId(''));
          dispatch(setCurrentNoteDetail(null));
        }
      }
    });
  }, [currentNoteGroupId, currentNoteId, dispatch]);

  const timer = useRef(null);

  useEffect(() => {
    getNoteList();

    timer.current = setInterval(() => {
      getNoteList();
    }, 60 * 1000);

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoteGroupId]);

  return (
    <div className="note-list-container">
      <Header getNoteList={getNoteList}></Header>
      <List getNoteList={getNoteList}></List>
    </div>
  );
});

export default NoteList;

import './todoDrawer.less';

import {Drawer, DrawerProps, Input, notification} from 'antd';
import {debounce, isNil, throttle} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {resetTodoDetail, toggleIsTodoDrawerOpened} from 'src/store/todos';
import {quillFormats, quillModules} from 'src/utils/quill';

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
  /** 向左切换 */
  onSwitchLeft?: () => void;
  /** 向右切换 */
  onSwitchRight?: () => void;
}

const TodoEditor = () => {
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const [value, setValue] = useState('');
  const modules = useRef(quillModules);
  const formats = useRef(quillFormats);

  const updateTodoDetail = debounce((content: string) => {
    window.api.updateTodoDetail({
      ...todoDetail,
      content
    });
  }, 500);

  const onEditorChange = useCallback(
    (e) => {
      setValue(e);
      updateTodoDetail(e);
    },
    [updateTodoDetail]
  );

  // 组件加载
  useEffect(() => {
    // 禁止拼音检查，导致出现红色波浪线
    const quillNode = document.querySelector('.quill');
    if (quillNode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      quillNode.spellcheck = false;
    }
  }, []);

  useEffect(() => {
    if (!isNil(todoDetail?.content)) {
      setValue(todoDetail.content);
    }
  }, [todoDetail?.content]);

  return (
    <>
      <div className="todo-editor-container">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={(e) => onEditorChange(e)}
          modules={modules.current}
          formats={formats.current}
          placeholder="请输入笔记内容"
        />
      </div>
    </>
  );
};

const TodoTitle = () => {
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  const updateTodoDetail = debounce((name: string) => {
    window.api.updateTodoDetail({
      ...todoDetail,
      name
    });
  }, 500);

  useEffect(() => {
    if (!isNil(todoDetail?.name)) {
      setValue(todoDetail?.name);
    }
  }, [todoDetail?.name]);

  const onChange = useCallback(
    (e) => {
      const name = e.target.value;
      setValue(name);
      updateTodoDetail(name);
    },
    [updateTodoDetail]
  );

  return (
    <Input
      placeholder="请输入待办事项"
      bordered={false}
      value={value}
      onChange={onChange}
      ref={inputRef}
    />
  );
};

const TodoDrawer = (props: TodoDrawerProps) => {
  const {open, onClose} = props;
  const [placement] = useState<DrawerProps['placement']>('right');

  const todoDetail = useAppSelector((state) => state.todos.todoDetail);

  const dispatch = useAppDispatch();

  const onClickConfirmBtn = throttle(() => {
    // 校验内容
    if (!todoDetail.name) {
      notification.open({
        message: '温馨提示',
        description: '请输入待办事项标题',
        placement: 'topLeft',
        type: 'warning'
      });
      return;
    }

    window.api.updateTodoDetail(todoDetail).then((res) => {
      if (res.changes === 1) {
        dispatch(toggleIsTodoDrawerOpened());
        props.onSaveSuccess();
      }
    });
  }, 2000);

  const afterOpenChange = useCallback(
    (e) => {
      if (e === false) {
        dispatch(resetTodoDetail());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 's' || event.keyCode === 83)
      ) {
        event.preventDefault(); // 阻止默认的保存操作
        onClickConfirmBtn();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClickConfirmBtn]);

  return (
    <Drawer
      placement={placement}
      width={700}
      onClose={onClose}
      open={open}
      autoFocus={true}
      mask={true}
      closeIcon={<div style={{fontSize: 12}}>关闭</div>}
      className="todo-drawer-container"
      extra={<TodoTitle />}
      destroyOnClose={true}
      afterOpenChange={afterOpenChange}
    >
      <TodoEditor />
    </Drawer>
  );
};

export default React.memo(TodoDrawer);

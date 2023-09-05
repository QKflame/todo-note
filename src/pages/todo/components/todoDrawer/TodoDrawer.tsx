import './todoDrawer.less';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

import {Drawer, DrawerProps, Input, notification} from 'antd';
import {isNil} from 'lodash';
import Emoji from 'quill-emoji';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {resetTodoDetail} from 'src/store/todos';
import {quillFormats, quillModules} from 'src/utils/quill';

// Quill.register('modules/emoji', Emoji);

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
  /** 向左切换 */
  onSwitchLeft?: () => void;
  /** 向右切换 */
  onSwitchRight?: () => void;
}

const TodoEditor = forwardRef((props, ref) => {
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const [value, setValue] = useState('');
  const modules = useRef(quillModules);
  const formats = useRef(quillFormats);

  const onEditorChange = useCallback((e) => {
    setValue(e);
  }, []);

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

  useImperativeHandle(ref, () => {
    return {
      getEditorContent: () => {
        return value;
      }
    };
  });

  console.log('modules.current', modules.current);
  console.log('formats.current', formats.current);

  return (
    <>
      <div className="todo-editor-container">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={(e) => onEditorChange(e)}
          modules={modules.current}
          formats={formats.current}
          placeholder="请输入待办内容"
        />
      </div>
    </>
  );
});

const TodoTitle = forwardRef((props, ref) => {
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isNil(todoDetail?.name)) {
      setValue(todoDetail?.name);
    }
  }, [todoDetail?.name]);

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getTodoTitle: () => {
        return value;
      }
    };
  });

  return (
    <Input
      placeholder="请输入待办事项"
      bordered={false}
      value={value}
      onChange={onChange}
      ref={inputRef}
    />
  );
});

const TodoDrawer = (props: TodoDrawerProps) => {
  const {open, onClose} = props;
  const [placement] = useState<DrawerProps['placement']>('right');

  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const todoEditorRef = useRef(null);
  const todoTitleRef = useRef(null);

  const dispatch = useAppDispatch();

  const afterOpenChange = useCallback(
    (e) => {
      if (e === false) {
        dispatch(resetTodoDetail());
      }
    },
    [dispatch]
  );

  const closing = useRef(false);

  const onDrawerClose = useCallback(() => {
    if (closing.current) {
      return;
    }

    const content = todoEditorRef.current?.getEditorContent();
    const title = todoTitleRef.current?.getTodoTitle();

    if (!title) {
      notification.open({
        message: '温馨提示',
        description: '请输入待办事项标题',
        placement: 'topLeft',
        type: 'warning'
      });
      return;
    }

    closing.current = true;

    window.api
      .updateTodoDetail({
        ...todoDetail,
        name: title,
        content
      })
      .then(() => {
        onClose();
      })
      .finally(() => {
        closing.current = false;
      });
  }, [onClose, todoDetail]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 's' || event.keyCode === 83)
      ) {
        event.preventDefault(); // 阻止默认的保存操作
        onDrawerClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDrawerClose]);

  return (
    <Drawer
      placement={placement}
      width={700}
      onClose={onDrawerClose}
      open={open}
      autoFocus={true}
      mask={true}
      closeIcon={<div style={{fontSize: 12}}>关闭</div>}
      className="todo-drawer-container"
      extra={<TodoTitle ref={todoTitleRef} />}
      destroyOnClose={true}
      afterOpenChange={afterOpenChange}
    >
      <TodoEditor ref={todoEditorRef} />
    </Drawer>
  );
};

export default React.memo(TodoDrawer);

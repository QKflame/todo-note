import './todoDrawer.less';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor, Toolbar} from '@wangeditor/editor-for-react';
import {Button, Drawer, DrawerProps, Input, notification} from 'antd';
import {throttle} from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {
  resetTodoDetail,
  setTodoDetail,
  toggleIsTodoDrawerOpened
} from 'src/store/todos';

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
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  const todoDetail = useAppSelector((state) => state.todos.todoDetail);

  const dispatch = useAppDispatch();

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...'
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useImperativeHandle(
    ref,
    () => {
      return {
        destroy: () => {
          editor.blur();
          editor.destroy();
          setEditor(null);
        },
        blur: () => {
          editor.blur();
        }
      };
    },
    [editor]
  );

  const onChange = useCallback(
    (editor) => {
      dispatch(
        setTodoDetail({
          ...todoDetail,
          content: editor.getHtml()
        })
      );
    },
    [dispatch, todoDetail]
  );

  return (
    <>
      <div className="todo-editor-container">
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{borderBottom: '1px solid #f2f2f2'}}
        />
        <Editor
          defaultConfig={editorConfig}
          value={todoDetail.content || ''}
          onCreated={setEditor}
          onChange={onChange}
          mode="default"
          style={{height: 'calc(100% - 120px)'}}
        />
      </div>
    </>
  );
});

const TodoTitle = forwardRef((props, ref) => {
  const todoDetail = useAppSelector((state) => state.todos.todoDetail);
  const dispatch = useAppDispatch();
  const inputRef = useRef(null);
  const onChange = useCallback(
    (e) => {
      dispatch(
        setTodoDetail({
          ...todoDetail,
          name: e.target.value
        })
      );
    },
    [dispatch, todoDetail]
  );

  useImperativeHandle(ref, () => {
    return {
      blur: () => {
        inputRef.current.blur();
      }
    };
  });

  return (
    <Input
      placeholder="请输入待办事项"
      bordered={false}
      value={todoDetail.name}
      onChange={onChange}
      ref={inputRef}
    />
  );
});

const TodoDrawer = (props: TodoDrawerProps) => {
  const {open, onClose} = props;
  const [placement] = useState<DrawerProps['placement']>('right');

  const todoEditor = useRef(null);
  const todoTitle = useRef(null);

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
        todoEditor.current.blur();
        todoTitle.current.blur();
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
      closeIcon={<div style={{fontSize: 14}}>关闭</div>}
      mask={true}
      className="todo-drawer-container"
      extra={<TodoTitle ref={todoTitle} />}
      destroyOnClose={true}
      afterOpenChange={afterOpenChange}
      // forceRender={true}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px'
          }}
        >
          <div>
            {/* <Button
              icon={<LeftOutlined />}
              style={{marginRight: 10}}
              onClick={props.onSwitchLeft}
            ></Button>
            <Button
              icon={<RightOutlined />}
              onClick={props.onSwitchRight}
            ></Button> */}
          </div>
          <Button type="primary" onClick={onClickConfirmBtn}>
            保存
          </Button>
        </div>
      }
    >
      <TodoEditor ref={todoEditor}></TodoEditor>
    </Drawer>
  );
};

export default TodoDrawer;

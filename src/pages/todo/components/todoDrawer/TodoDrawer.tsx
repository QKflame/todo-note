import './todoDrawer.less';

import {Drawer, DrawerProps, Input, message, notification} from 'antd';
import {isNil} from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import RichEditor from 'src/components/RichEditor';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {resetTodoDetail} from 'src/store/todos';

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
  /** 向左切换 */
  onSwitchLeft?: () => void;
  /** 向右切换 */
  onSwitchRight?: () => void;
}

const TodoEditor = forwardRef<any, {
  onSave: (content: string) => void;
  onChange: (content: string) => void;
  open: boolean;
    }>((props, ref) => {
      const todoDetail = useAppSelector((state) => state.todos.todoDetail);
      const [value, setValue] = useState('');

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

      return (
        <>
          <div className="todo-editor-container">
            <RichEditor todoId={todoDetail.id} onSave={props.onSave} onChange={props.onChange} open={props.open}></RichEditor>
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
      variant="borderless"
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

  const todoContent = useRef('');

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

    const content = todoContent.current;
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

  const onSave = (content: string) => {
    if (closing.current) {
      return;
    }

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
        id: todoDetail.id,
        name: title,
        content
      })
      .then(() => {
        onClose();
      })
      .finally(() => {
        closing.current = false;
      });
  };

  const onChange = (content: string) => {
    todoContent.current = content;
  };

  return (
    <Drawer
      placement={placement}
      width={720}
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
      <TodoEditor ref={todoEditorRef} onSave={onSave} onChange={onChange} open={open} />
    </Drawer>
  );
};

export default React.memo(TodoDrawer);

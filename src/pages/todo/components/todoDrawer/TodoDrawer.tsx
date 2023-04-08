import './todoDrawer.less';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor, Toolbar} from '@wangeditor/editor-for-react';
import {Drawer, DrawerProps, Input} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';

interface TodoDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TodoEditor: React.FC = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('<p>hello</p>');

  useEffect(() => {
    // setTimeout(() => {
    //   setHtml('<p>hello world</p>');
    // }, 1500);
  }, []);

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
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{height: 'calc(100% - 120px)'}}
        />
      </div>
    </>
  );
};

const TodoTitle = () => {
  return <Input placeholder="请输入待办事项" bordered={false} />;
};

const TodoDrawer = (props: TodoDrawerProps) => {
  const {open, onClose} = props;
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');

  return (
    <Drawer
      title=""
      placement={placement}
      width={600}
      onClose={onClose}
      open={open}
      autoFocus={true}
      closeIcon={<div>关闭</div>}
      mask={false}
      className="todo-drawer-container"
      extra={<TodoTitle />}
    >
      <TodoEditor></TodoEditor>
    </Drawer>
  );
};

export default TodoDrawer;

import './noteEditor.less';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor, Toolbar} from '@wangeditor/editor-for-react';
import {Button, Input} from 'antd';
import React, {useEffect, useState} from 'react';

const NoteEditor: React.FC = React.memo((props) => {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>');

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    placeholder: '请输入内容...'
  };

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div className="note-editor-container">
      <div className="note-title-container">
        <Input
          className="note-title"
          placeholder="请输入笔记标题"
          bordered={false}
        ></Input>
        <Button type="link" style={{fontSize: '14px'}}>
          保存
        </Button>
      </div>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        className="toolbar"
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => setHtml(editor.getHtml())}
        mode="default"
        className="editor"
      />
    </div>
  );
});

export default NoteEditor;

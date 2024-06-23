import './index.less';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import {message} from 'antd';
// https://braft.margox.cn/
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import {nanoid} from 'nanoid';
import React from 'react';

interface Props {
  noteId?: string;
  todoId?: string | number;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  open?: boolean;
}

export default class RichEditor extends React.Component<Props> {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null)
  };

  async componentDidMount () {
    if (this.props.open) {
      window.api.getTodoDetail({
        id: this.props.todoId
      }).then(res => {
        this.props.onChange?.(res?.content || null);
        this.setState({
          editorState: BraftEditor.createEditorState(res?.content || null)
        });
      });
    }
  }

  componentWillUpdate(prevProps: Readonly<Props>): void {
    console.group("g1");
    console.log('🛺 dcc91d-Log-Info', prevProps.noteId);
    console.log('🛺 316e18-Log-Info', this.props.noteId);
    console.groupEnd();
    if (prevProps.noteId !== this.props.noteId && this.props.noteId !== '') {
      window.api.getNoteDetail({
        noteId: this.props.noteId
      }).then(res => {
        this.props.onChange?.(res?.result?.content || null);
        this.setState({
          editorState: BraftEditor.createEditorState(res?.result?.content || null)
        });
      });

    }
  }

  messageKey = '';
  isSaving = false;

  submitContent = async () => {
    // 处理笔记内容的保存
    if (this.props.noteId) {
      if (this.isSaving) {
        return;
      }

      const htmlContent = this.state.editorState.toHTML();

      this.isSaving = true;

      window.api.updateNoteContent({
        noteId: this.props.noteId,
        content: htmlContent
      }).then(() => {
        if (this.messageKey) {
          message.destroy(this.messageKey);
        }

        this.messageKey = nanoid();

        message.success({
          key: this.messageKey,
          content: '保存成功'
        });
      }).finally(() => {
        this.isSaving = false;
      });
      return;
    }

    // 处理待办相关的保存逻辑
    this.props.onSave(this.state.editorState.toHTML());
  };

  handleEditorChange = (editorState) => {
    this.setState({editorState});
    this.props.onChange?.(this.state.editorState.toHTML());
  };

  render () {
    const {editorState} = this.state;
    return (
      <div className="rich-editor-container">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          excludeControls={['media']}
        />
      </div>
    );

  }
}

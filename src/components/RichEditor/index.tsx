import './index.less';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import {message} from 'antd';
// https://braft.margox.cn/
// 引入编辑器组件
import BraftEditor, {EditorState} from 'braft-editor';
import {nanoid} from 'nanoid';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useAppSelector} from 'src/hooks/store';
import {isEmptyValue, isNoteTrashGroup} from 'src/utils/util';

interface Props {
  noteId?: string;
  todoId?: string | number;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  open?: boolean;
}

const RichEditor: React.FC<Props> = (props) => {
  const {open, todoId, onChange, noteId, onSave} = props;

  /** 编辑器的值 */
  const [editorState, setEditorState] = useState<EditorState>(BraftEditor.createEditorState(null));

  /** 消息 Key */
  const messageKey = useRef('');

  /** 是否正在保存 */
  const isSaving = useRef(false);

  /** 是否已经更新 */
  const isUpdated = useRef(false);

  useEffect(() => {
    if (open && !isEmptyValue(todoId)) {
      window.api.getTodoDetail({
        id: todoId
      }).then(res => {
        onChange?.(res?.content || null);
        setEditorState(BraftEditor.createEditorState(res?.content || null));
      });
    }
  }, [onChange, open, todoId]);

  useEffect(() => {
    if (!isEmptyValue(noteId)) {
      window.api.getNoteDetail({
        noteId
      }).then(res => {
        setEditorState(BraftEditor.createEditorState(res?.result?.content || null));
      });
    }
  }, [noteId]);

  const saveInterval = useRef(null);

  const submitContent = useCallback((ignoreMessage = false) => {
    // 处理笔记内容的保存
    if (!isEmptyValue(noteId)) {
      if (isSaving.current) {
        return;
      }

      const htmlContent = editorState.toHTML();

      isSaving.current = true;

      window.api.updateNoteContent({
        noteId,
        content: htmlContent
      }).then(() => {
        if (messageKey.current) {
          message.destroy(messageKey.current);
        }

        messageKey.current = nanoid();

        if (!ignoreMessage) {
          message.success({
            key: messageKey.current,
            content: '保存成功'
          });
        }

        isUpdated.current = false;

      }).finally(() => {
        isSaving.current = false;
      });
    }

    // 处理待办内容的保存
    if (!isEmptyValue(todoId) && open) {
      onSave(editorState.toHTML());
    }
  }, [editorState, noteId, onSave, open, todoId]);

  useEffect(() => {
    saveInterval.current = setInterval(() => {
      if (isUpdated.current) {
        submitContent(true);
      }
    }, 500);

    return () => {
      clearInterval(saveInterval.current);
    };
  }, [submitContent]);

  const handleEditorChange = useCallback((value) => {
    isUpdated.current = true;
    setEditorState(value);
    onChange?.(value.toHTML());
  }, [onChange]);

  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );

  // 是否为废纸篓界面
  const isTrash = useMemo(() => {
    return isNoteTrashGroup(currentNoteGroupId);
  }, [currentNoteGroupId]);

  return (
    <div className="rich-editor-container">
      <BraftEditor
        value={editorState}
        onChange={handleEditorChange}
        onSave={submitContent}
        excludeControls={['media']}
        readOnly={isTrash}
      />
    </div>
  );
};

export default RichEditor;

import './noteEditor.less';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor, Toolbar} from '@wangeditor/editor-for-react';
import {Input, message} from 'antd';
import {cloneDeep, isNull, isUndefined} from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/hooks/store';
import {setCurrentNoteDetail, setNoteList} from 'src/store/notes';

const NoteEditor: React.FC = React.memo(() => {
  const currentNoteId = useAppSelector((state) => state.notes.currentNoteId);
  const currentNoteGroupId = useAppSelector(
    (state) => state.group.currentNoteGroupId
  );
  const currentNoteDetail = useAppSelector(
    (state) => state.notes.currentNoteDetail
  );
  const noteList = useAppSelector((state) => state.notes.noteList);
  const dispatch = useDispatch();
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 编辑器内容
  const [html, setHtml] = useState(currentNoteDetail?.content || '');
  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
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

  // 是否为废纸篓界面
  const isTrash = useMemo(() => {
    return currentNoteGroupId === '-4';
  }, [currentNoteGroupId]);

  const updateNoteTitleTimer = useRef(null);
  const updateNoteTitleWarningTimer = useRef(null);

  /** 监听标题发生变化 */
  const onNoteTitleChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (!value?.trim()) {
        if (updateNoteTitleWarningTimer.current === null) {
          message.warning('笔记标题不可为空');
          updateNoteTitleWarningTimer.current = setTimeout(() => {
            updateNoteTitleWarningTimer.current = null;
          }, 3000);
        }
        return;
      }

      // 设置 store 中的标题信息
      dispatch(
        setCurrentNoteDetail({
          ...currentNoteDetail,
          title: value
        })
      );

      // 设置笔记列表中的标题信息
      const index = noteList.findIndex((item) => item.id === currentNoteId);
      if (index > -1) {
        const _noteList = cloneDeep(noteList);
        _noteList[index].title = value;
        _noteList[index].updateTime = new Date().getTime();
        dispatch(setNoteList(_noteList));
      }

      const targetNoteId = currentNoteId;
      if (updateNoteTitleTimer.current !== null) {
        clearTimeout(updateNoteTitleTimer.current);
        updateNoteTitleTimer.current = null;
      }

      // 设置数据库中的标题信息
      updateNoteTitleTimer.current = setTimeout(() => {
        window.api.updateNoteTitle({noteId: targetNoteId, title: value});
        updateNoteTitleTimer.current = null;
      }, 500);
    },
    [currentNoteDetail, currentNoteId, dispatch, noteList]
  );

  // 监听笔记 ID 发生变化, 设置笔记内容
  useEffect(() => {
    if (!isUndefined(currentNoteDetail?.id)) {
      console.log('设置笔记内容', currentNoteDetail.content);
      setHtml(currentNoteDetail.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoteDetail?.id]);

  const updateNoteContentTimer = useRef(null);

  // 监听 html 发生变化
  useEffect(() => {
    if (
      currentNoteDetail?.content === html ||
      isUndefined(currentNoteDetail?.content)
    ) {
      return;
    }

    if (!isNull(updateNoteContentTimer.current)) {
      clearTimeout(updateNoteContentTimer.current);
      updateNoteContentTimer.current = null;
    }

    // 设置笔记列表中的更新时间
    const index = noteList.findIndex((item) => item.id === currentNoteId);
    if (index > -1) {
      const _noteList = cloneDeep(noteList);
      _noteList[index].updateTime = new Date().getTime();
      dispatch(setNoteList(_noteList));
    }

    const noteId = currentNoteDetail?.id;
    const _html = html;
    if (!isNull(noteId)) {
      updateNoteContentTimer.current = setTimeout(() => {
        console.log('调用接口保存数据', _html);
        window.api.updateNoteContent({noteId, content: _html});
        updateNoteContentTimer.current = null;
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  useEffect(() => {
    if (isTrash) {
      editor?.disable();
    } else {
      editor?.enable();
    }
  }, [isTrash, editor]);

  return (
    <div
      className="note-editor-container"
      style={{
        visibility: currentNoteDetail ? 'visible' : 'hidden'
      }}
    >
      <div className="note-title-container">
        <Input
          className="note-title"
          placeholder="请输入笔记标题"
          bordered={false}
          value={currentNoteDetail?.title}
          onChange={onNoteTitleChange}
          disabled={isTrash}
        ></Input>
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

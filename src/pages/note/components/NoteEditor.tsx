import './noteEditor.less';
import './quill-editor.less';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

import {Input, message} from 'antd';
import {cloneDeep, isNil, isNull} from 'lodash';
import Quill from 'quill';
import * as Emoji from 'quill-emoji';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import ReactQuill from 'react-quill';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'src/hooks/store';
import {setCurrentNoteDetail, setNoteList} from 'src/store/notes';
import {quillFormats, quillModules} from 'src/utils/quill';
Quill.register('modules/emoji', Emoji);

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

  const modules = useRef(quillModules);
  const formats = useRef(quillFormats);

  // 是否为废纸篓界面
  const isTrash = useMemo(() => {
    return currentNoteGroupId === '-4';
  }, [currentNoteGroupId]);

  const updateNoteTitleTimer = useRef(null);
  const updateNoteTitleWarningTimer = useRef(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (!isNil(currentNoteDetail?.id)) {
      setValue(currentNoteDetail?.content || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoteDetail?.id]);

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

  const onEditorChange = useCallback((e) => {
    setValue(e);
  }, []);

  const updateNoteContentTimer = useRef(null);

  useEffect(() => {
    if (currentNoteDetail?.content === value) {
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
    if (!isNull(noteId)) {
      updateNoteContentTimer.current = setTimeout(() => {
        window.api.updateNoteContent({noteId, content: value});
        updateNoteContentTimer.current = null;
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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

  return (
    <div
      className="note-editor-container"
      style={{
        visibility: currentNoteDetail ? 'visible' : 'hidden'
      }}
    >
      {currentNoteDetail ? (
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
      ) : null}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(e) => onEditorChange(e)}
        modules={modules.current}
        formats={formats.current}
        placeholder="请输入笔记内容"
        readOnly={isTrash}
      />
    </div>
  );
});

export default NoteEditor;

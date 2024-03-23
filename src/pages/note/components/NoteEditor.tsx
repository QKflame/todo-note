import './noteEditor.less';

import {Input, message} from 'antd';
import {cloneDeep, isNil} from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useDispatch} from 'react-redux';
import RichEditor from 'src/components/RichEditor';
import {useAppSelector} from 'src/hooks/store';
import {store} from 'src/store';
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
            variant="borderless"
            value={currentNoteDetail?.title}
            onChange={onNoteTitleChange}
            disabled={isTrash}
          ></Input>
        </div>
      ) : null}
      <RichEditor noteId={store.getState().notes.currentNoteId}></RichEditor>
    </div>
  );
});

export default NoteEditor;

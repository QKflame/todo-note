import {createSlice} from '@reduxjs/toolkit';
import {NoteItem} from 'src/types/note';

interface NotesState {
  /** 笔记列表 */
  noteList: Array<NoteItem>;
  /** 当前选中的笔记ID */
  currentNoteId: string;
  /** 当前笔记的详细信息 */
  currentNoteDetail: NoteItem | null;
}

const initialState: NotesState = {
  noteList: [],
  currentNoteId: '',
  currentNoteDetail: null
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNoteList(state, {payload}: { payload: Array<NoteItem> }) {
      state.noteList = payload;
    },
    setCurrentNoteId(state, {payload}: { payload: string }) {
      state.currentNoteId = payload;
    },
    setCurrentNoteDetail(state, {payload}: { payload: NoteItem | null }) {
      state.currentNoteDetail = payload;
    }
  }
});

export const {setNoteList, setCurrentNoteId, setCurrentNoteDetail} =
  notesSlice.actions;
export default notesSlice.reducer;

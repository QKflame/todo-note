import {createSelector, createSlice} from '@reduxjs/toolkit';

interface GroupState {
  // 当前选中的计划ID
  currentTodoGroupId: string;
  // 当前选中的笔记分组ID
  currentNoteGroupId: string;
  // 待办列表
  todoGroups: Array<{
    id: number;
    title: string;
  }>;
  // 笔记列表
  noteGroups: Array<{
    id: number;
    title: string;
  }>;
}

const initialState: GroupState = {
  currentTodoGroupId: localStorage.getItem('CURRENT_TODO_GROUP_ID') || '-1',
  currentNoteGroupId: localStorage.getItem('CURRENT_NOTE_GROUP_ID') || '-3',
  todoGroups: [],
  noteGroups: []
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setCurrentTodoGroupId(state, {payload}) {
      localStorage.setItem('CURRENT_TODO_GROUP_ID', payload.groupId);
      state.currentTodoGroupId = payload.groupId;
    },
    setCurrentNoteGroupId(state, {payload}) {
      localStorage.setItem('CURRENT_NOTE_GROUP_ID', payload.groupId);
      state.currentNoteGroupId = payload.groupId;
    },
    setTodoGroups(state, {payload}) {
      state.todoGroups = payload.groups;
    },
    setNoteGroups(state, {payload}) {
      state.noteGroups = payload.groups;
    }
  }
});

const group = (state) => state.group;

const isTrashSelector = createSelector(
  group,
  (_) => _.currentTodoGroupId.toString() === '-2'
);

export const {
  setCurrentTodoGroupId,
  setTodoGroups,
  setNoteGroups,
  setCurrentNoteGroupId
} = groupSlice.actions;
export {isTrashSelector};
export default groupSlice.reducer;

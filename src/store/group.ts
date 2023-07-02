import {createSelector, createSlice} from '@reduxjs/toolkit';

interface GroupState {
  // 当前选中的计划ID
  currentTodoGroupId: string;
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
  currentTodoGroupId: localStorage.getItem('CURRENT_GROUP_ID') || 'recent',
  todoGroups: [],
  noteGroups: []
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setCurrentTodoGroupId(state, {payload}) {
      localStorage.setItem('CURRENT_GROUP_ID', payload.groupId);
      state.currentTodoGroupId = payload.groupId;
    },
    setTodoGroups(state, {payload}) {
      state.todoGroups = payload.groups;
    }
  }
});

const group = (state) => state.group;

const isTrashSelector = createSelector(
  group,
  (_) => _.currentTodoGroupId.toString() === '-2'
);

export const {setCurrentTodoGroupId, setTodoGroups} = groupSlice.actions;
export {isTrashSelector};
export default groupSlice.reducer;

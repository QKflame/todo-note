import {createSelector, createSlice} from '@reduxjs/toolkit';

interface GroupState {
  // 当前选中的计划ID
  currentGroupId: string;
  // 计划列表
  groups: Array<{
    id: number;
    title: string;
  }>;
}

const initialState: GroupState = {
  currentGroupId: localStorage.getItem('CURRENT_GROUP_ID') || 'recent',
  groups: []
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setCurrentGroupId(state, {payload}) {
      localStorage.setItem('CURRENT_GROUP_ID', payload.groupId);
      state.currentGroupId = payload.groupId;
    },
    setGroups(state, {payload}) {
      state.groups = payload.groups;
    }
  }
});

const group = (state) => state.group;

const isTrashSelector = createSelector(
  group,
  (_) => _.currentGroupId.toString() === '-2'
);

export const {setCurrentGroupId, setGroups} = groupSlice.actions;
export {isTrashSelector};
export default groupSlice.reducer;

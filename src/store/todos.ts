import {createSlice} from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    onlyShowUnfinishedChecked: false,
    onlyShowHighPriorityChecked: false
  },
  reducers: {
    toggleOnlyShowUnfinishedChecked(state) {
      state.onlyShowUnfinishedChecked = !state.onlyShowUnfinishedChecked;
    },
    toggleOnlyShowHighPriorityChecked(state) {
      state.onlyShowHighPriorityChecked = !state.onlyShowHighPriorityChecked;
    }
  }
});

export const {
  toggleOnlyShowUnfinishedChecked,
  toggleOnlyShowHighPriorityChecked
} = todosSlice.actions;
export default todosSlice.reducer;

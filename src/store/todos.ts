import {createSlice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';

interface TodosState {
  onlyShowUnfinishedChecked: boolean;
  onlyShowHighPriorityChecked: boolean;
  todoDetail: {
    id: number;
    name: string;
    content: null | string;
  };
  isTodoDrawerOpened: boolean;
}

const initTodoDetail = {
  id: -1,
  content: '',
  name: ''
};

const initialState: TodosState = {
  onlyShowUnfinishedChecked: false,
  onlyShowHighPriorityChecked: false,
  todoDetail: initTodoDetail,
  isTodoDrawerOpened: false
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleOnlyShowUnfinishedChecked(state) {
      state.onlyShowUnfinishedChecked = !state.onlyShowUnfinishedChecked;
    },
    toggleOnlyShowHighPriorityChecked(state) {
      state.onlyShowHighPriorityChecked = !state.onlyShowHighPriorityChecked;
    },
    setTodoDetail(state, {payload}) {
      state.todoDetail = cloneDeep(payload);
    },
    resetTodoDetail(state) {
      state.todoDetail = initTodoDetail;
    },
    toggleIsTodoDrawerOpened(state) {
      state.isTodoDrawerOpened = !state.isTodoDrawerOpened;
    }
  }
});

export const {
  toggleOnlyShowUnfinishedChecked,
  toggleOnlyShowHighPriorityChecked,
  setTodoDetail,
  toggleIsTodoDrawerOpened,
  resetTodoDetail
} = todosSlice.actions;
export default todosSlice.reducer;

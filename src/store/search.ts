import {createSlice} from '@reduxjs/toolkit';

interface SearchState {
  keyword: string;
  searchDialogVisible: boolean;
}

const initialState: SearchState = {
  keyword: '',
  searchDialogVisible: false
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword(state, {payload}: { payload: string }) {
      state.keyword = payload;
    },
    setSearchDialogVisible(state, {payload}: { payload: boolean }) {
      state.searchDialogVisible = payload;
    }
  }
});

export const {setKeyword, setSearchDialogVisible} = searchSlice.actions;
export default searchSlice.reducer;

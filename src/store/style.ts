import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  headerHeight: '60px'
};

const styleSlice = createSlice({
  name: 'style',
  initialState,
  reducers: {}
});

export default styleSlice.reducer;

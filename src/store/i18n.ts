import {createSlice} from '@reduxjs/toolkit';
import {LocaleType} from 'src/types/i18n';

const initialState: {
  locale: LocaleType;
} = {
  locale: LocaleType.Chinese
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLocale(
      state,
      action: {
        payload: LocaleType;
      }
    ) {
      state.locale = action.payload;
    }
  }
});

export const {setLocale} = i18nSlice.actions;
export default i18nSlice.reducer;

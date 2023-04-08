import {configureStore} from '@reduxjs/toolkit';
import todos from './todos';
import i18n from './i18n';
import style from './style';

export const store = configureStore({
  reducer: {
    todos,
    i18n,
    style
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

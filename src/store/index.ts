import {configureStore} from '@reduxjs/toolkit';

import group from './group';
import i18n from './i18n';
import style from './style';
import todos from './todos';

export const store = configureStore({
  reducer: {
    todos,
    i18n,
    style,
    group
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

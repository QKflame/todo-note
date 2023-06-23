import {configureStore} from '@reduxjs/toolkit';

import i18n from './i18n';
import plan from './plan';
import style from './style';
import todos from './todos';

export const store = configureStore({
  reducer: {
    todos,
    i18n,
    style,
    plan
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

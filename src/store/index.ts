import {configureStore} from '@reduxjs/toolkit';

import group from './group';
import i18n from './i18n';
import notes from './notes';
import search from './search';
import style from './style';
import todos from './todos';

export const store = configureStore({
  reducer: {
    todos,
    i18n,
    style,
    group,
    notes,
    search
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import {memo} from 'react';
import {IntlProvider} from 'react-intl';
import {Route, Routes} from 'react-router-dom';
import Header from 'src/components/header/Header';
import {useAppSelector} from 'src/hooks/store';
import {translationsForLocale} from 'src/locales';

import Note from './note/Note';
import Todo from './todo/Todo';

const App = memo(() => {
  const locale = useAppSelector((state) => state.i18n.locale);
  const headerHeight = useAppSelector((state) => state.style.headerHeight);
  const headerMarginBottom = useAppSelector(
    (state) => state.style.headerMarginBottom
  );

  return (
    <IntlProvider locale={locale} messages={translationsForLocale[locale]}>
      <Header></Header>
      <div
        className="app-page"
        style={{
          height: `calc(100vh - ${headerHeight} - ${headerMarginBottom})`
        }}
      >
        <Routes>
          <Route path="/" element={<Todo />}></Route>
          <Route path="todo" element={<Todo />}></Route>
          <Route path="note" element={<Note />}></Route>
        </Routes>
      </div>
    </IntlProvider>
  );
});

export default App;

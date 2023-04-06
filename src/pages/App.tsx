import {memo} from 'react';
import {useAppSelector} from 'src/hooks/store';
import {IntlProvider} from 'react-intl';
import {translationsForLocale} from 'src/locales';
import Header from 'src/components/header/Header';
import {Route, Routes} from 'react-router-dom';
import Todo from './todo/Todo';

const App = memo(() => {
  const locale = useAppSelector((state) => state.i18n.locale);
  return (
    <IntlProvider locale={locale} messages={translationsForLocale[locale]}>
      <Header></Header>
      <Routes>
        <Route path="todo" element={<Todo />}></Route>
      </Routes>
    </IntlProvider>
  );
});

export default App;

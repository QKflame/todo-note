import {memo, useEffect} from 'react';
import {IntlProvider} from 'react-intl';
import {Route, Routes} from 'react-router-dom';
import Header from 'src/components/header/Header';
import {useAppSelector} from 'src/hooks/store';
import {translationsForLocale} from 'src/locales';
import styled from 'styled-components';

import Todo from './todo/Todo';

const App = memo(() => {
  const locale = useAppSelector((state) => state.i18n.locale);
  const headerHeight = useAppSelector((state) => state.style.headerHeight);
  const headerMarginBottom = useAppSelector(
    (state) => state.style.headerMarginBottom
  );

  const PageWrapper = styled.div`
    height: calc(100vh - ${headerHeight} - ${headerMarginBottom});
  `;

  return (
    <IntlProvider locale={locale} messages={translationsForLocale[locale]}>
      <Header></Header>
      <PageWrapper className="app-page">
        <Routes>
          <Route path="todo" element={<Todo />}></Route>
        </Routes>
      </PageWrapper>
    </IntlProvider>
  );
});

export default App;

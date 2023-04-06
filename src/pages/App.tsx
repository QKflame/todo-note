import {memo} from 'react';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';
import {FormattedMessage, IntlProvider} from 'react-intl';
import {translationsForLocale} from 'src/locales';
import {setLocale} from 'src/store/i18n';
import {LocaleType} from 'src/types/i18n';
import {Button} from 'antd';

const App = memo(() => {
  const locale = useAppSelector((state) => state.i18n.locale);
  const dispatch = useAppDispatch();

  return (
    <IntlProvider locale={locale} messages={translationsForLocale[locale]}>
      <Button>点击</Button>
      <FormattedMessage id="name"></FormattedMessage>
    </IntlProvider>
  );
});

export default App;

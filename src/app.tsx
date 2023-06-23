import {ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {HashRouter, Route, Routes} from 'react-router-dom';

import App from './pages/App';
import {store} from './store';

function render() {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <HashRouter>
          <Routes>
            <Route path="/*" element={<App />}></Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    </Provider>
  );
}

render();

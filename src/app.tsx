import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {HashRouter, Route, Routes} from 'react-router-dom';

import App from './pages/App';
import {store} from './store';

function render() {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  );
}

render();

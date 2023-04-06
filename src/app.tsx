import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './store';
import {RouterProvider} from 'react-router-dom';
import router from './router';

function render() {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

render();

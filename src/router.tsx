import {createBrowserRouter} from 'react-router-dom';
import App from './pages/App';

const router = createBrowserRouter([
  {
    path: '/main_window',
    element: <App />
  }
]);

export default router;

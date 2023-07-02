import {useLocation} from 'react-router-dom';

export default function usePageType() {
  const location = useLocation();
  return {
    isTodo: location.pathname === '/todo',
    isNote: location.pathname === '/note'
  };
}

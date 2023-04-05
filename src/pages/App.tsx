import {memo} from 'react';
import {todoAdded} from '../store/todos';
import {useAppDispatch, useAppSelector} from 'src/hooks/store';

const App = memo((props) => {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();
  console.log('props', props);
  console.log('todos', todos);

  return <div onClick={() => {
    dispatch(todoAdded({
      id: '1',
      text: '456',
      completed: false
    }));
  }}>123</div>;
});

export default App;

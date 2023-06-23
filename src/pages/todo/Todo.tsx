import './todo.less';

import PlanMenu from './components/planMenu/PlanMenu';
import TodoList from './components/todoList/TodoList';

const Todo = () => {
  return (
    <div className="todo-page">
      <PlanMenu></PlanMenu>
      <TodoList></TodoList>
    </div>
  );
};

export default Todo;

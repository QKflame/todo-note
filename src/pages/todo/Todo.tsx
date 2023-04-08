import './todo.less';

import styled from 'styled-components';

import PlanMenu from './components/planMenu/PlanMenu';
import TodoList from './components/todoList/TodoList';

const Todo = () => {
  const TodoPage = styled.div``;

  return (
    <TodoPage className="todo-page">
      <PlanMenu></PlanMenu>
      <TodoList></TodoList>
    </TodoPage>
  );
};

export default Todo;

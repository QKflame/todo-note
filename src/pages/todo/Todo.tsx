import './todo.less';

import GroupMenu from 'src/components/groupMenu/GroupMenu';

import TodoList from './components/todoList/TodoList';

const Todo = () => {
  return (
    <div className="todo-page">
      <GroupMenu></GroupMenu>
      <TodoList></TodoList>
    </div>
  );
};

export default Todo;

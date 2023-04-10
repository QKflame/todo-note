import {nanoid} from 'nanoid';
import {getRealm} from 'src/models';
import {ModelName} from 'src/types/model';

export async function createTodo() {
  const realm = await getRealm();
  realm.write(() => {
    const task = realm.create(ModelName.Todo, {
      _id: nanoid(),
      title: '我的待办',
      created_at: 0,
      updated_at: 1
    });
    console.log('task', task.title);
  });
}

export async function getTodoList() {
  console.log('执行到此处');
  const realm = await getRealm();
  const todoList = realm.objects(ModelName.Todo);
  console.log('todoList', todoList);
  return {};
}

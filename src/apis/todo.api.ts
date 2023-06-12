export const defaultTodoPriority = 0;
export const defaultTodoProgress = 0;

/** 创建待办事项 */
export async function createTodo(db, event, params) {
  console.log('params', params);
  const insertStmt = db.prepare(
    'INSERT INTO todos (name, planId, createTime, updateTime, priority, progress) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const name = params.name;
  // TODO:
  const planId = 1;
  const createTime = new Date().getTime();
  const updateTime = createTime;
  const priority = defaultTodoPriority;
  const progress = defaultTodoProgress;
  return insertStmt.run(
    name,
    planId,
    createTime,
    updateTime,
    priority,
    progress
  );
}

/** 获取待办列表 */
export async function getTodoList(db, params) {
  const query = db.prepare('select * from todos');
  const result = query.all();
  return {
    result
  };
}

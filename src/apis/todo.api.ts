export const defaultTodoPriority = 2;
export const defaultTodoProgress = 0;

/** 创建待办事项 */
export async function createTodo(db, event, params) {
  const insertStmt = db.prepare(
    'INSERT INTO todos (name, groupId, createTime, updateTime, priority, progress) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const name = params.name;
  const createTime = new Date().getTime();
  const updateTime = createTime;
  const priority = defaultTodoPriority;
  const progress = defaultTodoProgress;
  return insertStmt.run(
    name,
    params.groupId,
    createTime,
    updateTime,
    priority,
    progress
  );
}

/** 获取待办列表 */
export async function getTodoList(db, event, params) {
  // 废纸篓的数据
  if (params.groupId.toString() === '-2') {
    const query = db.prepare(
      'select id, name, groupId, createTime, updateTime, deleteTime, priority, progress, deadline from todos where deleteTime is not null'
    );
    return {
      result: query.all()
    };
  }
  const query = db.prepare(
    'select id, name, groupId, createTime, updateTime, deleteTime, priority, progress, deadline from todos where deleteTime is null and groupId = ?'
  );
  const result = query.all(params.groupId);
  return {
    result
  };
}

/** 修改 todo 的优先级 */
export async function updateTodoPriority(db, event, params) {
  const updateStatement = db.prepare(
    'update todos set priority = ?, updateTime = ? where id = ?'
  );
  return updateStatement.run(params.priority, new Date().getTime(), params.id);
}

/** 修改 todo 的进度 */
export async function updateTodoProgress(db, event, params) {
  const updateStatement = db.prepare(
    'update todos set progress = ?, updateTime = ? where id = ?'
  );
  return updateStatement.run(params.progress, new Date().getTime(), params.id);
}

/** 修改 todo 的截止时间 */
export async function updateTodoDeadline(db, event, params) {
  const updateStatement = db.prepare(
    'update todos set deadline = ?, updateTime = ? where id = ?'
  );
  return updateStatement.run(params.deadline, new Date().getTime(), params.id);
}

/** 获取 todo 的详细信息 */
export async function getTodoDetail(db, event, params) {
  const statement = db.prepare(
    'select name, id, content from todos where id = ?'
  );
  return statement.get(params.id);
}

/** 设置 todo 的详细信息 */
export async function updateTodoDetail(db, event, params) {
  const statement = db.prepare(
    'update todos set name = ?, content = ?, updateTime = ? where id = ?'
  );
  return statement.run(
    params.name,
    params.content,
    new Date().getTime(),
    params.id
  );
}

/** 批量完成待办事项 */
export async function batchFinishTodo(db, event, params) {
  const statement = db.prepare(
    'update todos set progress = @progress, updateTime = @updateTime where id = @id'
  );
  const updateTime = new Date().getTime();
  const transaction = db.transaction((records) => {
    for (const id of records) {
      statement.run({
        id,
        progress: 100,
        updateTime
      });
    }
  });
  return transaction(params.ids);
}

/** 批量删除待办事项 */
export async function batchDeleteTodo(db, event, params) {
  // 在废纸篓中删除
  if (params.hard) {
    const transaction = db.transaction(() => {
      const deleteStatement = db.prepare('DELETE FROM todos WHERE id = ?');

      for (const id of params.ids) {
        deleteStatement.run(id);
      }
    });
    return transaction();
  }

  const statement = db.prepare(
    'update todos set deleteTime = @deleteTime, updateTime = @updateTime where id = @id'
  );
  const deleteTime = new Date().getTime();
  const transaction = db.transaction((records) => {
    for (const id of records) {
      statement.run({
        id,
        deleteTime,
        updateTime: deleteTime
      });
    }
  });
  return transaction(params.ids);
}

/** 批量恢复待办事项 */
export async function batchRecoverTodo(db, event, params) {
  const cachedGroupIds: any = {};
  const transaction = db.transaction(() => {
    for (const todoId of params.ids) {
      const getTodoDetailStatement = db.prepare(
        'select name, id, groupId, content from todos where id = ?'
      );
      const todoDetail = getTodoDetailStatement.get(todoId);

      const groupId = todoDetail.groupId;

      const getGroupDetailStatement = db.prepare(
        `select id, deleteTime from groups where id = ?`
      );

      const updateTodoStatement = db.prepare(
        `update todos set deleteTime = null, groupId = ? where id = ?`
      );

      // 分组未被删除
      if (cachedGroupIds[groupId] === 1) {
        updateTodoStatement.run(groupId, todoId);
        return;
      }

      // 分组被删除
      if (cachedGroupIds[groupId] === 2) {
        updateTodoStatement.run(-1, todoId);
      }

      const groupDetail = getGroupDetailStatement.get(groupId);
      // 分组未被删除
      if (!groupDetail.deleteTime) {
        cachedGroupIds[todoDetail.groupId] = 1;
        updateTodoStatement.run(groupId, todoId);
        return;
      }

      // 分组已被删除
      cachedGroupIds[todoDetail.groupId] = 2;
      updateTodoStatement.run(-1, todoId);
    }
  });
  return transaction();
}

/** 新建分组 */
export async function createTodoGroup(db, event, params) {
  const statement = db.prepare(
    'insert into groups (title, parentId, createTime) values (?, ?, ?)'
  );
  return statement.run(
    params.title,
    params.parentId || null,
    new Date().getTime()
  );
}

/** 修改分组 */
export async function updateTodoGroup(db, event, params) {
  const statement = db.prepare(
    'update groups set title = @title, parentId = @parentId where id = @id'
  );
  return statement.run({
    title: params.title,
    parentId: params.parentId || null,
    id: params.id
  });
}

/** 删除分组 */
export async function deleteTodoGroup(db, event, params) {
  const statement = db.prepare(
    'update groups set deleteTime = @deleteTime where id = @id'
  );
  const statement2 = db.prepare(
    'update todos set deleteTime = ? where groupId = ? and deleteTime is null'
  );

  const deleteTime = new Date().getTime();
  const transaction = db.transaction(() => {
    statement.run({
      deleteTime,
      id: params.id
    });
    statement2.run(deleteTime, params.id);
  });
  return transaction();
}

/** 获取分组 */
export async function getTodoGroupList(db) {
  const query = db.prepare(
    'select id, title, parentId, createTime, deleteTime from groups where deleteTime is null'
  );
  const result = query.all();
  return {
    result
  };
}

/** 批量移动分组 */
export async function batchRemoveGroup(db, event, params) {
  const transaction = db.transaction(() => {
    for (const id of params.ids) {
      const statement = db.prepare('update todos set groupId = ? where id = ?');
      statement.run(params.groupId, id);
    }
  });
  return transaction();
}

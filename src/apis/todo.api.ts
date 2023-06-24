export const defaultTodoPriority = 2;
export const defaultTodoProgress = 0;

/** 创建待办事项 */
export async function createTodo(db, event, params) {
  const insertStmt = db.prepare(
    'INSERT INTO todos (name, planId, createTime, updateTime, priority, progress) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const name = params.name;
  const createTime = new Date().getTime();
  const updateTime = createTime;
  const priority = defaultTodoPriority;
  const progress = defaultTodoProgress;
  return insertStmt.run(
    name,
    params.planId,
    createTime,
    updateTime,
    priority,
    progress
  );
}

/** 获取待办列表 */
export async function getTodoList(db, event, params) {
  // 废纸篓的数据
  if (params.planId.toString() === '-2') {
    const query = db.prepare(
      'select id, name, planId, createTime, updateTime, deleteTime, priority, progress from todos where deleteTime is not null'
    );
    return {
      result: query.all()
    };
  }
  const query = db.prepare(
    'select id, name, planId, createTime, updateTime, deleteTime, priority, progress from todos where deleteTime is null and planId = ?'
  );
  const result = query.all(params.planId);
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
  const cachedPlanIds: any = {};
  const transaction = db.transaction(() => {
    for (const todoId of params.ids) {
      const getTodoDetailStatement = db.prepare(
        'select name, id, planId, content from todos where id = ?'
      );
      const todoDetail = getTodoDetailStatement.get(todoId);

      const planId = todoDetail.planId;

      const getPlanDetailStatement = db.prepare(
        `select id, deleteTime from plans where id = ?`
      );

      const updateTodoStatement = db.prepare(
        `update todos set deleteTime = null, planId = ? where id = ?`
      );

      // 分组未被删除
      if (cachedPlanIds[planId] === 1) {
        updateTodoStatement.run(planId, todoId);
        return;
      }

      // 分组被删除
      if (cachedPlanIds[planId] === 2) {
        updateTodoStatement.run(-1, todoId);
      }

      const planDetail = getPlanDetailStatement.get(planId);
      // 分组未被删除
      if (!planDetail.deleteTime) {
        cachedPlanIds[todoDetail.planId] = 1;
        updateTodoStatement.run(planId, todoId);
        return;
      }

      // 分组已被删除
      cachedPlanIds[todoDetail.planId] = 2;
      updateTodoStatement.run(-1, todoId);
    }
  });
  return transaction();
}

/** 新建分组 */
export async function createPlanGroup(db, event, params) {
  const statement = db.prepare(
    'insert into plans (title, parentId, createTime) values (?, ?, ?)'
  );
  return statement.run(
    params.title,
    params.parentId || null,
    new Date().getTime()
  );
}

/** 修改分组 */
export async function updatePlanGroup(db, event, params) {
  const statement = db.prepare(
    'update plans set title = @title, parentId = @parentId where id = @id'
  );
  return statement.run({
    title: params.title,
    parentId: params.parentId || null,
    id: params.id
  });
}

/** 删除分组 */
export async function deletePlanGroup(db, event, params) {
  const statement = db.prepare(
    'update plans set deleteTime = @deleteTime where id = @id'
  );
  const statement2 = db.prepare(
    'update todos set deleteTime = ? where planId = ? and deleteTime is null'
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
export async function getPlanGroupList(db) {
  const query = db.prepare(
    'select id, title, parentId, createTime, deleteTime from plans where deleteTime is null'
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
      const statement = db.prepare('update todos set planId = ? where id = ?');
      statement.run(params.planId, id);
    }
  });
  return transaction();
}

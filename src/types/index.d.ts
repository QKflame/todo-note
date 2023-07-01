export type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export interface TodoItem {
  /** 待办 ID */
  id: number;
  /** 待办标题 */
  name: string;
  /** 优先级 */
  priority: number;
  /** 进度 */
  progress: number;
  /** 创建时间 */
  createTime: number;
  /** 修改时间 */
  updateTime: number;
  /** 删除时间 */
  deleteTime: number | null;
}

export declare global {
  interface Window {
    api: {
      createTodo: AsyncFunction<{
        changes: number;
        lastInsertRowid: number;
      }>;
      getTodoList: AsyncFunction<{ result: Array<any> }>;
      updateTodoPriority: AsyncFunction<any>;
      updateTodoProgress: AsyncFunction<any>;
      getTodoDetail: AsyncFunction<any>;
      updateTodoDetail: AsyncFunction<any>;
      batchFinishTodo: AsyncFunction<any>;
      batchDeleteTodo: AsyncFunction<any>;
      createTodoGroup: AsyncFunction<any>;
      updateTodoGroup: AsyncFunction<any>;
      deleteTodoGroup: AsyncFunction<any>;
      getTodoGroupList: AsyncFunction<any>;
      batchRecoverTodo: AsyncFunction<any>;
      batchRemoveGroup: AsyncFunction<any>;
    };
  }
}

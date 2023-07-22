export type ApiFunction<Params, Result> = (...args: Params) => Promise<Result>;

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
      createTodo: ApiFunction;
      getTodoList: ApiFunction;
      updateTodoPriority: ApiFunction;
      updateTodoProgress: ApiFunction;
      updateTodoDeadline: ApiFunction;
      getTodoDetail: ApiFunction;
      updateTodoDetail: ApiFunction;
      batchFinishTodo: ApiFunction;
      batchDeleteTodo: ApiFunction;
      createTodoGroup: ApiFunction;
      updateTodoGroup: ApiFunction;
      deleteTodoGroup: ApiFunction;
      getTodoGroupList: ApiFunction;
      getNoteGroupList: ApiFunction;
      batchRecoverTodo: ApiFunction;
      batchRemoveGroup: ApiFunction;
      createNoteGroup: ApiFunction;
      updateNoteGroup: ApiFunction;
    };
  }
}

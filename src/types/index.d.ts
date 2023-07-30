import {
  CreateNoteParams,
  CreateNoteResponse,
  DeleteNoteParams,
  DeleteNoteResponse,
  GetNoteDetailParams,
  GetNoteDetailResponse,
  GetNoteListParams,
  GetNoteListResponse,
  MoveNoteGroupParams,
  MoveNoteGroupResponse,
  RecoverNoteParams,
  RecoverNoteResponse,
  UpdateNoteContentParams,
  UpdateNoteContentResponse,
  UpdateNoteGroupParams,
  UpdateNoteGroupResponse,
  UpdateNoteTitleParams,
  UpdateNoteTitleResponse
} from 'src/apis/api.definition';

export type ApiFunction<Params, Response> = (
  params: Params
) => Promise<Response>;

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
  /** 分支 ID */
  groupId: string;
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
      createNote: ApiFunction<CreateNoteParams, CreateNoteResponse>;
      getNoteList: ApiFunction<GetNoteListParams, GetNoteListResponse>;
      updateNoteTitle: ApiFunction<
        UpdateNoteTitleParams,
        UpdateNoteTitleResponse
      >;
      updateNoteContent: ApiFunction<
        UpdateNoteContentParams,
        UpdateNoteContentResponse
      >;
      updateNoteGroup: ApiFunction<
        UpdateNoteGroupParams,
        UpdateNoteGroupResponse
      >;
      deleteNote: ApiFunction<DeleteNoteParams, DeleteNoteResponse>;
      getNoteDetail: ApiFunction<GetNoteDetailParams, GetNoteDetailResponse>;
      moveNoteGroup: ApiFunction<MoveNoteGroupParams, MoveNoteGroupResponse>;
      recoverNote: ApiFunction<RecoverNoteParams, RecoverNoteResponse>;
      getTodoFullData: ApiFunction<any?, any?>;
    };
  }
}

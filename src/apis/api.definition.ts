import {NoteItem} from 'src/types/note';

export interface ModifyApiResponse {
  changes: number;
  lastInsertRowid?: number;
}

export interface GetNoteListParams {
  groupId: string;
}

export interface GetNoteListResponse {
  result: Array<NoteItem>;
}

export interface CreateNoteParams {
  title: string;
  groupId: string;
}

export type CreateNoteResponse = ModifyApiResponse;

export interface GetNoteDetailParams {
  noteId: string;
}

export interface GetNoteDetailResponse {
  result: NoteItem;
}

export interface UpdateNoteTitleParams {
  noteId: string;
  title: string;
}

export type UpdateNoteTitleResponse = ModifyApiResponse;

export interface UpdateNoteContentParams {
  noteId: string;
  content: string;
}

export interface MoveNoteGroupParams {
  noteId: string;
  groupId: string;
}

export type MoveNoteGroupResponse = ModifyApiResponse;

export type UpdateNoteContentResponse = ModifyApiResponse;

export interface DeleteNoteParams {
  noteId: string;
}

export interface DeleteNoteResponse {
  changes: number;
  lastInsertRowid: number;
}

export const apiDefinitions = [
  'createTodo',
  'getTodoList',
  'updateTodoPriority',
  'updateTodoProgress',
  'updateTodoDeadline',
  'getTodoDetail',
  'updateTodoDetail',
  'batchFinishTodo',
  'batchDeleteTodo',
  'batchRecoverTodo',
  'createTodoGroup',
  'updateTodoGroup',
  'deleteTodoGroup',
  'getTodoGroupList',
  'batchRemoveGroup',
  'getNoteGroupList',
  'createNoteGroup',
  'updateNoteGroup',
  'getNoteList',
  'createNote',
  'updateNoteTitle',
  'updateNoteContent',
  'deleteNote',
  'moveNoteGroup',
  'getNoteDetail'
];

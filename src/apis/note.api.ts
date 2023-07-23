import type {Database} from 'better-sqlite3';
import {GroupType} from 'src/utils/types';

import {
  CreateNoteParams,
  DeleteNoteParams,
  GetNoteDetailParams,
  GetNoteListParams,
  MoveNoteGroupParams,
  UpdateNoteContentParams,
  UpdateNoteTitleParams
} from './api.definition';

/** 获取笔记分组 */
export async function getNoteGroupList(db: Database) {
  const query = db.prepare(
    'select id, title, parentId, createTime, deleteTime from groups where deleteTime is null and type = ?'
  );
  const result = query.all(GroupType.Note);
  return {
    result
  };
}

/** 新建笔记分组 */
export async function createNoteGroup(db: Database, event, params) {
  const statement = db.prepare(
    'insert into groups (title, parentId, createTime, type) values (?, ?, ?, ?)'
  );
  return statement.run(
    params.title,
    params.parentId || null,
    new Date().getTime(),
    GroupType.Note
  );
}

/** 修改笔记分组 */
export async function updateNoteGroup(db: Database, event, params) {
  const statement = db.prepare(
    'update groups set title = @title, parentId = @parentId where id = @id'
  );
  return statement.run({
    title: params.title,
    parentId: params.parentId || null,
    id: params.id
  });
}

/** 获取笔记列表 */
export async function getNoteList(
  db: Database,
  event,
  params: GetNoteListParams
) {
  const statement = db.prepare(
    'select id, title, groupId, createTime, updateTime, groupId from notes where groupId = ? and deleteTime is null'
  );
  return {
    result: statement.all(params.groupId)
  };
}

/** 创建笔记 */
export async function createNote(
  db: Database,
  event,
  params: CreateNoteParams
) {
  const insertStmt = db.prepare(
    'INSERT INTO notes (title, groupId, createTime, updateTime) VALUES (?, ?, ?, ?)'
  );
  return insertStmt.run(
    params.title,
    params.groupId,
    new Date().getTime(),
    new Date().getTime()
  );
}

/** 获取笔记详细信息 */
export async function getNoteDetail(
  db: Database,
  event,
  params: GetNoteDetailParams
) {
  const statement = db.prepare('select * from notes where id = ?');
  return {
    result: statement.get(params.noteId)
  };
}

/** 更新笔记标题 */
export async function updateNoteTitle(
  db: Database,
  event,
  params: UpdateNoteTitleParams
) {
  const statement = db.prepare(
    'update notes set title = ?, updateTime = ? where id = ?'
  );
  return statement.run(params.title, new Date().getTime(), params.noteId);
}

/** 更新笔记内容 */
export async function updateNoteContent(
  db: Database,
  event,
  params: UpdateNoteContentParams
) {
  const statement = db.prepare(
    'update notes set content = ?, updateTime = ? where id = ?'
  );
  return statement.run(params.content, new Date().getTime(), params.noteId);
}

/** 移动笔记分组 */
export async function moveNoteGroup(
  db: Database,
  event,
  params: MoveNoteGroupParams
) {
  const statement = db.prepare('update notes set groupId = ? where id = ?');
  return statement.run(params.groupId, params.noteId);
}

/** 删除笔记 */
export async function deleteNote(
  db: Database,
  event,
  params: DeleteNoteParams
) {
  const statement = db.prepare('update notes set groupId = -4 where id = ?');
  return statement.run(params.noteId);
}

import {GroupType} from 'src/utils/types';

/** 获取笔记分组 */
export async function getNoteGroupList(db) {
  const query = db.prepare(
    'select id, title, parentId, createTime, deleteTime from groups where deleteTime is null and type = ?'
  );
  const result = query.all(GroupType.Note);
  return {
    result
  };
}

/** 新建笔记分组 */
export async function createNoteGroup(db, event, params) {
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
export async function updateNoteGroup(db, event, params) {
  const statement = db.prepare(
    'update groups set title = @title, parentId = @parentId where id = @id'
  );
  return statement.run({
    title: params.title,
    parentId: params.parentId || null,
    id: params.id
  });
}

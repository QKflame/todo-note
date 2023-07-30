export interface NoteItem {
  id: string;
  title: string;
  content: string | null;
  updateTime: number;
  createTime: number;
  deleteTime: number | null;
  originGroupId: string | null;
  groupId: string;
}

export enum ModelName {
  Todo = 'Todo'
}

export enum ModelType {
  Int = 'int',
  String = 'string'
}

export enum TodoPriority {
  P0,
  P1,
  P2
}

export interface GroupProperties {
  /** 父级 ID */
  parent_id: string;
  /** 主键 ID */
  _id: string;
  /** 计划名称 */
  name: string;
  /** 创建时间 */
  createTime: number;
  /** 修改时间 */
  updateTime: number;
  /** 删除时间 */
  deleteTime: number;
}

export interface TodoProperties {
  /** 计划 ID */
  group_id: string;
  /** 主键 ID */
  _id: string;
  /** 标题 */
  title: string;
  /** 优先级 */
  priority: TodoPriority;
  /** 进度 */
  progress: number;
  /** 创建时间 */
  createTime: number;
  /** 修改时间 */
  updateTime: number;
  /** 删除时间 */
  deleteTime: number;
  /** 内容 */
  content: string;
}

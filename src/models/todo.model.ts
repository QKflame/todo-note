import {ModelName, ModelType} from 'src/types/model';

export const TodoSchema = {
  name: ModelName.Todo,
  properties: {
    _id: ModelType.String,
    title: ModelType.String,
    created_at: ModelType.Int,
    updated_at: ModelType.Int
  },
  primaryKey: '_id'
};

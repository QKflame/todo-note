import {app} from 'electron';
import {nanoid} from 'nanoid';
import path from 'path';
import Realm from 'realm';
import {ModelName} from 'src/types/model';

import {TodoSchema} from './todo.model';

let realm: any = null;

export const getRealm = async () => {
  if (realm) {
    console.log('获取 realm');
    return realm;
  }

  const _path = path.join(app.getPath('appData'), 'TodoNote/realm');

  realm = await Realm.open({
    path: _path,
    schema: [TodoSchema],
    schemaVersion: 2,
    onMigration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 2) {
        const oldObjects: any = oldRealm.objects(ModelName.Todo);
        const newObjects: any = newRealm.objects(ModelName.Todo);
        for (const objectIndex in oldObjects) {
          const newObject = newObjects[objectIndex];
          newObject._id = nanoid();
        }
      }
    }
  });

  return realm;
};

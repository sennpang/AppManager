import Realm from 'realm';

export const ApiKeyTableName = 'ApiKey';
export const AppListTableName = 'AppList';

const ApiKeySchema = {
  name: ApiKeyTableName,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    key: 'string',
  },
};

const AppListSchema = {
  name: AppListTableName,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    list: 'string',
  },
};

const instance = new Realm({
  schema: [ApiKeySchema, AppListSchema],
  deleteRealmIfMigrationNeeded: true,
  inMemory: false,
});

/**表使用区**/
export function writeToRealm(tabName, obj) {
  return new Promise((resolve, reject) => {
    let row = queryAllFromRealm(tabName).filtered('key == $0', obj.key);
    if (row.length) {
      return resolve(true);
    }
    instance.write(() => {
      instance.create(tabName, obj, true);
      resolve(true);
    });
  });
}

export function getFromRealm(tabName, key) {
  let row = queryAllFromRealm(tabName).filtered('key == $0', key);
  return !!row.length;
}

export function queryAllFromRealm(tabName) {
  // return new Promise((resolve, reject) => {
  return instance.objects(tabName);
  // let objStr = JSON.stringify(obj);
  // resolve(JSON.parse(objStr));
  // });
}

export function queryFromRealm(tabName, query = '') {
  // return new Promise((resolve, reject) => {
  return instance.objects(tabName).filtered(query);
  // let objStr = JSON.stringify(obj);
  // resolve(JSON.parse(objStr));
  // });
}

export function clearAllFromRealm(tabName) {
  return new Promise((resolve, reject) => {
    instance.write(() => {
      let arrays = instance.objects(tabName);
      instance.delete(arrays);
      resolve(true);
    });
  });
}

export function deleteFromRealm(item = {}) {
  return new Promise((resolve, reject) => {
    instance.write(() => {
      instance.delete(item);
      resolve(true);
    });
  });
}

export function updateFromRealm(tabName, item = {}) {
  return new Promise((resolve, reject) => {
    instance.create(tabName, item, 'modified');
    resolve(true);
  });
}

export function clearRowFromRealm(id, tabName) {
  return new Promise((resolve, reject) => {
    instance.write(() => {
      let arrays = instance.objects(tabName);
      let row = arrays.filtered('id==' + id);
      instance.delete(row);
      resolve(true);
    });
  });
}

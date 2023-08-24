import Realm from 'realm';

export const ApiKeyTableName = 'ApiKey';
export const AppListTableName = 'AppList';

const ApiKeySchema = {
  name: ApiKeyTableName,
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
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
export function writeToRealm(obj, tabName) {
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

//表1操作
// _addData() {
//   clearAllFromRealm(HistoryTableName);

//   let row1 = {"id": 1, "name": "战狼1"};
//   writeToRealm(row1, HistoryTableName).then(() => {
//       ToastAndroid.show('写入完成1', ToastAndroid.SHORT);
//   });
//   let row2 = {"id": 2, "name": "战狼2"};
//   writeToRealm(row2, HistoryTableName).then(() => {
//       ToastAndroid.show('写入完成2', ToastAndroid.SHORT);
//   });
// }

// _readAllData() {
//   queryAllFromRealm(HistoryTableName).then((list) => {
//       for (let key in list) {
//           ToastAndroid.show('id:' + list[key].id + ',name:' + list[key].name, ToastAndroid.SHORT);
//       }
//   });
// }

// _updateData() {
//   let row2 = {"id": 2, "name": "北京222"};
//   writeToRealm(row2, HistoryTableName).then(() => {
//       ToastAndroid.show('修改完成', ToastAndroid.SHORT);
//   });
// }

// _delRowData() {
//   //删除第一行
//   clearRowFromRealm(1, HistoryTableName).then(() => {
//       ToastAndroid.show('删除完成', ToastAndroid.SHORT);
//   });
// }

// //表2操作
// _addData2() {
//   clearAllFromRealm(CityTableName);

//   let row1 = {"city_id": 1, "city_name": "上海"};
//   writeToRealm(row1, CityTableName).then(() => {
//       ToastAndroid.show('2写入完成1', ToastAndroid.SHORT);
//   });
//   let row2 = {"city_id": 2, "city_name": "北京"};
//   writeToRealm(row2, CityTableName).then(() => {
//       ToastAndroid.show('2写入完成2', ToastAndroid.SHORT);
//   });
// }

// _readAllData2() {
//   queryAllFromRealm(CityTableName).then((list) => {
//       for (let key in list) {
//           ToastAndroid.show('城市ID:' + list[key].city_id + ',城市名:' + list[key].city_name, ToastAndroid.SHORT);
//       }
//   });
// }

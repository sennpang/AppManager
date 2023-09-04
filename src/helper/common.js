import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';

export const apiKey = queryAllFromRealm(ApiKeyTableName)[0]?.key;
export const isEmptyObj = (obj = {}) => {
  return !!Object.keys(obj).length;
};

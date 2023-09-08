import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';

export const apiKey: string = queryAllFromRealm(ApiKeyTableName)[0]
  ?.key as string;

export const isEmptyObj = (obj = {}) => {
  return !!Object.keys(obj).length;
};

import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';

export const apiKey: string = queryAllFromRealm(ApiKeyTableName)[0]
  ?.key as string;

export const isEmptyObj = (obj = {}) => {
  return !!Object.keys(obj).length;
};

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

import React, { useEffect, useState } from 'react';
import { IconButton, MD3Colors, ProgressBar } from 'react-native-paper';
import { useAlertStore } from '../store/alert';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { useLoadingStore } from '../store/loading';
export const PGYER_APP_KEY = "1157c3333c0d18a35d05b9e8ebc9518b"
export const API_ENDPOINT = 'https://www.pgyer.com/apiv2'
export const CHECK_UPDATE_URL = '/app/check'
export const API_KEY = '62ccda7f7fdd6a633726e7e79f34137c'
export const getRedirectLocation = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const finalUrl = response.url; // Retrieve the final redirect location
    return finalUrl;
  } catch (error) {
    console.error('Error:', error);
    return 'error';
  }
};

const CheckUpdateButton = () => {
  const [disable, setDisable] = useState(false)

  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);
  const setLoading = useLoadingStore(state => state.setStat);

  const check = async () => {
    // setDisable(true)
    if (!setLoading) return;

    setLoading(true, '检查更新...');

    let version = DeviceInfo.getVersion();
    let downloadUrl = '';
    let checkUpdateUrl = `${API_ENDPOINT}${CHECK_UPDATE_URL}?_api_key=${API_KEY}&appKey=${PGYER_APP_KEY}&buildVersion=${version}`;
    // if (checkUpdateUrl) return;

    let response: ({ code: number, data?: { buildVersion: string, buildName: string, buildHaveNewVersion: boolean, downloadURL: string }, message?:string }) = await axios.get(checkUpdateUrl).then(data => data.data)
    setDisable(false)
    if (!response) return

    let responseData = response.data
    let buildHaveNewVersion = responseData?.buildHaveNewVersion
    if (response.code) {
      setLoading(true, response.message);
      return 
    }

    if (!buildHaveNewVersion) {
      setLoading(true, '当前已经是最新版本了！');
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return
    }

    if (!responseData) return

    if (response.code === 0 && buildHaveNewVersion) {
      downloadUrl = responseData?.downloadURL
    }
    if (!downloadUrl) return

    let filename = `${responseData.buildName}_${responseData.buildVersion}.apk`;
    setLoading(false)
    setAlertInfo({
      ...alertInfo,
      confirmCb: () => {
        Update(filename, downloadUrl);
      },
      dismissable: false,
      confirm: '确认',
      msg: '发现新版本, 确认更新?',
      open: true,
    });
  }

  const Update = async (filename: string, downloadUrl: string) => {
    let apkFilePath = RNFS.ExternalDirectoryPath + `/${filename}`
    let apkMime = 'application/vnd.android.package-archive'

    setLoading && setLoading(true, '更新中, 请稍等...');

    let finalUrl = await getRedirectLocation(downloadUrl)
    if (!finalUrl) {
      setAlertInfo({
        ...alertInfo,
        msg: '更新失败, 没有获取到下载链接!!!',
        open: true,
      });
      return
    }

    await ReactNativeBlobUtil.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        title: filename,
        path: apkFilePath,
        description: '正在下载更新包...',
        mime: apkMime,
        mediaScannable: true,
        notification: true,
      },
    }).fetch(
      'GET',
      finalUrl, //apk下载地址
    )

    setAlertInfo({
      ...alertInfo,
      msg: '正在打开安装包...',
      dismissable: true,
      open: true,
    });

    await ReactNativeBlobUtil.android.actionViewIntent(
      apkFilePath,
      apkMime,
    );

    setDisable(false)
  };

  useEffect(()=> {
    if (!setLoading) return
    check()
  },[setLoading])

  return <></>;
};

export default CheckUpdateButton;



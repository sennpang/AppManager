import React, {useCallback, useEffect, useRef, useState} from 'react';
import {post} from '../helper/fetch';
import {
  API_URL_MAP,
  APP_KEY_PARAMS,
  BUILD_KEY_PARAMS,
} from '../constants/api.url';
import {Button, IconButton} from 'react-native-paper';
import {App, AppList, PostData, VersionScreenProps} from '..';

import {useLoadingStore} from '../store/loading';
import {useAlertStore} from '../store/alert';
import DeleteAppBtn from '../unit/DeleteAppBtn';
import VersionScrollView from '../unit/VersionScrollView';
import Title from '../components/Title';
import AlertMiddle from '../components/AlertMiddle';
import Row from '../components/layout/Row';
import AppScrollView from './AppScrollView';
import {queryAllFromRealm, ApiKeyTableName} from '../utils/RealmUtil';
const rebuildList = (list: any, selectedApps: any) => {
  let tmp: any = {...list};
  selectedApps.forEach((k: any) => {
    tmp[k].checked = true;
  });
  return tmp;
};

const requiredFields = [
  'buildShortcutUrl',
  'buildDescription',
  'buildScreenshots',
  'isMerged',
  'buildPassword',
];
const dealList = (orgList: AppList, indexKey: string, app: App) => {
  let tmp: any = {};
  orgList.map((item: App) => {
    requiredFields.forEach(field => {
      if (!item[field] && app && app[field]) {
        item[field] = app[field];
      }
    });
    tmp[item[indexKey]] = item;
  });
  return tmp;
};
function ListContainer({
  navigation,
  type,
  route,
}: VersionScreenProps & {type: 'version' | 'app'}) {
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState({});
  const [tips, setTips] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedApps, setSelectApp] = useState(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);

  const setLoading = useLoadingStore(state => state.setStat);
  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);

  useEffect(() => {
    const key: string = queryAllFromRealm(ApiKeyTableName)[0]?.key as string;
    setApiKey(key);
  }, [route.params.time]);

  const getAppList = useCallback(
    (direction?: 'left' | 'right') => {
      if (!route.params.time) {
        return;
      }

      if (!apiKey) {
        return;
      }

      if (!setLoading) {
        return;
      }

      if (type === 'version' && !route?.params?.item?.appKey) {
        setTips('缺少 appKey 参数');
        return;
      }

      switch (direction) {
        case 'left':
          currentPage.current--;
          break;
        case 'right':
          currentPage.current++;
          break;

        default:
          break;
      }

      if (currentPage.current < 0) {
        currentPage.current = 0;
      }

      if (
        currentPageCount.current &&
        currentPage.current > currentPageCount.current
      ) {
        currentPage.current = currentPageCount.current;
      }

      let postUrl: string = '';
      let data: PostData = {_api_key: apiKey};
      switch (type) {
        case 'version':
          data.appKey = route.params.item.appKey;
          postUrl = API_URL_MAP.APP_VERSION_LIST_URL;
          break;
        case 'app':
          postUrl = API_URL_MAP.MY_APP_LIST_URL;
          break;
        default:
          break;
      }
      data.page = currentPage.current || 1;
      setDisabled(true);
      setLoading(true);
      setSelectApp(new Set());
      setSelectAll(false);

      post(postUrl, data).then(res => {
        let code = res.code;
        if (code) {
          setTips(res.message);
          return false;
        } else {
          if (!res.data.list.length) {
            if (type === 'version') {
              return navigation.push('AppList', {time: Date.now()});
            } else {
              return;
            }
          }
          const indexKey =
            type === 'version' ? BUILD_KEY_PARAMS : APP_KEY_PARAMS;
          setList(dealList(res.data.list, indexKey, route.params.item));
          currentPageCount.current = res.data.pageCount;
        }
        setDisabled(false);
        setLoading(false);
      });
    },
    [
      route.params.time,
      route.params.item,
      apiKey,
      setLoading,
      type,
      navigation,
    ],
  );

  useEffect(() => {
    if (type === 'version' && !route?.params?.item?.appKey) {
      return;
    }

    getAppList();
  }, [getAppList, route?.params?.item?.appKey, type]);

  const deleteVersions = () => {
    let postUrl: string = '';
    let data: PostData = {_api_key: apiKey};
    switch (type) {
      case 'version':
        postUrl = API_URL_MAP.APP_VERSION_DELETE_URL;
        break;
      case 'app':
        postUrl = API_URL_MAP.APP_DELETE_URL;
        break;
      default:
        break;
    }

    setDisabled(true);
    setLoading(true, '删除中...');

    const selectAppsIter = selectedApps.values();
    let index = 0;
    const regetApps = () => {
      getAppList();
      setSelectApp(new Set());
    };

    const deleteNextApp = (key = '') => {
      switch (type) {
        case 'version':
          data.buildKey = key;
          break;
        case 'app':
          data.appKey = key;
          break;

        default:
          break;
      }

      post(postUrl, {...data}).then(res => {
        index++;
        let code = res.code;
        if (code) {
          setLoading(false);
          setAlertInfo({
            msg: res.message,
            open: true,
            confirmCb: () => {
              regetApps();
            },
          });
          return false;
        }

        setDisabled(false);
        if (index === selectedApps.size) {
          setLoading(false);
          setAlertInfo({
            msg: '删除成功',
            open: true,
            confirmCb: () => {
              regetApps();
            },
            cancelCb: () => {
              regetApps();
            },
          });
          return;
        }
        deleteNextApp(selectAppsIter.next().value);
      });
    };
    deleteNextApp(selectAppsIter.next().value);
  };

  const handleDeleteVersions = () => {
    if (!selectedApps.size) {
      return setAlertInfo({msg: '参数错误', open: true});
    }

    setAlertInfo({
      ...alertInfo,
      confirmCb: () => deleteVersions(),
      cancelCb: () => cancelSelect(),
      confirm: '确认',
      msg: '确认删除?',
      open: true,
    });
  };

  const cancelSelect = () => {
    setSelectApp(new Set());
    setSelectAll(false);
  };

  const changeSelectAll = () => {
    if (!selectAll) {
      Object.keys(list).map(k => {
        setSelectApp(key => key.add(k));
      });
    } else {
      setSelectApp(new Set());
    }
    setSelectAll(!selectAll);
    setList(rebuildList(list, selectedApps));
  };

  const checkedApp = (buildKey: string) => {
    if (!selectedApps.has(buildKey)) {
      setSelectApp(keys => keys.add(buildKey));
    } else {
      setSelectApp(keys => {
        keys.delete(buildKey);
        return keys;
      });
    }

    if (selectedApps.size === Object.keys(list).length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setList(rebuildList(list, selectedApps));
  };

  const newProps = {
    selectedApps: selectedApps,
    list: list,
    getAppList: getAppList,
    checkedApp: checkedApp,
    selectAll: selectAll,
  };

  return (
    <>
      {apiKey ? (
        <>
          <AlertMiddle errorMsg={tips} />
          {type === 'version' && (
            <Title
              textAlign="center"
              fontSize={18}
              css={{marginBottom: 1, marginTop: 10}}>
              {route.params.item.appName}
            </Title>
          )}

          <Row justifyContent="space-between">
            <DeleteAppBtn
              selectedApps={selectedApps}
              disabled={disabledIcon}
              selectAll={selectAll}
              changeSelectAll={changeSelectAll}
              handleDelete={handleDeleteVersions}
            />
            <Button onPress={() => getAppList()}>刷新</Button>
          </Row>

          {type === 'version' && <VersionScrollView {...newProps} />}
          {type === 'app' && <AppScrollView {...newProps} />}

          <Row justifyContent="center">
            <IconButton
              icon="arrow-left"
              onPress={() => getAppList('left')}
              disabled={disabledIcon || currentPage.current === 1}
            />
            <IconButton
              icon="arrow-right"
              rippleColor=""
              onPress={() => getAppList('right')}
              disabled={
                disabledIcon ||
                currentPageCount.current === currentPage.current ||
                currentPageCount.current === 1
              }
            />
          </Row>
        </>
      ) : (
        <Title textAlign="center">请先添加 _api_key</Title>
      )}
    </>
  );
}
export default ListContainer;

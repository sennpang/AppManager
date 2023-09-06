import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  APP_CANCEL_LATEST_VERSION_URL,
  APP_KEY_PARAMS,
  APP_LATEST_VERSION_URL,
  APP_VERSION_DELETE_URL,
  APP_VERSION_LIST_URL,
  BUILD_KEY_PARAMS,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {Avatar, Button, Checkbox, IconButton, Text} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
import {StyleSheet} from 'react-native';
import {App, AppList, VersionScreenProps} from '..';

import Title from './Title';
import VersionMenu from './VersionMenu';
import {apiKey} from '../helper/common';
import {GLOBAL_FALSE, GLOBAL_TRUE} from '../constants/app';
import {theme} from '../config/theme';
import {useLoadingStore} from '../store/loading';
import {useAlertStore} from '../store/alert';
function VersionList({navigation, route}: VersionScreenProps) {
  const {appKey, appName} = route.params;
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState({});
  const [tips, setTips] = useState('');
  const [selectApp, setSelectApp] = useState(new Set());
  const [selectAll, setSelectAll] = React.useState(false);
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);

  const setLoading = useLoadingStore(state => state.setStat);
  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);

  const getAppList = useCallback(
    (direction?: 'left' | 'right') => {
      if (!setLoading) {
        return;
      }

      if (!appKey) {
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

      let data: any = {};
      data[API_KEY_PARAMS] = apiKey;
      data[APP_KEY_PARAMS] = appKey;
      data.page = currentPage.current || 1;
      setDisabled(true);
      setLoading(true);
      post(APP_VERSION_LIST_URL, data).then(res => {
        let code = res.code;
        if (code) {
          setTips(res.message);
          return false;
        } else {
          if (!res.data.list.length) {
            return navigation.push('AppList');
          }
          dealList(res.data.list);
          currentPageCount.current = res.data.pageCount;
        }
        setDisabled(false);
        setLoading(false);
      });
    },
    [appKey, navigation, setLoading],
  );

  const dealList = (orgList: AppList) => {
    let tmp: any = {};
    orgList.map((item: App) => {
      tmp[item.buildKey] = item;
    });
    setList(tmp);
  };

  useEffect(() => {
    if (!appKey) {
      return;
    }
    getAppList();
  }, [appKey, getAppList]);

  const setCurrent = (buildKey: string, cancel = false) => {
    if (!setLoading) {
      return;
    }

    setLoading(false);
    let data: any = {};
    data[API_KEY_PARAMS] = apiKey;
    data[BUILD_KEY_PARAMS] = buildKey;
    const url = cancel ? APP_CANCEL_LATEST_VERSION_URL : APP_LATEST_VERSION_URL;
    post(url, data).then(res => {
      let code = res.code;
      if (code) {
        setTips(res.message);
        return false;
      } else {
        setTips('设置成功');
        setTimeout(() => {
          getAppList();
        }, 0);
      }
      setDisabled(false);
      setLoading(false);
    });
  };

  const checkedApp = (buildKey: string | number) => {
    if (!selectApp.has(buildKey)) {
      setSelectApp(keys => keys.add(buildKey));
    } else {
      setSelectApp(keys => {
        keys.delete(buildKey);
        return keys;
      });
    }

    if (selectApp.size === Object.keys(list).length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    rebuildList();
  };

  const rebuildList = () => {
    let tmp: any = {...list};
    selectApp.forEach((k: any) => {
      tmp[k].checked = true;
    });
    setList(tmp);
  };

  useEffect(() => {}, [selectAll]);

  const deleteVersions = () => {
    setDisabled(true);
    selectApp.forEach(buildKey => {
      post(APP_VERSION_DELETE_URL, {_api_key: apiKey, buildKey}).then(res => {
        let code = res.code;
        if (code) {
          setAlertInfo({msg: res.message, open: true});
          return false;
        }
        setDisabled(false);
      });
    });
    setTimeout(() => {
      setAlertInfo({msg: '删除成功', open: true});
      setTimeout(() => {
        getAppList();
      }, 1000);
    }, 0);
  };

  const handleDeleteVersions = () => {
    if (!selectApp.size) {
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

  return (
    <>
      <AlertMiddle errorMsg={tips} />
      <Title
        textAlign="center"
        fontSize={18}
        css={{marginBottom: 1, marginTop: 10}}>
        {appName}
      </Title>
      <Row css={{paddingLeft: '1%'}} alignItems="center">
        <Checkbox
          status={selectAll ? 'checked' : 'unchecked'}
          onPress={() => {
            if (!selectAll) {
              Object.keys(list).map(k => {
                setSelectApp(key => key.add(k));
              });
            } else {
              setSelectApp(new Set());
            }
            setSelectAll(!selectAll);
            rebuildList();
          }}
        />
        <Button
          mode="text"
          disabled={!selectApp.size || disabledIcon}
          textColor={theme.colors.error}
          onPress={() => handleDeleteVersions()}>
          删除
        </Button>
      </Row>
      <ScrollView>
        {!!Object.keys(list).length &&
          Object.values(list).map((item: any) => {
            const checked = selectApp.has(item.buildKey);
            const buildKey = item.buildKey;
            return (
              <View key={buildKey}>
                <Row
                  css={{
                    marginBottom: 25,
                    paddingLeft: '1%',
                    paddingRight: '3%',
                  }}
                  justifyContent="space-between">
                  <Row alignItems="center">
                    <Checkbox
                      status={checked || selectAll ? 'checked' : 'unchecked'}
                      onPress={() => {
                        checkedApp(buildKey);
                      }}
                    />
                    <View style={styles.appAvatar}>
                      <Avatar.Image
                        size={50}
                        source={{uri: `${PGYER_ICON_URL}/${item.buildIcon}`}}
                      />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Row css={{marginBottom: 0}} alignItems="center">
                        <Title marginBottom={0}>{item.buildName}</Title>
                        <Text style={{marginLeft: 5}}>{item.buildVersion}</Text>
                      </Row>
                      <Row css={{marginBottom: 0}} alignItems="center">
                        <Text>
                          build {item.buildBuildVersion}
                          {item.buildIsPublishComplete === GLOBAL_FALSE && (
                            <Text
                              style={{
                                color: theme.colors.error,
                              }}>
                              未完成
                            </Text>
                          )}
                          {item.buildIsLastest === GLOBAL_TRUE && (
                            <Text
                              style={{
                                color: theme.colors.success,
                              }}>
                              (最新版本)
                            </Text>
                          )}
                        </Text>
                      </Row>
                      <Text>{item.buildCreated}</Text>
                    </View>
                  </Row>
                  <Row alignItems="center">
                    <VersionMenu
                      item={item}
                      navigation={navigation}
                      buildKey={item.buildKey}
                      getAppList={getAppList}
                      setCurrent={setCurrent}
                    />
                  </Row>
                </Row>
              </View>
            );
          })}
      </ScrollView>
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
  );
}
const styles = StyleSheet.create({
  appAvatar: {
    position: 'relative',
  },
  type: {
    zIndex: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontSize: 10,
    backgroundColor: '#fff',
  },
});
export default VersionList;

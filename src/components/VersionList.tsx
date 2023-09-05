import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  APP_CANCEL_LATEST_VERSION_URL,
  APP_KEY_PARAMS,
  APP_LATEST_VERSION_URL,
  APP_VERSION_LIST_URL,
  BUILD_KEY_PARAMS,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {Avatar, Checkbox, IconButton, Text} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
import {StyleSheet} from 'react-native';
import {App, VersionScreenProps} from '..';

import Title from './Title';
import VersionMenu from './VersionMenu';
import {apiKey} from '../helper/common';
import {GLOBAL_FALSE, GLOBAL_TRUE} from '../constants/app';
import {theme} from '../config/theme';
import {useLoadingStore} from '../store/loading';
function VersionList({navigation, route}: VersionScreenProps) {
  const {appKey, appName} = route.params;
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [tips, setTips] = useState('');
  const [selectAll, setSelectAll] = React.useState(false);
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);

  const setLoading = useLoadingStore(state => state.setStat);
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
          setList(res.data.list);
          currentPageCount.current = res.data.pageCount;
        }
        setDisabled(false);
        setLoading(false);
      });
    },
    [appKey, setLoading],
  );

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

  return (
    <>
      <AlertMiddle errorMsg={tips} />
      <Title
        textAlign="center"
        fontSize={18}
        css={{marginBottom: 1, marginTop: 10}}>
        {appName}
      </Title>
      <ScrollView>
        <Row css={{paddingLeft: '1%'}} alignItems="center">
          <Checkbox
            status={selectAll ? 'checked' : 'unchecked'}
            onPress={() => {
              setSelectAll(!selectAll);
            }}
          />
        </Row>
        {!!list.length &&
          list.map((item: App) => {
            const checked = item.checked;
            return (
              <View key={item.buildKey}>
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

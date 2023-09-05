import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  MY_APP_LIST_URL,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {APP_TYPE_ANDROID} from '../constants/app';
import {Avatar, IconButton, Text} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
import {StyleSheet} from 'react-native';
import {App, AppListScreenProps} from '..';
import Title from './Title';
import AppMenu from './AppMenu';
import {apiKey} from '../helper/common';
import {useLoadingStore} from '../store/loading';
function AppList({navigation}: AppListScreenProps) {
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [tips, setTips] = useState('');
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);
  const setLoading = useLoadingStore(state => state.setStat);

  const getAppList = useCallback(
    (direction?: 'left' | 'right') => {
      if (!setLoading) {
        return;
      }

      // if (apiKey) return;
      if (!apiKey) {
        setTips('请先添加 api_key');
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

      setLoading(true);
      let data: any = {};
      data[API_KEY_PARAMS] = apiKey;
      data.page = currentPage.current || 1;
      setDisabled(true);
      post(MY_APP_LIST_URL, data).then(res => {
        let code = res.code;
        if (code) {
          setTips(res.message);
          return false;
        } else {
          if (!res.data.list.length) {
            return setTimeout(() => {
              getAppList('left');
            }, 0);
          }
          setList(res.data.list);
          currentPageCount.current = res.data.pageCount;
        }
        setDisabled(false);
        setLoading(false);
      });
    },
    [setLoading],
  );

  useEffect(() => {
    if (!apiKey) {
      return;
    }
    getAppList();
  }, [getAppList]);

  return (
    <>
      <AlertMiddle errorMsg={tips} />
      <ScrollView style={{paddingTop: 10}}>
        {!!list.length &&
          list.map((item: App) => {
            let buildType =
              item.buildType === APP_TYPE_ANDROID ? 'android' : 'apple';
            return (
              <TouchableWithoutFeedback
                key={item.buildKey}
                onPress={() => {
                  navigation.navigate('Details', {
                    item,
                  });
                }}>
                <View>
                  <Row
                    css={{
                      marginBottom: 25,
                      paddingLeft: '10%',
                      paddingRight: '3%',
                    }}
                    justifyContent="space-between">
                    <Row alignItems="center">
                      <View style={styles.appAvatar}>
                        <Avatar.Image
                          size={50}
                          source={{uri: `${PGYER_ICON_URL}/${item.buildIcon}`}}
                        />
                        <Avatar.Icon
                          size={20}
                          icon={buildType.toLowerCase()}
                          style={styles.type}
                        />
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Row css={{marginBottom: 5}} alignItems="center">
                          <Title marginBottom={0}>{item.buildName}</Title>
                          <Text style={{marginLeft: 5}}>
                            {item.buildVersion}
                          </Text>
                        </Row>
                        <Text>{item.buildCreated}</Text>
                      </View>
                    </Row>
                    <Row alignItems="center">
                      <AppMenu
                        getAppList={getAppList}
                        appName={item.buildName}
                        appKey={item.appKey}
                        navigation={navigation}
                      />
                    </Row>
                  </Row>
                </View>
              </TouchableWithoutFeedback>
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
export default AppList;

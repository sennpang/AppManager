import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  APP_KEY_PARAMS,
  APP_VERSION_LIST_URL,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {Avatar, IconButton, Text} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
import {StyleSheet} from 'react-native';
import {App, VersionScreenProps} from '..';

import Title from './Title';
import VersionMenu from './VersionMenu';
import {apiKey} from '../helper/common';
function VersionList({navigation, route}: VersionScreenProps) {
  const {appKey, appName} = route.params;
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [tips, setTips] = useState('');
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);

  const getAppList = useCallback(
    (direction = '') => {
      // if (apiKey) return;
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
      });
    },
    [appKey],
  );

  useEffect(() => {
    if (!appKey) {
      return;
    }
    getAppList();
  }, [appKey, getAppList]);

  return (
    <>
      <AlertMiddle errorMsg={tips} />
      <Title
        textAlign="center"
        fontSize={18}
        css={{marginBottom: 10, marginTop: 10}}>
        {appName}
      </Title>
      <ScrollView>
        {!!list.length &&
          list.map((item: App) => {
            return (
              <TouchableWithoutFeedback
                key={item.buildKey}
                onPress={() => {
                  console.log('click');
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
                      <VersionMenu buildKey={item.buildKey} />
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
export default VersionList;

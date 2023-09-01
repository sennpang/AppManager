import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableWithoutFeedback, View} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  MY_APP_LIST_URL,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';
import {APP_TYPE_ANDROID} from '../constants/app';
import {Avatar, IconButton, Text} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
import {StyleSheet} from 'react-native';
import {App} from '..';
const apiKey = queryAllFromRealm(ApiKeyTableName)[0]?.key;

import {AppListScreenProps} from '..';
function AppList({navigation}: AppListScreenProps) {
  const [disabledIcon, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [tips, setTips] = useState('');
  const currentPage = useRef(1);
  const currentPageCount = useRef(1);
  useEffect(() => {
    if (!apiKey) {
      return;
    }
    getAppList();
  }, []);

  const getAppList = (direction = '') => {
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
        setList(res.data.list);
        currentPageCount.current = res.data.pageCount;
      }
      setDisabled(false);
    });
  };

  return (
    <>
      <AlertMiddle errorMsg={tips} />
      <ScrollView>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            display: 'flex',
          }}>
          {list.length ? (
            list.map((item: App) => {
              let buildType =
                item.buildType === APP_TYPE_ANDROID ? 'android' : 'apple';
              console.log(`${PGYER_ICON_URL}/${item.buildIcon}`);
              return (
                <TouchableWithoutFeedback
                  key={item.buildKey}
                  onPress={() => {
                    console.log(navigation);

                    navigation.navigate('Details', {
                      item,
                    });
                  }}>
                  <View>
                    <Row css={{marginBottom: 10}}>
                      <View style={styles.appAvatar}>
                        <Avatar.Image
                          size={50}
                          children={
                            <Avatar.Icon
                              size={20}
                              icon={buildType}
                              style={styles.type}
                            />
                          }
                          source={{uri: `${PGYER_ICON_URL}/${item.buildIcon}`}}
                        />
                      </View>
                      <View>
                        <Row
                          direction="column"
                          css={{alignItems: 'self-start', marginLeft: 10}}>
                          <Text>
                            <Text variant="titleSmall">类型: </Text>
                            {buildType}
                          </Text>
                          <Text>
                            <Text variant="titleSmall">应用名: </Text>
                            <Text>{item.buildName}</Text>
                          </Text>
                          <Text>
                            <Text variant="titleSmall">创建时间: </Text>
                            <Text>{item.buildCreated}</Text>
                          </Text>
                          <Text>
                            <Text variant="titleSmall">版本: </Text>
                            <Text>{item.buildVersion}</Text>
                          </Text>
                          <Text>
                            <Text variant="titleSmall">包名: </Text>
                            <Text>{item.buildIdentifier.substr(0, 20)}</Text>
                          </Text>
                        </Row>
                      </View>
                    </Row>
                  </View>
                </TouchableWithoutFeedback>
              );
            })
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      <Row>
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

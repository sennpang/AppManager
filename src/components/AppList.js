import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View, TouchableWithoutFeedback} from 'react-native';
import {post} from '../helper/fetch';
import {
  API_KEY_PARAMS,
  MY_APP_LIST_URL,
  PGYER_ICON_URL,
} from '../constants/api.url';
import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';
import {APP_TYPE_ANDROID} from '../constants/app';
import {Badge, Button, List} from 'react-native-paper';
import AlertMiddle from './AlertMiddle';
import Row from './layout/Row';
const apiKey = queryAllFromRealm(ApiKeyTableName)[0]?.key;

function AppList({navigation}) {
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

    let data = {};
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
    <View>
      <View>
        <AlertMiddle errorMsg={tips} />
        <ScrollView>
          {list.length ? (
            list.map(item => {
              let buildType =
                item.buildType === APP_TYPE_ANDROID ? 'android' : 'apple';
              return (
                <TouchableWithoutFeedback
                  key={item.buildKey}
                  onPress={() => {
                    navigation.navigate('Profile', {
                      item,
                    });
                  }}>
                  <List.Item
                    title="First Item"
                    description="Item description"
                    left={props => (
                      <>
                        <List.Icon
                          {...props}
                          icon={{
                            uri: `${PGYER_ICON_URL}/${item.buildIcon}`,
                          }}
                        />
                        <Badge>3</Badge>
                      </>
                    )}
                  />
                </TouchableWithoutFeedback>
              );
            })
          ) : (
            <></>
          )}
        </ScrollView>
      </View>

      <Row>
        <Button
          icon="camera"
          mode="contained"
          onPress={() => getAppList('left')}
          disabled={disabledIcon || currentPage.current === 1}>
          Press me
        </Button>
        <Button
          icon="camera"
          mode="contained"
          onPress={() => getAppList('right')}
          disabled={
            disabledIcon ||
            currentPageCount.current === currentPage.current ||
            currentPageCount.current === 1
          }>
          Press me
        </Button>
      </Row>
    </View>
  );
}
export default AppList;

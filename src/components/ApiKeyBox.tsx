import React, {useRef} from 'react';
import {
  ApiKeyTableName,
  queryAllFromRealm,
  writeToRealm,
  deleteFromRealm,
  getFromRealm,
} from '../utils/RealmUtil';
import {API_KEY_PARAMS, API_URL_MAP} from '../constants/api.url';
import {post} from '../helper/fetch';
import {Button, List, TextInput} from 'react-native-paper';
import {useAlertStore} from '../store/alert';
import Box from './Box';
import {StyleSheet} from 'react-native';
import CenterText from './CenterText';
import {API_KEY_LENGTH} from '../constants/app';
import {View} from 'react-native';
import MyDivider from './MyDivider';
import {Api, ApiList} from '..';
import {theme} from '../config/theme';
function ApiKeyBox({}) {
  const [allValues, setAllValues] = React.useState({
    loading: false,
    keyList: queryAllFromRealm(ApiKeyTableName) as unknown as ApiList,
  });
  const [apiKey, setApiKey] = React.useState('');
  const currentApiKeyRef = useRef({});

  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);

  const changeValue = (data = {}) => {
    setAllValues({...allValues, ...data});
  };

  const setErrorMsg = (msg: string) => {
    setAlertInfo({msg, open: true});
    setApiKey('');
  };

  const handleSubmitKey = () => {
    if (!apiKey) {
      setErrorMsg('请输入 api_key');
      return;
    }

    if (apiKey.length !== API_KEY_LENGTH) {
      setErrorMsg('请输入 api_key');
      return;
    }

    checkApiKey();
  };

  const checkApiKey = () => {
    let data: any = {};
    data[API_KEY_PARAMS] = apiKey;
    if (getFromRealm(ApiKeyTableName, apiKey)) {
      return setErrorMsg('重复值!');
    }

    changeValue({loading: true});
    post(API_URL_MAP.MY_APP_LIST_URL, data).then(res => {
      if (res.code) {
        setErrorMsg(res.message);
        return false;
      } else {
        writeToRealm(ApiKeyTableName, {
          _id: Date.now().toString(),
          key: apiKey,
        });
        changeValue({
          loading: false,
          keyList: queryAllFromRealm(ApiKeyTableName),
        });
        setApiKey('');
      }
    });
  };

  const handleDelete = (item: Api) => {
    currentApiKeyRef.current = item;
    setAlertInfo({
      ...alertInfo,
      confirmCb: () => {
        deleteFromRealm(currentApiKeyRef.current);
        changeValue({keyList: queryAllFromRealm(ApiKeyTableName)});
      },
      confirm: '确认',
      msg: '确认删除?',
      open: true,
    });
  };

  const {loading, keyList} = allValues;
  return (
    <>
      <Box>
        <CenterText variant="titleLarge" style={styles.title}>
          欢迎使用蒲公英接口工具
        </CenterText>
        <TextInput
          placeholder="请输入_api_key"
          mode="outlined"
          label="api_key"
          value={apiKey}
          onChangeText={setApiKey}
        />
        <Button
          loading={loading}
          style={styles.btn}
          icon="check"
          mode="contained"
          disabled={!apiKey.length || loading}
          onPress={handleSubmitKey}>
          提交
        </Button>
        <MyDivider
          css={{
            marginBottom: 15,
            marginTop: 15,
          }}
        />
        {keyList.length ? (
          <Box css={styles.apiBox}>
            <>
              {keyList.length ? (
                keyList.map((item: Api) => {
                  return (
                    <View key={item.key}>
                      <List.Item title={item.key} description="当前 api_key" />
                      <Button
                        style={styles.btn}
                        loading={loading}
                        icon="trash-can-outline"
                        mode="contained"
                        buttonColor={theme.colors.error}
                        onPress={() => handleDelete(item)}>
                        删除当前 api_key
                      </Button>
                    </View>
                  );
                })
              ) : (
                <></>
              )}
            </>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 30,
    marginBottom: 20,
  },
  btn: {
    marginTop: 10,
  },
  apiBox: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
  },
});

export default ApiKeyBox;

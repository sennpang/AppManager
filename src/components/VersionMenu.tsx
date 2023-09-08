import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as React from 'react';
import {Menu, Divider, IconButton} from 'react-native-paper';
import {App, PostData} from '..';
import {theme} from '../config/theme';
import {
  API_KEY_PARAMS,
  API_URL_MAP,
  BUILD_KEY_PARAMS,
} from '../constants/api.url';
import {post} from '../helper/fetch';
import {useAlertStore} from '../store/alert';
import {useLoadingStore} from '../store/loading';
import {queryAllFromRealm, ApiKeyTableName} from '../utils/RealmUtil';
import AlertMiddle from './AlertMiddle';
interface Props {
  buildKey: string;
  getAppList: () => void;
  item: App;
}
const VersionMenu = (props: Props) => {
  const {buildKey, getAppList, item} = props;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [disabled, setDisabled] = React.useState(false);
  const [tips, setTips] = React.useState('');

  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);

  const deleteApp = () => {
    const apiKey: string = queryAllFromRealm(ApiKeyTableName)[0]?.key as string;
    const postData: PostData = {_api_key: apiKey, buildKey};
    setDisabled(true);
    post(API_URL_MAP.APP_VERSION_DELETE_URL, postData).then(res => {
      let code = res.code;
      if (code) {
        setAlertInfo({msg: res.message, open: true});
        return false;
      } else {
        setAlertInfo({msg: '删除成功', open: true});
        setTimeout(() => {
          getAppList();
        }, 1000);
      }
      setDisabled(false);
    });
  };

  const handleDeleteApp = () => {
    closeMenu();
    if (!buildKey) {
      return setAlertInfo({msg: '参数错误', open: true});
    }

    setAlertInfo({
      ...alertInfo,
      confirmCb: () => deleteApp(),
      confirm: '确认',
      msg: '确认删除?',
      open: true,
    });
  };

  const setLoading = useLoadingStore(state => state.setStat);
  const setCurrent = (buildKey: string, cancel = false) => {
    if (!setLoading) {
      return;
    }

    setLoading(false);
    let data: any = {};
    const apiKey: string = queryAllFromRealm(ApiKeyTableName)[0]?.key as string;
    data[API_KEY_PARAMS] = apiKey;
    data[BUILD_KEY_PARAMS] = buildKey;
    const url = cancel
      ? API_URL_MAP.APP_CANCEL_LATEST_VERSION_URL
      : API_URL_MAP.APP_SET_LATEST_VERSION_URL;
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
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            disabled={disabled}
            icon="menu"
            size={20}
            onPress={() => openMenu()}
          />
        }>
        <Menu.Item
          leadingIcon="details"
          onPress={() => {
            closeMenu();
            navigation.push('Details', {
              item,
            });
          }}
          title="详情"
        />
        <Menu.Item
          leadingIcon="timer-settings-outline"
          onPress={() => setCurrent(buildKey)}
          title="设置为当前版本"
        />
        <Divider />
        <Menu.Item
          leadingIcon={'trash-can'}
          onPress={() => handleDeleteApp()}
          title="删除"
          titleStyle={{color: theme.colors.error}}
          theme={{
            colors: {onSurfaceVariant: theme.colors.error},
          }}
          style={{borderColor: 'red'}}
        />
      </Menu>
    </>
  );
};

export default VersionMenu;

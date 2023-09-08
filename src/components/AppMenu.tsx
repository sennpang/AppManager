import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as React from 'react';
import {Menu, Divider, IconButton} from 'react-native-paper';
import {App} from '..';
import {theme} from '../config/theme';
import {API_URL_MAP} from '../constants/api.url';
import {post} from '../helper/fetch';
import {useAlertStore} from '../store/alert';
import {ApiKeyTableName, queryAllFromRealm} from '../utils/RealmUtil';
import AlertDialog from './AlertDialog';
interface Props {
  item: App;
  getAppList: () => void;
}

const AppMenu = ({item, getAppList}: Props) => {
  const apiKey: string = queryAllFromRealm(ApiKeyTableName)[0]?.key as string;
  const {appKey, appName} = item;
  const [visible, setVisible] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const deleteApp = () => {
    setDisabled(true);
    post(API_URL_MAP.APP_DELETE_URL, {_api_key: apiKey, appKey}).then(res => {
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
    if (!appKey) {
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

  return (
    <>
      <AlertDialog />
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
          leadingIcon={'format-list-bulleted'}
          onPress={() => {
            closeMenu();
            navigation.push('VersionList', {
              appKey,
              appName,
            });
          }}
          title="版本列表"
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

export default AppMenu;

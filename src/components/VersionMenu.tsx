import * as React from 'react';
import {Menu, Divider, IconButton} from 'react-native-paper';
import {App, NavigationProp} from '..';
import {theme} from '../config/theme';
import {APP_VERSION_DELETE_URL} from '../constants/api.url';
import {apiKey} from '../helper/common';
import {post} from '../helper/fetch';
import {useAlertStore} from '../store/alert';
interface Props {
  buildKey: string;
  navigation: NavigationProp;
  getAppList: () => void;
  item: App;
  setCurrent: (i: string) => void;
}
const VersionMenu = (props: Props) => {
  const {buildKey, getAppList, setCurrent, navigation, item} = props;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [disabled, setDisabled] = React.useState(false);

  const setAlertInfo = useAlertStore(state => state.setInfo);
  const alertInfo = useAlertStore(state => state.info);

  const deleteApp = () => {
    setDisabled(true);
    post(APP_VERSION_DELETE_URL, {_api_key: apiKey, buildKey}).then(res => {
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

  return (
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
  );
};

export default VersionMenu;

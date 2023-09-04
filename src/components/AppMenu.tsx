import * as React from 'react';
import {Menu, Divider, IconButton} from 'react-native-paper';
import {theme} from '../config/theme';
interface Props {
  navigation: any;
  appKey: string;
  appName: string;
}
const AppMenu = ({navigation, appKey, appName}: Props) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton icon="menu" size={20} onPress={() => openMenu()} />}>
      <Menu.Item
        onPress={() => {
          closeMenu();
          navigation.navigate('VersionList', {
            appKey,
            appName,
          });
        }}
        title="版本列表"
      />
      <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
      <Menu.Item onPress={() => {}} title="Item 2" />
      <Divider />
      <Menu.Item
        leadingIcon={'trash-can'}
        onPress={() => {}}
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

export default AppMenu;

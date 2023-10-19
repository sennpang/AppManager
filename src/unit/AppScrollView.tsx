import {Avatar, Checkbox, Text} from 'react-native-paper';
import {ScrollView, View} from 'react-native';
import React from 'react';
import Row from '../components/layout/Row';
import {PGYER_ICON_URL} from '../constants/api.url';
import {APP_TYPE_ANDROID} from '../constants/app';
import {App} from '..';
import Title from '../components/Title';
import {StyleSheet} from 'react-native';
import AppMenu from '../components/AppMenu';
interface Props {
  selectedApps: Set<any>;
  list: object;
  getAppList: () => void;
  checkedApp: (b: string) => void;
  selectAll: boolean;
}
const AppScrollView = ({
  list,
  selectedApps,
  selectAll,
  getAppList,
  checkedApp,
}: Props) => {
  return (
    <ScrollView style={{paddingTop: 10}}>
      {!!Object.keys(list).length &&
        Object.values(list).map((item: App) => {
          let buildType =
            item.buildType === APP_TYPE_ANDROID ? 'android' : 'apple';
          let appKey = item.appKey;
          const checked = selectedApps.has(appKey);
          return (
            <View key={item.appKey}>
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
                    onPress={() => {
                      checkedApp(appKey);
                    }}
                  />
                  <View style={styles.appAvatar}>
                    <Avatar.Image
                      size={40}
                      source={{uri: `${PGYER_ICON_URL}/${item.buildIcon}`}}
                    />
                    <Avatar.Icon
                      size={15}
                      icon={buildType.toLowerCase()}
                      style={styles.type}
                    />
                  </View>
                  <View style={{marginLeft: 10}}>
                    <Row
                      css={{marginBottom: 5}}
                      alignItems="center"
                      alignContent="center">
                      <Title fontSize={14} marginBottom={0}>
                        {item.buildName.substring(0, 10)}
                      </Title>
                      <Text style={{marginLeft: 5}}>
                        {item.buildVersion.substring(0, 8)}
                      </Text>
                    </Row>
                    <Text>{item.buildCreated}</Text>
                  </View>
                </Row>
                <Row alignItems="center">
                  <AppMenu item={item} getAppList={getAppList} />
                </Row>
              </Row>
            </View>
          );
        })}
    </ScrollView>
  );
};
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
export default AppScrollView;

import {Avatar, Checkbox, Text} from 'react-native-paper';
import {ScrollView, View} from 'react-native';
import React from 'react';
import VersionMenu from '../components/VersionMenu';
import Row from '../components/layout/Row';
import {theme} from '../config/theme';
import {PGYER_ICON_URL} from '../constants/api.url';
import {GLOBAL_FALSE, GLOBAL_TRUE} from '../constants/app';
import {App} from '..';
import Title from '../components/Title';
import {StyleSheet} from 'react-native';
interface Props {
  selectedApps: Set<any>;
  list: object;
  getAppList: () => void;
  checkedApp: (b: string) => void;
  selectAll: boolean;
}
const VersionScrollView = ({
  list,
  selectedApps,
  selectAll,
  getAppList,
  checkedApp,
}: Props) => {
  return (
    <ScrollView>
      {!!Object.keys(list).length &&
        Object.values(list).map((item: App) => {
          const checked = selectedApps.has(item.buildKey);
          const buildKey = item.buildKey;
          return (
            <View key={buildKey}>
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
                      checkedApp(buildKey);
                    }}
                  />
                  <View style={styles.appAvatar}>
                    <Avatar.Image
                      size={50}
                      source={{uri: `${PGYER_ICON_URL}/${item.buildIcon}`}}
                    />
                  </View>
                  <View style={{marginLeft: 10}}>
                    <Row css={{marginBottom: 0}} alignItems="center">
                      <Title marginBottom={0}>{item.buildName}</Title>
                      <Text style={{marginLeft: 5}}>{item.buildVersion}</Text>
                    </Row>
                    <Row css={{marginBottom: 0}} alignItems="center">
                      <Text>
                        build {item.buildBuildVersion}
                        {item.buildIsPublishComplete === GLOBAL_FALSE && (
                          <Text
                            style={{
                              color: theme.colors.error,
                            }}>
                            未完成
                          </Text>
                        )}
                        {item.buildIsLastest === GLOBAL_TRUE && (
                          <Text
                            style={{
                              color: theme.colors.success,
                            }}>
                            (最新版本)
                          </Text>
                        )}
                      </Text>
                    </Row>
                    <Text>{item.buildCreated}</Text>
                  </View>
                </Row>
                <Row alignItems="center">
                  <VersionMenu
                    item={item}
                    buildKey={item.buildKey}
                    getAppList={getAppList}
                  />
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
export default VersionScrollView;

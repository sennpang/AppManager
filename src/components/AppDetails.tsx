import {
  Image,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {PGYER_DOMAIN, PGYER_SCREENSHOT_URL} from '../constants/api.url';
import {Text} from 'react-native-paper';
import Box from './Box';
import Row from './layout/Row';
import {DetailScreenProps} from '..';
import VStack from './layout/VStack';
import Title from './Title';
const AppDetails = ({route, navigation}: DetailScreenProps) => {
  console.log(route, navigation);
  const {item} = route.params;
  let screenshots: string[] = [];
  if (item?.buildScreenshots) {
    screenshots = item.buildScreenshots.split(',').filter((n: any) => n);
  }
  const appUrl = `${PGYER_DOMAIN}${item.buildShortcutUrl}`;
  return (
    <ScrollView>
      <View>
        <Box>
          <Row justifyContent="flex-start">
            <Title>名称: </Title>
            <Text>{item.buildName}</Text>
          </Row>
          <Row justifyContent="flex-start">
            <Title>安装地址: </Title>
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(appUrl);
              }}>
              <Text>{appUrl}</Text>
            </TouchableWithoutFeedback>
          </Row>
          <Row justifyContent="flex-start">
            <Title>大小: </Title>
            <Text>{item.buildFileSize}</Text>
          </Row>
          <Row justifyContent="flex-start">
            <Title>包名: </Title>
            <Text>{item.buildIdentifier}</Text>
          </Row>
          <Row direction="column" alignItems="flex-start">
            <Title>应用描述: </Title>
            <Text>{item.buildDescription || ' '}</Text>
          </Row>
          <Row justifyContent="flex-start">
            <Title>合并应用: </Title>
            <Text>{item.isMerged === 1 ? '是' : '否'}</Text>
          </Row>
          <Row justifyContent="flex-start">
            <Title>安装密码: </Title>
            <Text>{item.buildPassword}</Text>
          </Row>
          <Row justifyContent="flex-start" alignContent="flex-start">
            <Title>截图: </Title>
          </Row>
          <VStack>
            {!!screenshots.length &&
              screenshots.map((img: string, index: number) => {
                return (
                  <Image
                    key={index}
                    style={{width: 500, height: 400, resizeMode: 'contain'}}
                    source={{
                      uri: `${PGYER_SCREENSHOT_URL}/${img}`,
                    }}
                  />
                );
              })}
          </VStack>
        </Box>
      </View>
    </ScrollView>
  );
};

export default AppDetails;

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
const AppDetails = ({route}: DetailScreenProps) => {
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
          <VStack>
            <Title>名称: </Title>
            <Text>{item.buildName}</Text>
          </VStack>
          <VStack>
            <Title>安装地址: </Title>
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(appUrl);
              }}>
              <Text>{appUrl}</Text>
            </TouchableWithoutFeedback>
          </VStack>
          <VStack>
            <Title>大小: </Title>
            <Text>{item.buildFileSize}</Text>
          </VStack>
          <VStack>
            <Title>包名: </Title>
            <Text>{item.buildIdentifier}</Text>
          </VStack>
          <Row direction="column" alignItems="flex-start">
            <Title>应用描述: </Title>
            <Text>{item.buildDescription || ' '}</Text>
          </Row>
          <VStack>
            <Title>简介: </Title>
            <Text>{item.buildDescription}</Text>
          </VStack>
          <VStack>
            <Title>更新说明: </Title>
            <Text>{item.buildUpdateDescription}</Text>
          </VStack>
          <VStack>
            <Title>合并应用: </Title>
            <Text>{item.isMerged === 1 ? '是' : '否'}</Text>
          </VStack>
          <VStack>
            <Title>安装密码: </Title>
            <Text>{item.buildPassword}</Text>
          </VStack>
          <VStack>
            <Title>截图: </Title>
          </VStack>
          <VStack alignItems="center" justifyContent="center">
            {!!screenshots.length &&
              screenshots.map((img: string, index: number) => {
                return (
                  <Image
                    key={index}
                    style={{
                      width: 500,
                      height: 400,
                      marginBottom: 10,
                      resizeMode: 'contain',
                    }}
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

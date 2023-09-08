import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiKeyBox from './ApiKeyBox';
import AppList from './AppList';
import {Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Row from './layout/Row';
import {TabBarProps} from '..';

const Tab = createBottomTabNavigator();
function MyTabBar({state, descriptors, navigation}: TabBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {state.routes.map(
        (route: {key: string | undefined; name: any}, index: any) => {
          if (!route.key) {
            return false;
          }
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, {time: Date.now()});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? '#673ab7' : '#222';
          return (
            <TouchableOpacity
              accessibilityRole="button"
              key={index}
              onPress={onPress}
              onLongPress={onLongPress}>
              <Row
                direction="column"
                alignItems="center"
                css={{width: 100}}
                // justifyContent="center"
                alignContent="center">
                <Text style={{color, textAlign: 'center'}}>
                  {options.tabBarIcon(color)}
                </Text>
                <Text style={{color}}> {label}</Text>
              </Row>
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
}

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="ApiBox"
      tabBar={(props: any) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="ApiBox"
        component={ApiKeyBox}
        options={{
          tabBarLabel: 'ApiBox',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="key" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AppList"
        component={AppList}
        options={{
          tabBarLabel: 'List',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNav;

import * as React from 'react';
// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiKeyBox from './ApiKeyBox';
import AppList from './AppList';
import {Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppDetails from './AppDetails';
import Row from './layout/Row';
import VersionList from './VersionList';
import {TabBarProps} from '..';

// const Tab = createMaterialBottomTabNavigator();

const Tab = createBottomTabNavigator();
const filterTab = ['Details', 'VersionList'];
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

          if (filterTab.includes(label)) {
            return false;
          }
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
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
      <Tab.Screen
        name="Details"
        component={AppDetails}
        options={{
          tabBarLabel: 'Details',
        }}
      />
      <Tab.Screen
        name="VersionList"
        component={VersionList}
        options={{
          tabBarLabel: 'VersionList',
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNav;

import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiKeyBox from './ApiKeyBox';
import AppDetails from './AppDetails';
import AppList from './AppList';

const Tab = createMaterialBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator initialRouteName="Feed" activeColor="#e91e63">
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

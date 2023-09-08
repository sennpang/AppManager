import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomNavigationProps} from 'react-native-paper';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {BottomTabDescriptorMap} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

interface App {
  isMerged: number;
  appName: string;
  buildKey: string;
  appKey: string;
  [propName: string]: string;
}
interface PostData {
  _api_key: string;
  buildKey?: string;
  appKey?: string;
  [propName: string]: string | number | boolean;
}
interface Css {
  [propName: string]: string | number;
}

interface AppList {
  map(arg0: (item: App) => void): unknown;
  [index: number]: App;
}

interface Api {
  key: string;
  id: number;
}
interface ApiList {
  length: number;
  map(arg0: (item: Api) => React.JSX.Element): unknown;
  [index: number]: Api;
}

interface State {
  loading: boolean;
  keyList: ApiList;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {};
}

export type RootStackParamList = {
  ApiBox: undefined;
  AppList: {time: number};
  Details: {item: App};
  VersionList: {
    appKey: string;
    time: number;
    appName: string;
  };
};

export type RootStackParamList = {
  ApiBox: undefined;
  Details: {item: App};
};

export type VersionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VersionList'
>;

export type DetailScreenProps = BottomNavigationProps<
  RootStackParamList,
  'Details'
>;

export type AppListScreenProps = BottomNavigationProps<
  RootStackParamList,
  'AppList'
>;

export type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'AppList'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Home'>
>;

export type NavigationProp = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
>;
export interface TabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: NavigationProp;
}

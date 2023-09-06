import {BottomNavigationProps} from 'react-native-paper';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {BottomTabDescriptorMap} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

interface App {
  isMerged: number;
  buildKey: string;
  [propName: string]: string;
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
  data: any;
}

export type RootStackParamList = {
  Home: {};
  AppList: {};
  Details: {item: App | any};
  VersionList: {
    appKey: string;
    appName: string;
  };
};

export type VersionScreenProps = BottomNavigationProps<
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
export type NavigationProp = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
> &
  any;
export interface TabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap & any;
  navigation: NavigationProp;
}

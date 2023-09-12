import React from 'react';
import {
  SafeAreaView,
  useColorScheme,
  AppRegistry,
  StatusBar,
  ViewStyle,
} from 'react-native';
import {ActivityIndicator, PaperProvider} from 'react-native-paper';

import {name as appName} from '../app.json';
import AlertDialog from './components/AlertDialog';
import BottomNav from './components/BottomNav';
import AppDetails from './components/AppDetails';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from './config/theme';
import {RootStackParamList} from '.';
import VersionList from './components/VersionList';
import {useLoadingStore} from './store/loading';
import Toast from './native/Toast';
const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const safeAreaBg: ViewStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
  };
  const loading = useLoadingStore(state => state.loading);

  if (loading) {
    Toast.show('加载中...', Toast.SHORT);
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={safeAreaBg}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={safeAreaBg.backgroundColor}
        />
        <AlertDialog />
        {loading && <ActivityIndicator animating={true} />}
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={BottomNav} />
            <Stack.Screen name="Details" component={AppDetails} />
            <Stack.Screen name="VersionList" component={VersionList} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}
export default App;
AppRegistry.registerComponent(appName, () => App);

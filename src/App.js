import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import StorageController from "./Main/Home/view/StorageController";
import WebViewController from "./Main/Home/view/WebViewController";
import LaunchController from "./Main/Welcome/LaunchController";
import MainController from "./Main/Home/tabs/MainController";
import { XWidget } from "react-native-easy-app";
import { Assets } from "./Main/Home/http/Api";

function ScreenList() {
  global.INSETS = useSafeAreaInsets();
  XWidget.initResource(Assets).initReferenceScreen(375, 677);//移动端原型设计最佳分辨率
  console.log('App.js global.INSETS=',global.INSETS)//{left: 0, top: 20, right: 0, bottom: 0}||{left: 0, top: 44, right: 0, bottom: 34}
  const { Navigator, Screen } = createStackNavigator();
  return <Navigator initialPage={LaunchController} headerMode='none'>
    <Screen name='Launch' component={LaunchController}/>
    <Screen name='Main' component={MainController}/>
    <Screen name='Storage' component={StorageController}/>
    <Screen name='WebView' component={WebViewController}/>
  </Navigator>;
}

export default function App() {
  console.disableYellowBox = true;
  return <SafeAreaProvider>
    <NavigationContainer>
      {/*RootSiblingParent 用于显示一个全局浮层按钮*/}
      <RootSiblingParent>
        <ScreenList/>
      </RootSiblingParent>
    </NavigationContainer>
  </SafeAreaProvider>
}

import React, {useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';

import {DebugManager} from 'react-native-debug-tool';
import {Manager} from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import {XHttpConfig, XImage, XText} from 'react-native-easy-app';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeController from './HomeController';
import DiscoverController from './DiscoverController';
import MineController from './MineController';
import {Notify} from '../../Common/events/Notify';
import {showToast} from '../../Common/widgets/Loading';
import {Colors} from '../../Common/storage/Const';

let lastClickTime = new Date().valueOf();
const {Navigator, Screen} = createBottomTabNavigator();

//tabbarController
function MainController(props) {
  const tabItemOption = (title, iconChecked, iconUnChecked) => {
    return {
      tabBarLabel: ({focused}) => {
        return (
          <XText
            text={title}
            style={{
              fontSize: 10,
              marginBottom: 3,
              fontWeight: focused ? 'bold' : 'normal',
              color: focused ? Colors.text_light : Colors.text_disable,
            }}
          />
        );
      },
      tabBarIcon: ({focused}) => {
        return (
          <XImage iconSize={24} icon={focused ? iconChecked : iconUnChecked} />
        );
      },
    };
  };

  //监听安卓设备上的后退按钮,避免直接退出app
  const backListener = () => {
    return BackHandler.addEventListener('hardwareBackPress', () => {
      const {state} = tabNavigator.dangerouslyGetState().routes[0];
      if (state && state.index !== 0) {
        // 若不是第一个Tab，则切换到第一个Tab
        tabNavigator.navigate('Home');
        return true;
      }
      if (navigation.canGoBack()) {
        // 若能返回，则不拦截
        return false;
      } else {
        let nowTime = new Date().valueOf();
        if (nowTime - lastClickTime < 1000) {
          //间隔时间小于1秒才能退出
          BackHandler.exitApp();
        } else {
          showToast('再按一次，退出Example');
          lastClickTime = nowTime;
        }
        return true;
      }
    });
  };

  const tokenExpired = ({message}) => {
    // token 过期需要处理的逻辑
    Alert.alert('Token 过期 ', message);
  };

  /**
   * 所有接口的返回数据都在 initParseDataFunc 方法的 参数回调里 回调,不太方便
   */
  XHttpConfig()
    .initHttpLogOn(true)
    .initParseDataFunc((result, request, callback) => {
      console.log('MainController.js XHttpConfig result=', result);
      let {success, json, message, status, response} = result;
      DebugManager.appendHttpLogs(request.params, response);
      if (status === 503) {
        // token 过期
        Notify.TOKEN_EXPIRED.sendEvent({message});
      } else {
        callback(success, json, message, status, response);
      }
    });

  DebugManager.initDeviceInfo(DeviceInfo);
  DebugManager.showFloat(Manager);
  global.tabNavigator = props.navigation;

  useEffect(() => {
    console.log('MainController.js componentDidMount');
    const listener = backListener();
    Notify.TOKEN_EXPIRED.register(tokenExpired);
    return () => {
      listener && listener.remove();
      Notify.TOKEN_EXPIRED.unRegister(tokenExpired);
    };
  });

  return (
    <Navigator>
      <Screen
        name="Home"
        options={tabItemOption('首页', 'home_sel.png', 'home_dis.png')}
        component={HomeController}
      />
      <Screen
        name="Order"
        options={tabItemOption('发现', 'discover_sel.png', 'discover_dis.png')}
        component={DiscoverController}
      />
      <Screen
        name="Mine"
        options={tabItemOption('我的', 'mine_sel.png', 'mine_dis.png')}
        component={MineController}
      />
    </Navigator>
  );
}

export default MainController;

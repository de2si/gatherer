/**
 * AppNavigation.tsx
 * Define's app navigation flow
 */

import React from 'react';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from '@nav/AuthStack';
import MainStack from '@nav/MainStack';

// screens
import SplashScreen from '@screens/SplashScreen';

const AppNav = (): React.JSX.Element => {
  let authStatus = true;
  let loading = false;
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {authStatus ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;

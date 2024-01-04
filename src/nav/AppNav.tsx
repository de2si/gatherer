/**
 * AppNav.tsx
 * Define's app navigation flow
 */

import React from 'react';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from '@nav/AuthStack';
import BottomTabs from '@nav/BottomTabs';

// screens
import SplashScreen from '@screens/SplashScreen';

const AppNav = (): React.JSX.Element => {
  let authStatus = false;
  let loading = false;
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {authStatus ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;

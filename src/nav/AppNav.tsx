/**
 * AppNav.tsx
 * Define's app navigation flow
 */

import React, {useEffect, useState} from 'react';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from '@nav/AuthStack';
import BottomTabs from '@nav/BottomTabs';

// screens
import SplashScreen from '@screens/SplashScreen';

// stores
import {useAuthStore} from '@hooks/useAuthStore';

const AppNav = (): React.JSX.Element => {
  const [isProcessing, setIsProcessing] = useState(true);
  const isAuthenticated = useAuthStore(store => store.isAuthenticated);
  const initializeAxios = useAuthStore(store => store.initializeAxios);

  useEffect(() => {
    setIsProcessing(true);
    initializeAxios();
    // TODO: fetch user details/profile data
    setIsProcessing(false);
  }, [initializeAxios]);

  if (isProcessing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;

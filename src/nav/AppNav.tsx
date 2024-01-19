/**
 * AppNav.tsx
 * Define's app navigation flow
 */

import React, {useCallback, useEffect, useState} from 'react';
import {Portal, Snackbar} from 'react-native-paper';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from '@nav/AuthStack';
import BottomTabs from '@nav/BottomTabs';

// screens
import SplashScreen from '@screens/SplashScreen';

// hooks
import {useAuthStore, useHydration} from '@hooks/useAuthStore';
import {useProfileStore} from '@hooks/useProfileStore';
import useSnackbar from '@hooks/useSnackbar';

// helpers
import {
  getErrorMessage,
  getFieldErrors,
  isRetryableError,
} from '@helpers/formHelpers';

const AppNav = (): React.JSX.Element => {
  const [isProcessing, setIsProcessing] = useState(true);

  const authenticated = useAuthStore(store => store.authenticated);
  const setApiAuthHeader = useAuthStore(store => store.setApiAuthHeader);
  const withAuth = useAuthStore(store => store.withAuth);
  const logout = useAuthStore(store => store.logout);

  let {hydrated} = useHydration();

  const fetchProfile = useProfileStore(store => store.fetchData);
  const loggedUser = useProfileStore(store => store.data);

  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');

  const init = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (authenticated) {
        setApiAuthHeader();
        await withAuth(fetchProfile);
      }
    } catch (error) {
      let message = getErrorMessage(error);
      let messageToShow =
        typeof message === 'string'
          ? message
          : getFieldErrors(message)[0]?.fieldErrorMessage ??
            'An unexpected error occurred.';
      showSnackbar(messageToShow);
      if (isRetryableError(error)) {
        setTimeout(init, 20000); // Retry in 20 seconds
      } else {
        setTimeout(logout, 2000); // Logout after 2 seconds
      }
    } finally {
      setIsProcessing(false);
    }
  }, [
    authenticated,
    fetchProfile,
    logout,
    setApiAuthHeader,
    showSnackbar,
    withAuth,
  ]);

  useEffect(() => {
    init();
  }, [init]);

  if (isProcessing || !hydrated || (authenticated && !loggedUser.phoneNumber)) {
    return (
      <>
        <SplashScreen />
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
        </Portal>
      </>
    );
  }
  return (
    <NavigationContainer>
      {authenticated && loggedUser.phoneNumber ? <BottomTabs /> : <AuthStack />}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </NavigationContainer>
  );
};

export default AppNav;

/** Gatherer App */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';

import AppNav from '@nav/AppNav';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppNav />
    </>
  );
}

export default App;

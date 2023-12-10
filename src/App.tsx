/** Gatherer App */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';

import {lightTheme} from '@styles/lightTheme';
import {darkTheme} from '@styles/darkTheme';
import AppNav from '@nav/AppNav';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primaryContainer}
        translucent
      />
      <AppNav />
    </PaperProvider>
  );
}

export default App;

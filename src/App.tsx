/** Gatherer App */

import React from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {lightTheme} from '@styles/lightTheme';
import {darkTheme} from '@styles/darkTheme';
import AppNav from '@nav/AppNav';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSettingStore} from '@hooks/useSettingStore';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const selectedTheme = useSettingStore(store => store.theme);
  const theme =
    selectedTheme === 'auto'
      ? isDarkMode
        ? darkTheme
        : lightTheme
      : selectedTheme === 'light'
      ? lightTheme
      : darkTheme;
  const statusBarContent =
    theme === lightTheme ? 'dark-content' : 'light-content';

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={statusBarContent}
          backgroundColor={theme.colors.background}
          translucent={false}
        />
        <SafeAreaView style={styles.container}>
          <AppNav />
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

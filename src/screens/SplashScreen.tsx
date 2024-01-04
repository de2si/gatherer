// SplashScreen.tsx

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';

// assets
import Logo from '@assets/logo.png';

const SplashScreen = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
      <Text style={[theme.fonts.headlineLarge]}>Gatherer</Text>
      <Text style={[theme.fonts.titleLarge, {color: theme.colors.primary}]}>
        Haritika
      </Text>
      <ActivityIndicator size={'large'} style={styles.loadingIndicator} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  loadingIndicator: {
    marginTop: 48,
  },
});

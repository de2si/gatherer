// SplashScreen.tsx

import React from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';

// assets and styles
import Logo from '@assets/logo.png';
import {commonStyles, logoStyles, spacingStyles} from '@styles/common';

const SplashScreen = () => {
  const theme = useTheme();
  return (
    <View style={commonStyles.centeredContainer}>
      <Image source={Logo} style={logoStyles.logoImage} />
      <Text style={[theme.fonts.headlineLarge, logoStyles.gathererText]}>
        Gatherer
      </Text>
      <ActivityIndicator size={'large'} style={spacingStyles.mt48} />
    </View>
  );
};

export default SplashScreen;

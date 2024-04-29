import {configureFonts, MD3LightTheme, MD3Theme} from 'react-native-paper';
import {fontConfig} from '@styles/font';

const appLightTheme = {
  colors: {
    primary: '#B95F5F',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 218, 216)',
    onPrimaryContainer: 'rgb(65, 0, 7)',
    secondary: '#809A7D',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(167, 245, 167)',
    onSecondaryContainer: 'rgb(0, 33, 6)',
    tertiary: '#707070',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(151, 240, 255)',
    onTertiaryContainer: 'rgb(0, 31, 36)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(32, 26, 26)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(32, 26, 26)',
    surfaceVariant: 'rgb(244, 221, 220)',
    onSurfaceVariant: 'rgb(82, 67, 66)',
    outline: 'rgb(133, 115, 114)',
    outlineVariant: 'rgb(215, 193, 192)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(54, 47, 46)',
    inverseOnSurface: 'rgb(251, 238, 237)',
    inversePrimary: 'rgb(255, 179, 177)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(250, 242, 246)',
      level2: 'rgb(247, 236, 240)',
      level3: 'rgb(244, 231, 234)',
      level4: 'rgb(243, 229, 232)',
      level5: 'rgb(241, 225, 229)',
    },
    surfaceDisabled: 'rgba(32, 26, 26, 0.12)',
    onSurfaceDisabled: 'rgba(32, 26, 26, 0.38)',
    backdrop: 'rgba(59, 45, 45, 0.4)',
  },
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: appLightTheme.colors,
  fonts: configureFonts({config: fontConfig}),
};

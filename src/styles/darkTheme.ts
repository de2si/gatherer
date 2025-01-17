import {
  configureFonts,
  MD3DarkTheme as DefaultTheme,
  MD3Theme,
} from 'react-native-paper';
import {fontConfig, fontCustomVariantsConfig} from '@styles/font';

const appDarkTheme = {
  colors: {
    primary: 'rgb(255, 179, 177)',
    onPrimary: 'rgb(95, 19, 25)',
    primaryContainer: 'rgb(126, 42, 45)',
    onPrimaryContainer: 'rgb(255, 218, 216)',
    secondary: 'rgb(140, 216, 141)',
    onSecondary: 'rgb(0, 57, 15)',
    secondaryContainer: 'rgb(0, 83, 26)',
    onSecondaryContainer: 'rgb(167, 245, 167)',
    tertiary: 'rgb(79, 216, 235)',
    onTertiary: 'rgb(0, 54, 61)',
    tertiaryContainer: 'rgb(0, 79, 88)',
    onTertiaryContainer: 'rgb(151, 240, 255)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(32, 26, 26)',
    onBackground: 'rgb(237, 224, 223)',
    surface: 'rgb(32, 26, 26)',
    onSurface: 'rgb(237, 224, 223)',
    surfaceVariant: 'rgb(82, 67, 66)',
    onSurfaceVariant: 'rgb(215, 193, 192)',
    outline: 'rgb(160, 140, 139)',
    outlineVariant: 'rgb(82, 67, 66)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(237, 224, 223)',
    inverseOnSurface: 'rgb(54, 47, 46)',
    inversePrimary: 'rgb(156, 65, 67)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(43, 34, 34)',
      level2: 'rgb(50, 38, 38)',
      level3: 'rgb(57, 43, 43)',
      level4: 'rgb(59, 44, 44)',
      level5: 'rgb(63, 47, 47)',
    },
    surfaceDisabled: 'rgba(237, 224, 223, 0.12)',
    onSurfaceDisabled: 'rgba(237, 224, 223, 0.38)',
    backdrop: 'rgba(59, 45, 45, 0.4)',
  },
};

export const darkTheme: MD3Theme = {
  ...DefaultTheme,
  colors: appDarkTheme.colors,
  fonts: {
    ...configureFonts({config: fontCustomVariantsConfig}),
    ...configureFonts({config: fontConfig}),
  },
};

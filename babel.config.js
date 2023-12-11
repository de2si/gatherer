module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@nav': './src/nav',
          '@assets': './src/assets',
          '@styles': './src/styles',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

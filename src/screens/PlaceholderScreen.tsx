import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

const PlaceholderScreen = ({route}: {route: {params: {name: string}}}) => {
  const {name} = route.params;
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={theme.fonts.titleLarge}>{name}</Text>
    </View>
  );
};
export default PlaceholderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import React from 'react';
import {View, StyleSheet} from 'react-native';
import ImageInput from '@components/ImageInput';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ImageInput />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

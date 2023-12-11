import React from 'react';
import {View, StyleSheet} from 'react-native';
import ImagePicker from '@components/ImagePicker';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ImagePicker />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const FarmerListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>FarmerListScreen</Text>
    </View>
  );
};

export default FarmerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

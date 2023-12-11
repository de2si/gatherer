import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const UserListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>UserListScreen</Text>
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
});

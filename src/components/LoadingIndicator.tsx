// LoadingIndicator.tsx

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

const LoadingIndicator: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={StyleSheet.absoluteFill}>
      <ActivityIndicator
        style={[
          styles.loadingIndicator,
          {backgroundColor: theme.colors.backdrop},
        ]}
        size="large"
        animating={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;

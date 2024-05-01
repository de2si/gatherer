import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text} from '@components/Text';
import {CameraIcon} from '@components/icons/CameraIcon';
import {
  SQUARE_WIDTH,
  SQUARE_HEIGHT,
  ICON_SIZE,
} from '@components/FormImageInput/SingleImage';

interface SquarePlaceholderProps {
  label?: string;
}

const SquarePlaceholder = ({label = 'Upload'}: SquarePlaceholderProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {borderColor: theme.colors.outline, borderRadius: theme.roundness},
      ]}>
      <CameraIcon
        height={ICON_SIZE}
        width={ICON_SIZE}
        color={theme.colors.primary}
      />
      <Text
        variant="bodyXl"
        style={[{color: theme.colors.outline}, styles.placeholderText]}>
        {label}
      </Text>
    </View>
  );
};

export default SquarePlaceholder;

const styles = StyleSheet.create({
  container: {
    width: SQUARE_WIDTH,
    height: SQUARE_HEIGHT,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    lineHeight: 22,
    textAlign: 'center',
  },
});

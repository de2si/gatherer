import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';

import {AccountIcon} from '@components/icons/AccountIcon';
import {UploadIcon} from '@components/icons/UploadIcon';
import {Text} from '@components/Text';
import SingleImage, {
  CIRCLE_DIAMETER,
  ICON_SIZE,
} from '@components/FormImageInput/SingleImage';

import {commonStyles} from '@styles/common';

interface RoundSingleViewProps {
  uri?: string;
}

const RoundSingleView = ({uri = ''}: RoundSingleViewProps) => {
  const theme = useTheme();
  return (
    <View style={[commonStyles.row, styles.container]}>
      {uri ? (
        <SingleImage styleVariant="round" uri={uri} />
      ) : (
        <Avatar.Icon
          size={CIRCLE_DIAMETER}
          icon={AccountIcon}
          color={theme.colors.primary}
        />
      )}

      <UploadIcon
        height={ICON_SIZE}
        width={ICON_SIZE}
        color={theme.colors.outline}
      />
      <View>
        <Text
          variant="bodyXl"
          style={[{color: theme.colors.outline}, styles.cmdText]}>
          {uri ? 'Change' : 'Upload'}
        </Text>
        <Text
          variant="bodyXl"
          style={[{color: theme.colors.outline}, styles.cmdText]}>
          Photo
        </Text>
      </View>
    </View>
  );
};

export default RoundSingleView;

const styles = StyleSheet.create({
  container: {
    columnGap: 8,
    justifyContent: 'flex-start',
  },
  cmdText: {
    lineHeight: 22,
  },
});

// DetailFieldItem.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, MD3Theme} from 'react-native-paper';

interface DetailFieldItemProps {
  label: string;
  value?: string;
  theme: MD3Theme;
  valueComponent?: React.ReactNode;
}

const DetailFieldItem: React.FC<DetailFieldItemProps> = ({
  label,
  value = '',
  theme,
  valueComponent,
}) => (
  <View style={styles.row}>
    <Text
      style={[styles.labelText, {color: theme.colors.outline}]}
      variant="labelLarge">
      {label}
    </Text>
    <View style={styles.valueTextContainer}>
      {valueComponent ? (
        valueComponent
      ) : (
        <Text
          variant="labelLarge"
          style={[{color: theme.colors.onSurfaceVariant}]}>
          {value}
        </Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 24,
    paddingHorizontal: 32,
    marginVertical: 12,
  },
  labelText: {
    minWidth: 90,
  },
  valueTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default DetailFieldItem;

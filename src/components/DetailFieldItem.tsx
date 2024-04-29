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
      style={[styles.labelText, {color: theme.colors.tertiary}]}
      variant="titleMedium">
      {label}
    </Text>
    <View style={styles.valueTextContainer}>
      {valueComponent ? (
        valueComponent
      ) : (
        <Text variant="titleMedium">{value}</Text>
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
    marginVertical: 12,
  },
  labelText: {
    minWidth: 90,
    flex: 2,
  },
  valueTextContainer: {
    flex: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default DetailFieldItem;

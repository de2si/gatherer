// FarmerListItem.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text} from 'react-native-paper';
import ImageWrapper from '@components/ImageWrapper';
import {FarmerPreview} from '@hooks/useFarmerStore';
import {truncateString} from '@helpers/formatters';

interface FarmerListItemProps {
  data: FarmerPreview;
  onPress: (farmer: FarmerPreview) => void;
}

const FarmerListItem: React.FC<FarmerListItemProps> = ({data, onPress}) => (
  <Card mode="elevated" onPress={() => onPress(data)}>
    <Card.Content style={styles.row}>
      <ImageWrapper
        flavor="avatar"
        value={data.photo}
        size={80}
        style={styles.avatar}
      />
      <View style={styles.cardTextContainer}>
        <View style={styles.cardDataRow}>
          <Text variant="titleSmall">{truncateString(data.name)}</Text>
          <Text variant="titleSmall">{data.code}</Text>
        </View>
        <View style={styles.cardDataRow}>
          <Text variant="bodySmall">{truncateString(data.guardian)}</Text>
          <Text variant="bodySmall">{data.phone}</Text>
        </View>
        <Text variant="bodySmall">{data.village.name}</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

export default FarmerListItem;

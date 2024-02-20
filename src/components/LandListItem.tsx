// LandListItem.tsx

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Card, MD3Theme, Text} from 'react-native-paper';
import {LandPreview} from '@hooks/useLandStore';
import {truncateString} from '@helpers/formatters';
import {Ownership} from '@helpers/constants';

interface LandListItemProps {
  data: LandPreview;
  onPress: (land: LandPreview) => void;
  theme: MD3Theme;
}
const LandListItem: React.FC<LandListItemProps> = ({data, onPress, theme}) => (
  <Card mode="elevated" onPress={() => onPress(data)}>
    <Card.Content style={styles.row}>
      <Image
        source={{uri: data.picture.url}}
        style={[
          styles.farmThumbnail,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.roundness,
          },
        ]}
      />
      <View style={styles.cardTextContent}>
        <View style={styles.cardDataRow}>
          <Text variant="titleSmall">
            {data.ownership_type === Ownership.PRIVATE
              ? truncateString(data.farmer.name)
              : data.ownership_type}
          </Text>
          <Text variant="titleSmall">{data.code}</Text>
        </View>
        <View style={styles.cardDataRow}>
          <Text variant="bodySmall">{data.village.name}</Text>
          <Text variant="bodySmall">{data.khasra_number}</Text>
        </View>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  farmThumbnail: {
    height: 80,
    width: 80,
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
});

export default LandListItem;

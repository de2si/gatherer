// LandListItem.tsx

import React from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-paper';
import {LandPreview} from '@hooks/useLandStore';
import {truncateString} from '@helpers/formatters';
import {Ownership} from '@helpers/constants';
import {cardStyles, commonStyles, spacingStyles} from '@styles/common';
import ImageWrapper from '@components/ImageWrapper';
import {Text} from '@components/Text';

interface LandListItemProps {
  data: LandPreview;
  onPress: (land: LandPreview) => void;
  color: string;
  borderColor: string;
}
const LandListItem: React.FC<LandListItemProps> = ({
  data,
  onPress,
  color,
  borderColor,
}) => (
  <Card
    mode="contained"
    onPress={() => onPress(data)}
    style={[cardStyles.card, {borderColor}, spacingStyles.mh16]}>
    <Card.Content style={cardStyles.cardContent}>
      <ImageWrapper
        flavor="regular"
        value={data.picture}
        style={[cardStyles.cardThumbnail, {backgroundColor: color}]}
      />
      <View style={commonStyles.flex1}>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodyXl" style={{color}}>
            {data.ownership_type === Ownership.PRIVATE
              ? truncateString(data.farmer.name)
              : data.ownership_type}
          </Text>
          <Text variant="bodyXl" style={{color}}>
            {data.code}
          </Text>
        </View>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodySmall" style={{color}}>
            {data.village.name}
          </Text>
          <Text variant="bodySmall" style={{color}}>
            {data.khasra_number}
          </Text>
        </View>
      </View>
    </Card.Content>
  </Card>
);

export default LandListItem;

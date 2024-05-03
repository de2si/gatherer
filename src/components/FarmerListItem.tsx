// FarmerListItem.tsx

import React from 'react';
import {View, Pressable, Linking} from 'react-native';
import {Card} from 'react-native-paper';
import {Text} from '@components/Text';
import {PhoneIcon} from '@components/icons/PhoneIcon';
import ImageWrapper from '@components/ImageWrapper';

import {FarmerPreview} from '@hooks/useFarmerStore';
import {truncateString} from '@helpers/formatters';
import {
  cardStyles,
  commonStyles,
  fontStyles,
  spacingStyles,
} from '@styles/common';

interface FarmerListItemProps {
  data: FarmerPreview;
  onPress: (farmer: FarmerPreview) => void;
  color: string;
  borderColor: string;
}

const handleDialPress = (phoneNumber: string) => {
  if (phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  }
};

const FarmerListItem: React.FC<FarmerListItemProps> = ({
  data,
  onPress,
  color,
  borderColor,
}) => (
  <Card
    mode="contained"
    onPress={() => onPress(data)}
    style={[cardStyles.card, {borderColor}]}>
    <Card.Content style={cardStyles.cardContent}>
      <ImageWrapper
        flavor="avatar"
        value={data.photo}
        size={70}
        style={spacingStyles.mr16}
      />
      <View style={commonStyles.flex1}>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodyXl" style={{color}}>
            {truncateString(data.name)}
          </Text>
          <Text variant="bodyXl" style={{color}}>
            {data.code}
          </Text>
        </View>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodySmall" style={{color}}>
            {truncateString(data.guardian)}
          </Text>
          <Pressable
            style={cardStyles.cardSideItem}
            onPress={() => handleDialPress(data.phone)}>
            <PhoneIcon height={24} width={24} color={color} />
            <Text variant="bodyLarge" style={[{color}, fontStyles.regularText]}>
              {data.phone}
            </Text>
          </Pressable>
        </View>
        <Text variant="bodySmall" style={{color}}>
          {data.village.name}
        </Text>
      </View>
    </Card.Content>
  </Card>
);

export default FarmerListItem;

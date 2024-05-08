// ActivityListScreen.tsx

import React from 'react';
import {View} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityStackScreenProps} from '@nav/Project/CarbonSeq/ActivityStack';
import {commonStyles, fontStyles, spacingStyles} from '@styles/common';

interface Activity {
  title: string;
  description: string;
}
const activities: Activity[] = [
  {
    title: 'Targets',
    description:
      'View total and model-wise set targets for all the land participants',
  },
  {
    title: 'Digging',
    description:
      'View total and model-wise digging progress for all the land participants',
  },
  {
    title: 'Fertilization',
    description:
      'View total and model-wise fertilization progress for all the land participants',
  },
  {
    title: 'Plantation',
    description:
      'View total and model-wise plantation progress for all the land participants',
  },
];
export const ACTIVITY_NAMES = activities.map(value => value.title);

type ActivityListScreenProps = NativeStackScreenProps<
  ActivityStackScreenProps,
  'ActivityList'
>;
const ActivityListScreen: React.FC<ActivityListScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const textStyle = [{color: theme.colors.onPrimary}, fontStyles.regularText];
  return (
    <View style={[commonStyles.flex1, spacingStyles.mh16, spacingStyles.mt16]}>
      {activities.map(activity => (
        <Card
          key={activity.title}
          style={[
            spacingStyles.mb16,
            spacingStyles.p8,
            {backgroundColor: theme.colors.primary},
          ]}
          onPress={() => {
            navigation.navigate('ActivityTable', {
              name: activity.title,
            });
          }}>
          <Card.Title
            title={activity.title}
            titleVariant="headlineMedium"
            titleStyle={textStyle}
          />
          <Card.Content>
            <Text variant="bodyLarge" style={[textStyle]}>
              {activity.description}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

export default ActivityListScreen;

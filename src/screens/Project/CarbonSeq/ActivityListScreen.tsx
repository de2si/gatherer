// ActivityListScreen.tsx

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, useTheme} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityStackScreenProps} from '@nav/Project/CarbonSeq/ActivityStack';

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
  return (
    <View style={styles.container}>
      {activities.map(activity => (
        <Card
          key={activity.title}
          style={[styles.card]}
          onPress={() => {
            navigation.navigate('ActivityTable', {
              name: activity.title,
            });
          }}>
          <Card.Title
            title={activity.title}
            titleVariant="headlineSmall"
            titleStyle={{
              color: theme.colors.primary,
            }}
          />
          <Card.Content>
            <Text variant="bodyMedium">{activity.description}</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

export default ActivityListScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  card: {
    margin: 4,
  },
});

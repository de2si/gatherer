// ActivityStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/nav/CustomBackBtn';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import ActivityListScreen from '@screens/Project/CarbonSeq/ActivityListScreen';
import ActivityTableScreen from '@screens/Project/CarbonSeq/ActivityTableScreen';

// define screen params
export type ActivityStackScreenProps = {
  ActivityList: {};
  ActivityTable: {name: string};
};

// create navigation stack
const Stack = createNativeStackNavigator<ActivityStackScreenProps>();

const ActivityStack = (): React.JSX.Element => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.background},
        headerTitleStyle: theme.fonts.titleLarge,
        headerTintColor: theme.colors.tertiary,
        headerLeft: CustomBackBtn,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 20,
          borderTopWidth: route.name === 'ActivityTable' ? 2 : 0,
          borderTopColor: theme.colors.tertiary,
        },
      })}>
      <Stack.Screen
        name="ActivityList"
        component={ActivityListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="ActivityTable" component={ActivityTableScreen} />
    </Stack.Navigator>
  );
};

export default ActivityStack;

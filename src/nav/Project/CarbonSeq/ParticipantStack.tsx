// ParticipantStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/nav/CustomBackBtn';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import ParticipantListScreen from '@screens/Project/CarbonSeq/ParticipantListScreen';
import ParticipantDetailScreen from '@screens/Project/CarbonSeq/ParticipantDetailScreen';
import ParticipantAddScreen from '@screens/Project/CarbonSeq/ParticipantAddScreen';

// types
import {ApiParticipant} from '@hooks/carbonSeqHooks';

// define screen params
export type ParticipantStackScreenProps = {
  ParticipantList: {};
  ParticipantDetail: {id: number; participant?: ApiParticipant};
  ParticipantAdd: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<ParticipantStackScreenProps>();

const ParticipantStack = (): React.JSX.Element => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
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
          borderTopWidth: 2,
          borderTopColor: theme.colors.tertiary,
        },
      }}>
      <Stack.Screen
        name="ParticipantList"
        component={ParticipantListScreen}
        options={{
          title: 'Participants',
        }}
      />
      <Stack.Screen
        name="ParticipantAdd"
        component={ParticipantAddScreen}
        options={{title: 'Add participant'}}
      />

      <Stack.Screen
        name="ParticipantDetail"
        component={ParticipantDetailScreen}
        options={{title: 'Participant'}}
      />
    </Stack.Navigator>
  );
};

export default ParticipantStack;

// CarbonSeqTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ActivityStack from '@nav/Project/CarbonSeq/ActivityStack';
import ParticipantStack from '@nav/Project/CarbonSeq/ParticipantStack';

// define screen params
export type CarbonSeqTabsNavProps = {
  Activity: {};
  Participant: {};
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<CarbonSeqTabsNavProps>();

const CarbonSeqTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarLabelStyle: {
          fontWeight: 'normal',
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}>
      <Tab.Screen name="Activity" component={ActivityStack} />
      <Tab.Screen name="Participant" component={ParticipantStack} />
    </Tab.Navigator>
  );
};

export default CarbonSeqTabs;

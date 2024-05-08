// CarbonSeqTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import ActivityStack from '@nav/Project/CarbonSeq/ActivityStack';
import ParticipantStack from '@nav/Project/CarbonSeq/ParticipantStack';
import CustomTopBar from '@components/nav/CustomTopBar';

import {commonStyles} from '@styles/common';

// define screen params
export type CarbonSeqTabsNavProps = {
  Activity: {};
  Participant: {};
};

const CustomBar = (props: MaterialTopTabBarProps) => {
  const theme = useTheme();
  return (
    <CustomTopBar theme={theme} rightSide={true} maxWidth={100} {...props} />
  );
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<CarbonSeqTabsNavProps>();

const CarbonSeqTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBar={CustomBar}
      sceneContainerStyle={[
        commonStyles.flex1,
        {backgroundColor: theme.colors.background},
      ]}>
      <Tab.Screen name="Activity" component={ActivityStack} />
      <Tab.Screen name="Participant" component={ParticipantStack} />
    </Tab.Navigator>
  );
};

export default CarbonSeqTabs;

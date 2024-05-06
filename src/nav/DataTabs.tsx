// DataTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// components
import {FarmerIcon} from '@components/icons/FarmerIcon';
import {LandIcon} from '@components/icons/LandIcon';
import {BeneficiaryIcon} from '@components/icons/BeneficiaryIcon';
import CustomTopBar from '@components/nav/CustomTopBar';

// navigation
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import FarmerStack from '@nav/FarmerStack';
import LandStack from '@nav/LandStack';
import BeneficiaryStack from '@nav/BeneficiaryStack';

import {commonStyles} from '@styles/common';

const CustomDataBar = (props: MaterialTopTabBarProps) => {
  const theme = useTheme();
  return <CustomTopBar theme={theme} flavor={'icon'} {...props} />;
};

const Tab = createMaterialTopTabNavigator();

const DataTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBar={CustomDataBar}
      sceneContainerStyle={[
        commonStyles.flex1,
        {backgroundColor: theme.colors.background},
      ]}>
      <Tab.Screen
        name="Farmer"
        component={FarmerStack}
        options={{
          tabBarIcon: FarmerIcon,
        }}
      />
      <Tab.Screen
        name="Land"
        component={LandStack}
        options={{
          tabBarIcon: LandIcon,
        }}
      />
      <Tab.Screen
        name="Beneficiary"
        component={BeneficiaryStack}
        options={{
          tabBarIcon: BeneficiaryIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default DataTabs;

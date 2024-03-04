// DataTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FarmerStack from '@nav/FarmerStack';
import LandStack from '@nav/LandStack';
import BeneficiaryStack from '@nav/BeneficiaryStack';

// define screen params
export type DataTabsNavProps = {
  Farmer: {};
  Land: {};
  Beneficiary: {};
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<DataTabsNavProps>();

const DataTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontWeight: 'normal',
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}>
      <Tab.Screen name="Farmer" component={FarmerStack} />
      <Tab.Screen name="Land" component={LandStack} />
      <Tab.Screen name="Beneficiary" component={BeneficiaryStack} />
    </Tab.Navigator>
  );
};

export default DataTabs;

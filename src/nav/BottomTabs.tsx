// BottomTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import DataTabs from '@nav/DataTabs';

// screens
import PlaceholderScreen from '@screens/PlaceholderScreen';

// define screen params
export type BottomTabsNavProps = {
  Data: undefined;
  Project: {name: string};
  User: {name: string};
  Profile: {name: string};
};

// create navigation tab
const BottomTabNav = createMaterialBottomTabNavigator<BottomTabsNavProps>();

const BottomTabs = () => {
  const theme = useTheme();
  return (
    <BottomTabNav.Navigator theme={theme}>
      <BottomTabNav.Screen
        name="Data"
        component={DataTabs}
        options={{tabBarIcon: 'notebook', title: 'Data'}}
      />
      <BottomTabNav.Screen
        name="Project"
        component={PlaceholderScreen}
        initialParams={{name: 'Project'}}
        options={{tabBarIcon: 'ruler-square-compass', title: 'Projects'}}
      />
      <BottomTabNav.Screen
        name="User"
        component={PlaceholderScreen}
        initialParams={{name: 'User'}}
        options={{tabBarIcon: 'account-supervisor', title: 'Users'}}
      />
      <BottomTabNav.Screen
        name="Profile"
        component={PlaceholderScreen}
        initialParams={{name: 'Profile'}}
        options={{tabBarIcon: 'account-details', title: 'Profile'}}
      />
    </BottomTabNav.Navigator>
  );
};

export default BottomTabs;

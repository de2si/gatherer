// BottomTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import DataTabs from '@nav/DataTabs';

// screens
import PlaceholderScreen from '@screens/PlaceholderScreen';
import ProfileStack from '@nav/ProfileStack';
import {useAuthStore} from '@hooks/useAuthStore';

// define screen params
export type BottomTabsNavProps = {
  Data: undefined;
  Project: {name: string};
  User: {name: string};
  Profile: {};
};

// create navigation tab
const BottomTabNav = createMaterialBottomTabNavigator<BottomTabsNavProps>();

const BottomTabs = () => {
  let userType = useAuthStore(store => store.user.userType);
  const theme = useTheme();
  return (
    <BottomTabNav.Navigator theme={theme} initialRouteName="Project">
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
      {userType !== 'SURVEYOR' && (
        <BottomTabNav.Screen
          name="User"
          component={PlaceholderScreen}
          initialParams={{name: 'User'}}
          options={{tabBarIcon: 'account-supervisor', title: 'Users'}}
        />
      )}
      <BottomTabNav.Screen
        name="Profile"
        component={ProfileStack}
        options={{tabBarIcon: 'account-details', title: 'Profile'}}
      />
    </BottomTabNav.Navigator>
  );
};

export default BottomTabs;

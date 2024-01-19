// BottomTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import DataTabs from '@nav/DataTabs';
import MoreStack from '@nav/MoreStack';

// screens
import PlaceholderScreen from '@screens/PlaceholderScreen';

// hooks
import {useProfileStore} from '@hooks/useProfileStore';

// define screen params
export type BottomTabsNavProps = {
  Data: undefined;
  Project: {name: string};
  User: {name: string};
  More: {};
};

// create navigation tab
const BottomTabNav = createMaterialBottomTabNavigator<BottomTabsNavProps>();

const BottomTabs = () => {
  let loggedUser = useProfileStore(store => store.data);
  const theme = useTheme();
  return (
    <BottomTabNav.Navigator
      theme={theme}
      initialRouteName="Project"
      safeAreaInsets={{bottom: 0}}>
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
      {loggedUser.userType !== 'SURVEYOR' && (
        <BottomTabNav.Screen
          name="User"
          component={PlaceholderScreen}
          initialParams={{name: 'User'}}
          options={{tabBarIcon: 'account-supervisor', title: 'Users'}}
        />
      )}
      <BottomTabNav.Screen
        name="More"
        component={MoreStack}
        options={{tabBarIcon: 'account-details', title: 'More'}}
      />
    </BottomTabNav.Navigator>
  );
};

export default BottomTabs;

// BottomTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import DataTabs from '@nav/DataTabs';
import UserTabs from '@nav/UserTabs';
import MoreStack from '@nav/MoreStack';

// screens
import ProjectScreen from '@screens/ProjectScreen';

// hooks
import {useProfileStore} from '@hooks/useProfileStore';

// types
import {UserType} from '@helpers/constants';

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
        component={ProjectScreen}
        initialParams={{name: 'Project'}}
        options={{tabBarIcon: 'ruler-square-compass', title: 'Projects'}}
      />
      {loggedUser.userType !== UserType.SURVEYOR && (
        <BottomTabNav.Screen
          name="User"
          component={UserTabs}
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

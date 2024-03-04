// UserTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import UserStack from '@nav/UserStack';

// stores
import {useProfileStore} from '@hooks/useProfileStore';

// types
import {UserType} from '@helpers/constants';

type UserTabParams = {
  userType: UserType;
};
// define screen params
export type UserTabsNavProps = {
  Admin: UserTabParams;
  Supervisor: UserTabParams;
  Surveyor: UserTabParams;
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<UserTabsNavProps>();

const UserTabs = () => {
  const theme = useTheme();
  let loggedUser = useProfileStore(store => store.data);
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
      {loggedUser.userType === UserType.ADMIN && (
        <>
          <Tab.Screen
            name="Admin"
            component={UserStack}
            initialParams={{userType: UserType.ADMIN}}
          />
          <Tab.Screen
            name="Supervisor"
            component={UserStack}
            initialParams={{userType: UserType.SUPERVISOR}}
          />
        </>
      )}
      <Tab.Screen
        name="Surveyor"
        component={UserStack}
        initialParams={{userType: UserType.SURVEYOR}}
      />
    </Tab.Navigator>
  );
};

export default UserTabs;

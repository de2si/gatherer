// UserTabs.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomTopBar from '@components/nav/CustomTopBar';

// navigation
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import UserStack from '@nav/UserStack';

// stores
import {useProfileStore} from '@hooks/useProfileStore';

// types
import {UserType} from '@helpers/constants';

import {commonStyles} from '@styles/common';

type UserTabParams = {
  userType: UserType;
};
// define screen params
export type UserTabsNavProps = {
  Admin: UserTabParams;
  Supervisor: UserTabParams;
  Surveyor: UserTabParams;
};

const CustomUserBar = (props: MaterialTopTabBarProps) => {
  const theme = useTheme();
  return <CustomTopBar theme={theme} {...props} />;
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<UserTabsNavProps>();

const UserTabs = () => {
  const theme = useTheme();
  let loggedUser = useProfileStore(store => store.data);
  return (
    <Tab.Navigator
      tabBar={CustomUserBar}
      sceneContainerStyle={[
        commonStyles.flex1,
        {backgroundColor: theme.colors.background},
      ]}>
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

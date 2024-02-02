// UserStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// screens
import UserListScreen from '@screens/User/UserListScreen';
import UserDetailScreen from '@screens/User/UserDetailScreen';
import UserFormScreen from '@screens/User/UserFormScreen';
import UserPasswordScreen from '@screens/User/UserPasswordScreen';

// types
import {UserType} from '@helpers/constants';
import {UserTabsNavProps} from '@nav/UserTabs';
import {ApiUserType} from '@hooks/useProfileStore';

// define screen params
export type UserStackScreenProps = {
  UserList: {userType: UserType};
  UserDetail: {id: number; user?: ApiUserType; userType: UserType};
  UserAdd: {variant: 'add'; userType: UserType};
  UserEdit: {
    variant: 'edit';
    user: ApiUserType;
    userType: UserType;
  };
  UserPassword: {
    id: number;
    userType: UserType;
  };
};

// create navigation stack
const Stack = createNativeStackNavigator<UserStackScreenProps>();

type UserStackProps = NativeStackScreenProps<
  UserTabsNavProps,
  'Admin' | 'Supervisor' | 'Surveyor'
>;
const UserStack: React.FC<UserStackProps> = ({route}) => {
  const theme = useTheme();
  const {userType} = route.params;
  const userTypeSentenceCase =
    userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
  const userTypeLowerCase = userType.toLowerCase();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.background},
        headerTitleStyle: theme.fonts.titleMedium,
        contentStyle: {flex: 1, backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        initialParams={{userType}}
        options={{
          title: `${userTypeSentenceCase}s`,
        }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{title: `${userTypeSentenceCase} details`}}
      />
      <Stack.Screen
        name="UserAdd"
        component={UserFormScreen}
        initialParams={{variant: 'add', userType}}
        options={{title: `Add ${userTypeLowerCase}`}}
      />
      <Stack.Screen
        name="UserEdit"
        component={UserFormScreen}
        options={{title: `Update ${userTypeLowerCase}`}}
      />
      <Stack.Screen
        name="UserPassword"
        component={UserPasswordScreen}
        options={{title: 'Reset password'}}
      />
    </Stack.Navigator>
  );
};

export default UserStack;

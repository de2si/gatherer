// UserStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/nav/CustomBackBtn';

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

const UserDetailScreenWrapper: React.FC<
  NativeStackScreenProps<UserStackScreenProps, 'UserDetail'>
> = props => {
  return <UserDetailScreen {...props} />;
};

const UserFormScreenWrapper: React.FC<
  NativeStackScreenProps<UserStackScreenProps, 'UserAdd' | 'UserEdit'>
> = props => {
  return <UserFormScreen {...props} />;
};

const UserPasswordScreenWrapper: React.FC<
  NativeStackScreenProps<UserStackScreenProps, 'UserPassword'>
> = props => {
  return <UserPasswordScreen {...props} />;
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
        headerTitleStyle: theme.fonts.titleLarge,
        headerTintColor: theme.colors.tertiary,
        headerLeft: CustomBackBtn,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 20,
          borderTopWidth: 2,
          borderTopColor: theme.colors.tertiary,
        },
      }}>
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        initialParams={{userType}}
        options={{
          title: '', // `${userTypeSentenceCase}s`,
        }}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreenWrapper}
        options={{title: `${userTypeSentenceCase} details`}}
      />
      <Stack.Screen
        name="UserAdd"
        component={UserFormScreenWrapper}
        initialParams={{variant: 'add', userType}}
        options={{title: `Add ${userTypeLowerCase}`}}
      />
      <Stack.Screen
        name="UserEdit"
        component={UserFormScreenWrapper}
        options={{title: `Update ${userTypeLowerCase}`}}
      />
      <Stack.Screen
        name="UserPassword"
        component={UserPasswordScreenWrapper}
        options={{title: 'Reset password'}}
      />
    </Stack.Navigator>
  );
};

export default UserStack;

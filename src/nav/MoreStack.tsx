// MoreStack.tsx

import React from 'react';

// navigation
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// screens
import MoreListScreen from '@screens/More/MoreListScreen';
import UserPasswordScreen from '@screens/User/UserPasswordScreen';
import UserDetailScreen from '@screens/User/UserDetailScreen';
import UserFormScreen from '@screens/User/UserFormScreen';

// define screen params
export type MoreStackScreenProps = {
  MoreList: {};
  ProfileDetail: {};
  ProfileEdit: {};
  ProfilePassword: {
    id: number;
  };
};

const ProfileDetailScreenWrapper: React.FC<
  NativeStackScreenProps<MoreStackScreenProps, 'ProfileDetail'>
> = props => {
  return <UserDetailScreen {...props} />;
};

const ProfileEditScreenWrapper: React.FC<
  NativeStackScreenProps<MoreStackScreenProps, 'ProfileEdit'>
> = props => {
  return <UserFormScreen {...props} />;
};

const ProfilePasswordScreenWrapper: React.FC<
  NativeStackScreenProps<MoreStackScreenProps, 'ProfilePassword'>
> = props => {
  return <UserPasswordScreen {...props} />;
};

// create navigation stack
const Stack = createNativeStackNavigator<MoreStackScreenProps>();

const MoreStack = (): React.JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreList"
        component={MoreListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreenWrapper}
        options={{title: 'Profile details'}}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreenWrapper}
        options={{title: 'Edit profile'}}
      />
      <Stack.Screen
        name="ProfilePassword"
        component={ProfilePasswordScreenWrapper}
        options={{title: 'Change password'}}
      />
    </Stack.Navigator>
  );
};

export default MoreStack;

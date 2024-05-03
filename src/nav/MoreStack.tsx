// MoreStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/CustomBackBtn';

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
import ThemeScreen from '@screens/More/ThemeScreen';

// define screen params
export type MoreStackScreenProps = {
  MoreList: {};
  ProfileDetail: {};
  ProfileEdit: {};
  ProfilePassword: {
    id: number;
  };
  ThemeSelect: {};
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
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
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
          borderTopWidth: route.name === 'MoreList' ? 0 : 2,
          borderTopColor: theme.colors.tertiary,
        },
      })}>
      <Stack.Screen
        name="MoreList"
        component={MoreListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreenWrapper}
        options={{title: 'Profile'}}
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
      <Stack.Screen
        name="ThemeSelect"
        component={ThemeScreen}
        options={{title: 'Choose theme'}}
      />
    </Stack.Navigator>
  );
};

export default MoreStack;

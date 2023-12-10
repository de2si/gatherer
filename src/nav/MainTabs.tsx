import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// screens
import HomeScreen from '@screens/HomeScreen';
import UserListScreen from '@screens/User/UserListScreen';

// define screen params
export type MainTabsNavProps = {
  HomeScreen: undefined;
  UserListScreen: undefined;
};

// create navigation tab
const Tab = createMaterialTopTabNavigator<MainTabsNavProps>();

const MainTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.primaryContainer,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.backdrop,
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="UserListScreen"
        component={UserListScreen}
        options={{
          title: 'Users',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

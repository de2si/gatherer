import React from 'react';

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
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#00563B',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'white',
          borderColor: 'white',
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

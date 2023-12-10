// MainStack.tsx

import React from 'react';
import {Button} from 'react-native';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import FarmerListScreen from '@screens/Farmer/FarmerListScreen';
import MainTabs from '@nav/MainTabs';

// define screen params
export type MainStackScreenProps = {
  FarmerListScreen: undefined;
  MainTabs: undefined;
};

// create navigation stack
const Stack = createNativeStackNavigator<MainStackScreenProps>();

const MainStack = (): React.JSX.Element => {
  const logoutButton = () => {
    return <Button title="Logout" />;
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'Gatherer',
          headerBackVisible: false,
          headerTitleStyle: {
            fontSize: 24,
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#00563B',
          },
          headerRight: logoutButton,
        }}
      />
      <Stack.Screen
        name="FarmerListScreen"
        component={FarmerListScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;

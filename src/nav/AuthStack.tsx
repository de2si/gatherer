// AuthStack.tsx

import React from 'react';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import LoginScreen from '@screens/Auth/LoginScreen';

// define screen params
export type AuthStackScreenProps = {
  LoginScreen: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<AuthStackScreenProps>();

const AuthStack = (): React.JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

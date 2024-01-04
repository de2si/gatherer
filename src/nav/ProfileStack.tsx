// ProfileStack.tsx

import React from 'react';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import MoreScreen from '@screens/Profile/MoreScreen';

// define screen params
export type ProfileStackScreenProps = {
  MoreScreen: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<ProfileStackScreenProps>();

const ProfileStack = (): React.JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

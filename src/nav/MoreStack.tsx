// MoreStack.tsx

import React from 'react';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import MoreListScreen from '@screens/More/MoreListScreen';

// define screen params
export type MoreStackScreenProps = {
  MoreList: {};
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
    </Stack.Navigator>
  );
};

export default MoreStack;

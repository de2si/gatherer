// AppStack.tsx

import React from 'react';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from '@nav/BottomTabs';

// screens
import PlaceholderScreen from '@screens/PlaceholderScreen';

// define screen params
export type AppStackScreenProps = {
  BottomTabs: {};
  FarmerSearch: {name: string};
};

// create navigation stack
const Stack = createNativeStackNavigator<AppStackScreenProps>();

const AppStack = (): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
        name="FarmerSearch"
        component={PlaceholderScreen}
        initialParams={{name: 'Farmer Search'}}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
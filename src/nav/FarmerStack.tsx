// FarmerStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import FarmerListScreen from '@screens/Farmer/FarmerListScreen';
import FarmerDetailScreen from '@screens/Farmer/FarmerDetailScreen';
import FarmerAddScreen from '@screens/Farmer/FarmerAddScreen';
import FarmerEditScreen from '@screens/Farmer/FarmerEditScreen';

// define screen params
export type FarmerStackScreenProps = {
  FarmerList: {};
  FarmerDetail: {id: number};
  FarmerAdd: {};
  FarmerEdit: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<FarmerStackScreenProps>();

const FarmerStack = (): React.JSX.Element => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.background},
        headerTitleStyle: theme.fonts.titleMedium,
        contentStyle: {flex: 1, backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="FarmerList"
        component={FarmerListScreen}
        options={{
          title: 'Farmers',
        }}
      />
      <Stack.Screen
        name="FarmerDetail"
        component={FarmerDetailScreen}
        options={{title: 'Farmer details'}}
      />
      <Stack.Screen
        name="FarmerAdd"
        component={FarmerAddScreen}
        options={{title: 'Add farmer'}}
      />
      <Stack.Screen
        name="FarmerEdit"
        component={FarmerEditScreen}
        options={{title: 'Update farmer details'}}
      />
    </Stack.Navigator>
  );
};

export default FarmerStack;

// FarmerStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import FarmerListScreen from '@screens/Farmer/FarmerListScreen';
import FarmerDetailScreen from '@screens/Farmer/FarmerDetailScreen';
import FarmerFormScreen from '@screens/Farmer/FarmerFormScreen';

// types
import {APiFarmer} from '@hooks/useFarmerStore';

// define screen params
export type FarmerStackScreenProps = {
  FarmerList: {};
  FarmerDetail: {id: number; farmer?: APiFarmer};
  FarmerAdd: {variant: 'add'};
  FarmerEdit: {variant: 'edit'; farmer: APiFarmer};
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
        component={FarmerFormScreen}
        initialParams={{variant: 'add'}}
        options={{title: 'Add farmer'}}
      />
      <Stack.Screen
        name="FarmerEdit"
        component={FarmerFormScreen}
        options={{title: 'Update farmer'}}
      />
    </Stack.Navigator>
  );
};

export default FarmerStack;

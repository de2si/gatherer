// FarmerStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/nav/CustomBackBtn';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import FarmerListScreen from '@screens/Farmer/FarmerListScreen';
import FarmerDetailScreen from '@screens/Farmer/FarmerDetailScreen';
import FarmerFormScreen from '@screens/Farmer/FarmerFormScreen';

// types
import {ApiFarmer} from '@hooks/useFarmerStore';

// define screen params
export type FarmerStackScreenProps = {
  FarmerList: {};
  FarmerDetail: {id: number; farmer?: ApiFarmer};
  FarmerAdd: {variant: 'add'};
  FarmerEdit: {variant: 'edit'; farmer: ApiFarmer};
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
        headerTitleStyle: theme.fonts.titleLarge,
        headerTintColor: theme.colors.tertiary,
        headerLeft: CustomBackBtn,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 20,
          borderTopWidth: 2,
          borderTopColor: theme.colors.tertiary,
        },
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
        options={{title: 'Farmer'}}
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

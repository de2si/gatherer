// FarmerStack.tsx

import React from 'react';
import {Button, IconButton, useTheme} from 'react-native-paper';

// navigation
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// screens
import FarmerListScreen from '@screens/Farmer/FarmerListScreen';
import FarmerAddScreen from '@screens/Farmer/FarmerAddScreen';
import FarmerEditScreen from '@screens/Farmer/FarmerEditScreen';

// define screen params
export type FarmerStackScreenProps = {
  FarmerList: {};
  FarmerAdd: {};
  FarmerEdit: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<FarmerStackScreenProps>();

const farmerListHeaderRight = ({
  navigation,
}: {
  navigation: NativeStackScreenProps<
    FarmerStackScreenProps,
    'FarmerList'
  >['navigation'];
}) => {
  const handleAddPress = () => {
    navigation.navigate('FarmerAdd', {});
  };
  return (
    <>
      <IconButton icon="filter-outline" size={24} />
      <IconButton icon="magnify" size={24} />
      <Button mode="contained-tonal" onPress={handleAddPress}>
        Add
      </Button>
    </>
  );
};

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
        options={({navigation}) => ({
          title: 'Farmers',
          headerRight: () => farmerListHeaderRight({navigation}),
        })}
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

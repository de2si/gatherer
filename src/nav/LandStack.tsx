// LandStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import LandListScreen from '@screens/Land/LandListScreen';
import LandDetailScreen from '@screens/Land/LandDetailScreen';
import LandFormScreen from '@screens/Land/LandFormScreen';

// types
import {ApiLand} from '@hooks/useLandStore';

// define screen params
export type LandStackScreenProps = {
  LandList: {};
  LandDetail: {id: number; land?: ApiLand};
  LandAdd: {variant: 'add'};
  LandEdit: {variant: 'edit'; land: ApiLand};
};

// create navigation stack
const Stack = createNativeStackNavigator<LandStackScreenProps>();

const LandStack = (): React.JSX.Element => {
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
        name="LandList"
        component={LandListScreen}
        options={{
          title: 'Lands',
        }}
      />
      <Stack.Screen
        name="LandDetail"
        component={LandDetailScreen}
        options={{title: 'Land details'}}
      />
      <Stack.Screen
        name="LandAdd"
        component={LandFormScreen}
        initialParams={{variant: 'add'}}
        options={{title: 'Add land'}}
      />
      <Stack.Screen
        name="LandEdit"
        component={LandFormScreen}
        options={{title: 'Update land'}}
      />
    </Stack.Navigator>
  );
};

export default LandStack;
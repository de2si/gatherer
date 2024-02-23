// BeneficiaryStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import BeneficiaryListScreen from '@screens/Beneficiary/BeneficiaryListScreen';
import BeneficiaryDetailScreen from '@screens/Beneficiary/BeneficiaryDetailScreen';
import BeneficiaryFormScreen from '@screens/Beneficiary/BeneficiaryFormScreen';

// types
import {ApiBeneficiary} from '@hooks/useBeneficiaryStore';

// define screen params
export type BeneficiaryStackScreenProps = {
  BeneficiaryList: {};
  BeneficiaryDetail: {id: number; beneficiary?: ApiBeneficiary};
  BeneficiaryAdd: {variant: 'add'};
  BeneficiaryEdit: {variant: 'edit'; beneficiary: ApiBeneficiary};
};

// create navigation stack
const Stack = createNativeStackNavigator<BeneficiaryStackScreenProps>();

const BeneficiaryStack = (): React.JSX.Element => {
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
        name="BeneficiaryList"
        component={BeneficiaryListScreen}
        options={{
          title: 'Beneficiaries',
        }}
      />
      <Stack.Screen
        name="BeneficiaryDetail"
        component={BeneficiaryDetailScreen}
        options={{title: 'Beneficiary details'}}
      />
      <Stack.Screen
        name="BeneficiaryAdd"
        component={BeneficiaryFormScreen}
        initialParams={{variant: 'add'}}
        options={{title: 'Add beneficiary'}}
      />
      <Stack.Screen
        name="BeneficiaryEdit"
        component={BeneficiaryFormScreen}
        options={{title: 'Update beneficiary'}}
      />
    </Stack.Navigator>
  );
};

export default BeneficiaryStack;
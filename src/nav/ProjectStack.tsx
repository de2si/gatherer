// ProjectStack.tsx

import React from 'react';
import {useTheme} from 'react-native-paper';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CarbonSeqTabs from '@nav/Project/CarbonSeq/CarbonSeqTabs';

// screens
import ProjectScreen from '@screens/Project/ProjectScreen';

// define screen params
export type ProjectStackScreenProps = {
  HomeScreen: {};
  CarbonSeq: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<ProjectStackScreenProps>();

const ProjectStack = (): React.JSX.Element => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.background},
        headerTitleStyle: theme.fonts.titleMedium,
        headerTintColor: theme.colors.onSurface,
        contentStyle: {flex: 1, backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={ProjectScreen}
        options={{
          title: 'Projects',
        }}
      />
      <Stack.Screen
        name="CarbonSeq"
        component={CarbonSeqTabs}
        options={{
          title: 'Carbon Sequestration',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProjectStack;

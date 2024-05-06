// ProjectStack.tsx

import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import CustomBackBtn from '@components/nav/CustomBackBtn';
import {ProjectIcon} from '@components/icons/ProjectIcon';
import {commonStyles, spacingStyles} from '@styles/common';

// navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CarbonSeqTabs from '@nav/Project/CarbonSeq/CarbonSeqTabs';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';

// screens
import ProjectScreen from '@screens/Project/ProjectScreen';

// define screen params
export type ProjectStackScreenProps = {
  HomeScreen: {};
  CarbonSeq: {};
};

// create navigation stack
const Stack = createNativeStackNavigator<ProjectStackScreenProps>();

const CustomBack: React.FC<HeaderBackButtonProps> = props => {
  const theme = useTheme();
  return (
    <View style={[commonStyles.rowWrap, spacingStyles.mr16]}>
      <CustomBackBtn {...props} />
      <ProjectIcon color={theme.colors.primary} height={24} width={24} />
    </View>
  );
};

const ProjectStack = (): React.JSX.Element => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: theme.colors.background},
        headerTitleStyle: theme.fonts.titleLarge,
        headerTintColor: theme.colors.tertiary,
        headerLeft: CustomBack,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background,
          borderRadius: 20,
          borderTopWidth: route.name === 'HomeScreen' ? 2 : 0,
          borderTopColor: theme.colors.tertiary,
        },
      })}>
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

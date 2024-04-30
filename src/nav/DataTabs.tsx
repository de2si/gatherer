// DataTabs.tsx

import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';

// components
import CustomTopTabIcon from '@components/CustomTopTabIcon';
import {FarmerIcon} from '@components/icons/FarmerIcon';
import {LandIcon} from '@components/icons/LandIcon';
import {BeneficiaryIcon} from '@components/icons/BeneficiaryIcon';

// navigation
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import FarmerStack from '@nav/FarmerStack';
import LandStack from '@nav/LandStack';
import BeneficiaryStack from '@nav/BeneficiaryStack';

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.tabContainer, {backgroundColor: theme.colors.background}]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconColor = isFocused
          ? theme.colors.onSecondary
          : theme.colors.onPrimary;
        const bgColor = isFocused
          ? theme.colors.secondary
          : theme.colors.primary;
        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabButton, {backgroundColor: bgColor}]}>
            <CustomTopTabIcon icon={options.tabBarIcon} color={iconColor} />
          </Pressable>
        );
      })}
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

const DataTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      sceneContainerStyle={[
        styles.screenContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <Tab.Screen
        name="Farmer"
        component={FarmerStack}
        options={{
          tabBarIcon: FarmerIcon,
        }}
      />
      <Tab.Screen
        name="Land"
        component={LandStack}
        options={{
          tabBarIcon: LandIcon,
        }}
      />
      <Tab.Screen
        name="Beneficiary"
        component={BeneficiaryStack}
        options={{
          tabBarIcon: BeneficiaryIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default DataTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 4,
    maxHeight: 50,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  screenContainer: {
    flex: 1,
  },
});

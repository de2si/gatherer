// BottomTabs.tsx

import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MD3Theme, Text, useTheme} from 'react-native-paper';

// components
import CustomBottomTabIcon from '@components/CustomBottomTabIcon';
import {AccountIcon} from '@components/icons/AccountIcon';
import {DataIcon} from '@components/icons/DataIcon';
import {UsersIcon} from '@components/icons/UsersIcon';
import {ProjectIcon} from '@components/icons/ProjectIcon';

// navigation
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import DataTabs from '@nav/DataTabs';
import UserTabs from '@nav/UserTabs';
import MoreStack from '@nav/MoreStack';
import ProjectStack from '@nav/ProjectStack';

// hooks
import {useProfileStore} from '@hooks/useProfileStore';

// types
import {UserType} from '@helpers/constants';

const CustomBottomBar = ({
  state,
  descriptors,
  navigation,
  theme,
}: BottomTabBarProps & {theme: MD3Theme}) => {
  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.outline,
        },
      ]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
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
          ? theme.colors.background
          : theme.colors.primary;
        const bgColor = isFocused
          ? theme.colors.secondary
          : theme.colors.background;
        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabButton]}>
            <View style={[styles.tabButtonContent, {backgroundColor: bgColor}]}>
              <CustomBottomTabIcon
                icon={options.tabBarIcon}
                color={iconColor}
                bgColor={bgColor}
              />
              <Text style={{color: iconColor}} variant="labelMedium">
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

// create navigation tab
const BottomTabNav = createBottomTabNavigator();

const BottomTabs = () => {
  let loggedUser = useProfileStore(store => store.data);
  const theme = useTheme();
  return (
    <BottomTabNav.Navigator
      tabBar={props => CustomBottomBar({...props, theme})}
      initialRouteName="Project"
      safeAreaInsets={{bottom: 0}}
      screenOptions={{headerShown: false}}
      sceneContainerStyle={{backgroundColor: theme.colors.background}}>
      <BottomTabNav.Screen
        name="Project"
        component={ProjectStack}
        options={{tabBarIcon: ProjectIcon, title: 'Projects'}}
      />
      <BottomTabNav.Screen
        name="Data"
        component={DataTabs}
        options={{tabBarIcon: DataIcon}}
      />

      {loggedUser.userType !== UserType.SURVEYOR && (
        <BottomTabNav.Screen
          name="User"
          component={UserTabs}
          options={{tabBarIcon: UsersIcon, title: 'Users'}}
        />
      )}
      <BottomTabNav.Screen
        name="More"
        component={MoreStack}
        options={{tabBarIcon: AccountIcon, title: 'Account'}}
      />
    </BottomTabNav.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
    maxHeight: 100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
  },
  tabButtonContent: {
    flex: 1,
    // rowGap: 4,
    margin: 8,
    padding: 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

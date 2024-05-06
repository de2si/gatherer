import React from 'react';
import {DimensionValue, Pressable, StyleSheet, View} from 'react-native';
import {MD3Theme, Text} from 'react-native-paper';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import CustomTopTabIcon from '@components/nav/CustomTopTabIcon';
import {commonStyles} from '@styles/common';

interface CustomTopBarProps extends MaterialTopTabBarProps {
  theme: MD3Theme;
  flavor?: 'icon' | 'label';
  rightSide?: boolean;
  maxWidth?: DimensionValue;
}

const TOP_BAR_ICON_HEIGHT = 50;
const TOP_BAR_LABEL_HEIGHT = 40;
const DEFAULT_PROPS = {
  flavor: 'label',
  rightSide: false,
  maxWidth: 'auto' as const,
};

const CustomTopBar = ({
  state,
  descriptors,
  navigation,
  theme,
  ...props
}: CustomTopBarProps) => {
  const {flavor, rightSide, maxWidth} = {...DEFAULT_PROPS, ...props};
  const containerStyles = [
    {maxHeight: flavor === 'icon' ? TOP_BAR_ICON_HEIGHT : TOP_BAR_LABEL_HEIGHT},
    rightSide ? styles.sideTabContainer : null,
  ];
  const tabButtonStyles = [
    flavor === 'label' ? commonStyles.centeredContainer : null,
    {maxWidth},
  ];

  return (
    <View
      style={[
        styles.tabContainer,
        {backgroundColor: theme.colors.background},
        containerStyles,
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

        const fgColor = isFocused
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
            style={[
              styles.tabButton,
              {backgroundColor: bgColor},
              tabButtonStyles,
            ]}>
            {flavor === 'icon' ? (
              <CustomTopTabIcon icon={options.tabBarIcon} color={fgColor} />
            ) : (
              <Text style={[{color: fgColor}]}>{label}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomTopBar;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  sideTabContainer: {
    justifyContent: 'flex-end',
  },
});

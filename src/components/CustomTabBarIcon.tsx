import React from 'react';
import {View, StyleSheet} from 'react-native';

interface CustomTabBarIconProps {
  icon?: React.JSX.ElementType;
  color: string; // Color of the icon
}

const CustomTabBarIcon = ({icon, color}: CustomTabBarIconProps) => {
  const Icon = icon;
  return Icon ? (
    <View style={styles.iconContainer}>
      <Icon color={color} style={styles.icon} />
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    minWidth: 84,
    minHeight: 48,
    padding: 10,
  },
  icon: {
    flex: 1,
    minWidth: 84,
    minHeight: 48,
    padding: 10,
  },
});

export default CustomTabBarIcon;

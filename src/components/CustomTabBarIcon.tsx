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
      <Icon color={color} />
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    padding: 10,
  },
});

export default CustomTabBarIcon;

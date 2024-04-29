import React from 'react';
import {View, StyleSheet} from 'react-native';

interface CustomTabBarIconProps {
  icon?: React.JSX.ElementType;
  color: string;
  bgColor: string;
}

const CustomTabBarIcon = ({icon, color, bgColor}: CustomTabBarIconProps) => {
  const Icon = icon;
  return Icon ? (
    <View style={[styles.iconContainer]}>
      <Icon color={color} style={[styles.icon]} color2={bgColor} />
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    width: 40,
    height: 40,
  },
  icon: {
    flex: 1,
  },
});

export default CustomTabBarIcon;

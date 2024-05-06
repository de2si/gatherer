import {commonStyles} from '@styles/common';
import React from 'react';
import {View} from 'react-native';

interface CustomBottomTabIconProps {
  icon?: React.JSX.ElementType;
  color: string;
  bgColor: string;
}

const CustomBottomTabIcon = ({
  icon,
  color,
  bgColor,
}: CustomBottomTabIconProps) => {
  const Icon = icon;
  return Icon ? (
    <View style={[commonStyles.hw40, commonStyles.flex1]}>
      <Icon color={color} style={[commonStyles.flex1]} color2={bgColor} />
    </View>
  ) : (
    <></>
  );
};

export default CustomBottomTabIcon;

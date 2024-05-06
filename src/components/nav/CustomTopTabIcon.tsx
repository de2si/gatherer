import {View} from 'react-native';
import React from 'react';
import {commonStyles, spacingStyles} from '@styles/common';

interface CustomtopTabIconProps {
  icon?: React.JSX.ElementType;
  color: string; // Color of the icon
}

const CustomtopTabIcon = ({icon, color}: CustomtopTabIconProps) => {
  const Icon = icon;
  return Icon ? (
    <View style={[commonStyles.flex1, spacingStyles.p8]}>
      <Icon color={color} />
    </View>
  ) : (
    <></>
  );
};

export default CustomtopTabIcon;

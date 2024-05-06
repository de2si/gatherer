import React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
const LocationIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 48 48"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <G data-name="Layer 2">
      <G fill="none" data-name="invisible box">
        <Path d="M0 0h48v48H0z" />
        <Path d="M0 0h48v48H0z" />
        <Path d="M0 0h48v48H0z" />
      </G>
      <G fill={color} data-name="icons Q2">
        <Path d="M24 6c7.4 0 13 6 13 14s-8.6 16.7-13 21.2C19.6 36.7 11 27.5 11 20S16.6 6 24 6m0-4C14.1 2 7 10.1 7 20s11.5 21.3 15.6 25.4a1.9 1.9 0 0 0 2.8 0C29.5 41.3 41 30.1 41 20S33.9 2 24 2Z" />
        <Path d="M30 19h-4v-4a2 2 0 0 0-4 0v4h-4a2 2 0 0 0 0 4h4v4a2 2 0 0 0 4 0v-4h4a2 2 0 0 0 0-4Z" />
      </G>
    </G>
  </Svg>
);
export {LocationIcon};

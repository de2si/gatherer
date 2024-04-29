import React from 'react';
import {ColorValue} from 'react-native';
import Svg, {SvgProps, Defs, ClipPath, Path, G, Circle} from 'react-native-svg';

interface AccountIconProps extends SvgProps {
  color2?: ColorValue;
}

const AccountIcon = ({
  color = 'black',
  color2 = 'white',
  width = '100%',
  height = '100%',
  ...props
}: AccountIconProps) => {
  if (color2 === 'transparent') {
    color2 = 'white';
  }

  return (
    <Svg
      {...props}
      viewBox="0 0 84 84"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}>
      <Defs>
        <ClipPath id="a">
          <Circle
            cx={30}
            cy={30}
            r={30}
            fill={color2}
            transform="translate(.5 -.062)"
          />
        </ClipPath>
      </Defs>
      <G fill={color} stroke="#707070">
        <Circle cx={42} cy={42} r={42} stroke="none" />
        <Circle cx={42} cy={42} r={41.5} fill="none" />
      </G>
      <G fill={color2} clipPath="url(#a)" transform="translate(10.5 17.063)">
        <Path d="M30.178 61.175q-12.019 0-24.037-.008a11.219 11.219 0 0 1-2.271-.194 2.792 2.792 0 0 1-2.4-3.051 19.918 19.918 0 0 1 .55-3.453 31.276 31.276 0 0 1 6.4-12.919 29.512 29.512 0 0 1 10.66-8.206 9.907 9.907 0 0 1 1.309-.535.937.937 0 0 1 .612.154 19.553 19.553 0 0 0 3.73 1.581 18.811 18.811 0 0 0 14.787-1.6.905.905 0 0 1 .884-.016 28.813 28.813 0 0 1 8.745 5.541 30.714 30.714 0 0 1 6.363 8.182 31.476 31.476 0 0 1 3.426 9.977 7.458 7.458 0 0 1 .021 2.113 2.879 2.879 0 0 1-2.734 2.326 15.141 15.141 0 0 1-1.809.11q-12.117.01-24.235 0M15.093 15.853a15.15 15.15 0 1 1 15.022 15.22 15.19 15.19 0 0 1-15.022-15.22" />
      </G>
    </Svg>
  );
};
export {AccountIcon};

import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const BackIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 10.621 21.228"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={color}
          d="M0 0h10.621v21.228H0z"
          data-name="Rectangle 178825"
        />
      </ClipPath>
    </Defs>
    <G clipPath="url(#a)" data-name="Back_Icon">
      <Path
        fill={color}
        d="M8.979 21.228a1.637 1.637 0 0 1-1.161-.481l-6.18-6.18a5.591 5.591 0 0 1 0-7.906L7.817.481A1.643 1.643 0 0 1 10.14 2.8L3.96 8.984a2.305 2.305 0 0 0 0 3.261l6.18 6.18a1.642 1.642 0 0 1-1.161 2.8"
        data-name="Path 150871"
      />
    </G>
  </Svg>
);
export {BackIcon};

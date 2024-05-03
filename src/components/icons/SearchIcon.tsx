import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const SearchIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 29.145 29.145"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path
          fill="none"
          d="M0 0h29.145v29.145H0z"
          data-name="Rectangle 178808"
        />
      </ClipPath>
    </Defs>
    <G data-name="Group 352465">
      <G
        fill={color}
        clipPath="url(#a)"
        data-name="Group 352464"
        transform="rotate(45 4.859 11.73)">
        <Path
          d="M13.742 6.871A6.871 6.871 0 1 1 6.871 0a6.871 6.871 0 0 1 6.871 6.871"
          data-name="Path 150853"
        />
        <Path
          d="M13.263 6.137h10.033v1.467H13.263z"
          data-name="Rectangle 178807"
        />
        <Path
          d="M23.803 8.029h-7.087V5.712h7.087a.705.705 0 0 1 .706.705v.906a.706.706 0 0 1-.706.706"
          data-name="Path 150854"
        />
      </G>
    </G>
  </Svg>
);
export {SearchIcon};

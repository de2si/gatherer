import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const CameraIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 77.184 61.803"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={color}
          d="M0 0h77.184v61.803H0z"
          data-name="Rectangle 178810"
        />
      </ClipPath>
    </Defs>
    <G fill={color} clipPath="url(#a)" data-name="Group 352466">
      <Path
        d="M38.587 61.8H8.137a7.826 7.826 0 0 1-8.065-6.73A6.006 6.006 0 0 1 0 54.022V19.269a7.78 7.78 0 0 1 7.624-7.662c2.964-.018 5.929 0 8.893-.007a3.545 3.545 0 0 0 3.657-2.644c.715-2.136 1.421-4.275 2.14-6.409A3.508 3.508 0 0 1 25.824 0h25.55a3.5 3.5 0 0 1 3.5 2.554q1.072 3.2 2.139 6.409a3.553 3.553 0 0 0 3.666 2.637h8.668a7.777 7.777 0 0 1 7.838 7.9q-.006 17.113 0 34.226a7.816 7.816 0 0 1-8.073 8.074q-15.263.009-30.525 0m-.015-7.736A19.288 19.288 0 1 0 19.3 34.8a19.3 19.3 0 0 0 19.277 19.27m28.204-29.357a2.731 2.731 0 0 0 2.69-2.69 2.769 2.769 0 0 0-2.687-2.711 2.7 2.7 0 1 0 0 5.4"
        data-name="Path 150855"
      />
      <Path
        d="M38.551 46.322a11.559 11.559 0 1 1 11.633-11.539 11.586 11.586 0 0 1-11.633 11.539"
        data-name="Path 150856"
      />
    </G>
  </Svg>
);
export {CameraIcon};

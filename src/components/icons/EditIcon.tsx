import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const EditIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 48.985 48.985"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M0 0h48.985v48.99H0z" />
      </ClipPath>
    </Defs>
    <G fill={color} clipPath="url(#a)">
      <Path d="M16.233 44.256a33.7 33.7 0 0 0-11.611-11.5c.937-.917 1.815-1.764 2.678-2.627Q18.518 18.912 29.722 7.683a.772.772 0 0 1 1.09-.18 24.281 24.281 0 0 1 10.677 10.719.67.67 0 0 1-.124.933Q28.983 31.517 16.624 43.901c-.1.095-.2.182-.39.355M33.455 3.945c1.3-1.292 2.52-2.512 3.758-3.712A.9.9 0 0 1 37.807 0a14.911 14.911 0 0 1 6.612 1.6c2.42 1.27 3.48 3.488 4.063 5.989a32.939 32.939 0 0 1 .5 3.425.864.864 0 0 1-.139.631c-1.226 1.268-2.478 2.51-3.772 3.809A33.562 33.562 0 0 0 33.455 3.945M0 48.966V38.137a2.992 2.992 0 0 1 1.33-1.97.761.761 0 0 1 .5.1 24.033 24.033 0 0 1 10.886 10.876.639.639 0 0 1-.114.82 2.666 2.666 0 0 1-2.402 1.025c-3.132-.066-6.266-.022-9.4-.022H0" />
    </G>
  </Svg>
);
export {EditIcon};

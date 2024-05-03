import React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const AddIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 20.175 20.175"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Path
      fill={color}
      d="M7.95 0v7.95H0v4.275h7.95v7.95h4.274v-7.95h7.95V7.95h-7.95V0Z"
      data-name="Path 150888"
    />
  </Svg>
);
export {AddIcon};

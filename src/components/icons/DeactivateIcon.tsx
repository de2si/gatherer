import * as React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const DeactivateIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 48.281 48.143"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={color}
          d="M0 0h48.281v48.143H0z"
          data-name="Rectangle 178893"
        />
      </ClipPath>
    </Defs>
    <G clipPath="url(#a)" data-name="Group 352626">
      <Path
        fill={color}
        d="M22 0h4.194l.6.149a50.766 50.766 0 0 1 5.485 1.287A24.072 24.072 0 0 1 18.543 47.51C6.534 44.762-1.792 32.576.331 20.464 2.076 10.506 7.968 3.974 17.627.925A44.189 44.189 0 0 1 22 0m18.923 20.639A17.037 17.037 0 0 0 23.907 6.893 17.238 17.238 0 0 0 7.4 20.639Zm.005 6.872H7.412c.738 5.534 6.37 13.37 16.111 13.742a17.32 17.32 0 0 0 17.405-13.742"
        data-name="Path 150886"
      />
    </G>
  </Svg>
);
export {DeactivateIcon};

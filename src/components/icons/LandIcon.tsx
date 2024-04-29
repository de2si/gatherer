import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const LandIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 86.607 62.644"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M0 0h86.607v62.644H0z" />
      </ClipPath>
    </Defs>
    <G fill={color} clipPath="url(#a)">
      <Path d="M32.129 27.811c1.852-.113 3.765-.2 5.725-.253a6.549 6.549 0 1 1 10.9 0 177.5 177.5 0 0 1 5.726.254 11.842 11.842 0 1 0-22.352 0M29.636 13.608a2.333 2.333 0 0 0 3.3-3.3l-3.269-3.26a2.333 2.333 0 1 0-3.3 3.3ZM21.725 26.322h4.616a2.331 2.331 0 1 0 0-4.661h-4.617a2.331 2.331 0 0 0 0 4.661M58 23.893a2.331 2.331 0 0 0 2.33 2.331h4.618a2.331 2.331 0 0 0 0-4.661H60.33A2.332 2.332 0 0 0 58 23.894M56.965 13.538l3.264-3.265a2.333 2.333 0 0 0-3.3-3.3l-3.26 3.27a2.333 2.333 0 1 0 3.3 3.3M43.286 9.279a2.332 2.332 0 0 0 2.331-2.331V2.331a2.33 2.33 0 1 0-4.661 0v4.617a2.332 2.332 0 0 0 2.33 2.331M75.91 62.645h10.7L61.623 37.192c7.409.383 14.05.992 19.508 1.768a1.713 1.713 0 0 0 .228-.823c0-4.172-17.039-7.555-38.056-7.555S5.247 33.965 5.247 38.138a1.714 1.714 0 0 0 .229.823c5.457-.776 12.1-1.385 19.508-1.768L0 62.645h10.7l18.965-25.66q1.74-.065 3.526-.112L18.977 62.645h10.7l7.992-25.867q1.7-.025 3.429-.034l-3.14 25.9h10.7l-3.14-25.9q1.728.01 3.429.034l7.991 25.867h10.7l-14.22-25.773q1.785.048 3.527.112Z" />
    </G>
  </Svg>
);
export {LandIcon};

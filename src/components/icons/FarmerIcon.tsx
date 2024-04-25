import * as React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const FarmerIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M0 0h67.484v65.172H0z" />
      </ClipPath>
    </Defs>
    <G fill={color} clipPath="url(#a)">
      <Path d="m38.398 0-.423.1a9.943 9.943 0 0 1 7.622 4.824 9.871 9.871 0 0 1 .88 8.976A10.259 10.259 0 1 1 35.887.126L35.497 0ZM41.965 52.068a6.641 6.641 0 0 0 2.944.884s.26-3.036-2.071-4.005-2.433-.827-2.433-.827-.027 3.062 1.56 3.948M44.815 48.375a3.818 3.818 0 0 0 .582-2.582c-.31-1.213-1.871-1.955-1.871-1.955a2.7 2.7 0 0 0 1.289 4.537M43.477 53.674c-2.331-.968-2.433-.828-2.433-.828s-.027 3.062 1.56 3.948a6.649 6.649 0 0 0 2.944.884s.261-3.037-2.071-4M62.788 53.315a6.64 6.64 0 0 0 2.978-.764c1.621-.82 1.719-3.881 1.719-3.881s-.1-.145-2.465.728-2.232 3.918-2.232 3.918M65.133 46.904a3.284 3.284 0 0 0-.594-2.639s-1.59.678-1.949 1.878a3.819 3.819 0 0 0 .477 2.6 3.261 3.261 0 0 0 2.067-1.842M64.189 54.094c-2.368.873-2.231 3.917-2.231 3.917a6.65 6.65 0 0 0 2.977-.764c1.621-.821 1.719-3.881 1.719-3.881s-.1-.144-2.465.728M50.853 40.471c-3.235-1.976-3.42-1.791-3.42-1.791s-.749 4.537 1.4 6.219a9.976 9.976 0 0 0 4.166 1.993s1.089-4.445-2.146-6.422M54.032 32.665s-2.495 1.707-2.548 4.32 2.6 4.425 2.6 4.425 2.273-2 2.32-4.325-2.374-4.42-2.374-4.42M50.708 47.632c-3.235-1.976-3.42-1.791-3.42-1.791s-.749 4.538 1.4 6.219a9.981 9.981 0 0 0 4.165 1.994s1.089-4.446-2.146-6.422M50.563 54.796c-3.235-1.976-3.42-1.791-3.42-1.791s-.749 4.538 1.4 6.219a9.982 9.982 0 0 0 4.165 1.994s1.089-4.446-2.146-6.422M57.185 40.602c-3.313 1.844-2.4 6.329-2.4 6.329a9.979 9.979 0 0 0 4.242-1.823c2.216-1.593 1.652-6.157 1.652-6.157s-.177-.192-3.49 1.651M57.04 47.762c-3.313 1.844-2.4 6.33-2.4 6.33a9.981 9.981 0 0 0 4.243-1.824c2.216-1.593 1.652-6.157 1.652-6.157s-.177-.192-3.49 1.651M56.895 54.923c-3.313 1.843-2.4 6.33-2.4 6.33a9.983 9.983 0 0 0 4.242-1.823c2.216-1.593 1.652-6.157 1.652-6.157s-.177-.193-3.49 1.651M7.707 52.883l-4.169-2.877A8.189 8.189 0 0 1 1.45 38.614l13.619-19.733a8.19 8.19 0 0 1 11.392-2.088l4.169 2.877a8.19 8.19 0 0 1 2.089 11.392L19.1 50.795a8.19 8.19 0 0 1-11.393 2.088" />
      <Path d="M7.899 51.028a5.333 5.333 0 0 1 3.345-6.759l21.1-7.127a5.333 5.333 0 0 1 3.414 10.1l-21.1 7.127a5.333 5.333 0 0 1-6.759-3.345" />
      <Path d="M17.095 64.017a5.333 5.333 0 0 1-.863-7.492l13.84-17.441a5.333 5.333 0 1 1 8.355 6.629l-13.84 17.441a5.333 5.333 0 0 1-7.492.863M29.293 22.618l.363-.3a2.783 2.783 0 0 1 3.916.4l11.493 14.1a2.783 2.783 0 0 1-.4 3.916l-.363.3a2.783 2.783 0 0 1-3.916-.4l-11.493-14.1a2.784 2.784 0 0 1 .4-3.916" />
    </G>
  </Svg>
);
export {FarmerIcon};

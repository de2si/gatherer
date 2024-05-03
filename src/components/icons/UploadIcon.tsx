import React from 'react';
import Svg, {SvgProps, Defs, ClipPath, Path, G} from 'react-native-svg';
const UploadIcon = ({
  color = 'black',
  width = '100%',
  height = '100%',
  ...props
}: SvgProps) => (
  <Svg
    {...props}
    viewBox="0 0 19.918 24.782"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={color}
          d="M0 0h19.918v24.782H0z"
          data-name="Rectangle 178803"
        />
      </ClipPath>
    </Defs>
    <G fill={color} clipPath="url(#a)" data-name="Group 352445">
      <Path
        d="M10.257 0a2.858 2.858 0 0 1 1.325.882q2.316 2.337 4.65 4.656a1.765 1.765 0 0 1 .51 1.914 1.716 1.716 0 0 1-2.706.783c-.734-.652-1.406-1.374-2.107-2.065-.06-.06-.124-.116-.222-.207v9.785a1.74 1.74 0 0 1-3.474.205c-.008-.112-.006-.226-.006-.339V5.969c-.085.076-.143.124-.2.177-.633.632-1.262 1.269-1.9 1.9a1.741 1.741 0 0 1-2.692-2.2 4.049 4.049 0 0 1 .306-.342q2.187-2.192 4.376-4.382A3.664 3.664 0 0 1 9.628 0Z"
        data-name="Path 150846"
      />
      <Path
        d="M0 20.329a1.948 1.948 0 0 1 .709-1.166 1.682 1.682 0 0 1 1.736-.2 1.64 1.64 0 0 1 1.031 1.435c.058.661.3.9.966.9h11.077c.629 0 .9-.252.932-.88a1.733 1.733 0 0 1 3.43-.19 3.722 3.722 0 0 1-.735 2.755 4.093 4.093 0 0 1-3.485 1.8q-5.683.008-11.367 0a4.211 4.211 0 0 1-4.248-3.688.752.752 0 0 0-.046-.137v-.629"
        data-name="Path 150847"
      />
    </G>
  </Svg>
);
export {UploadIcon};

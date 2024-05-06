import React from 'react';
import {MD3Theme} from 'react-native-paper';
import Svg, {Circle, Polygon, Text as SvgText} from 'react-native-svg';

import {Coordinate} from '@typedefs/common';
import {ALPHABETS} from '@helpers/constants';
import {borderStyles, commonStyles} from '@styles/common';

interface CoordinatesDrawerProps {
  coordinates: Coordinate[];
  theme: MD3Theme;
  width?: number;
  height?: number;
}

const CoordinatesDrawer = ({
  coordinates,
  width = 130,
  height = 130,
  theme,
}: CoordinatesDrawerProps) => {
  const svgPadding = 10;
  const svgWidth = width;
  const svgHeight = height;

  // Find the min and max latitude and longitude from the coordinates
  const minLatitude = Math.min(...coordinates.map(coord => coord.latitude));
  const maxLatitude = Math.max(...coordinates.map(coord => coord.latitude));
  const minLongitude = Math.min(...coordinates.map(coord => coord.longitude));
  const maxLongitude = Math.max(...coordinates.map(coord => coord.longitude));

  // Calculate the padding-adjusted range for latitude and longitude
  const latitudeRange = maxLatitude - minLatitude;
  const longitudeRange = maxLongitude - minLongitude;

  // Calculate the mapping functions
  const mapLatitudeToY = (latitude: number) =>
    latitudeRange === 0
      ? svgHeight / 2
      : ((maxLatitude - latitude) / latitudeRange) * svgHeight + svgPadding;

  const mapLongitudeToX = (longitude: number) =>
    longitudeRange === 0
      ? svgWidth / 2
      : ((longitude - minLongitude) / longitudeRange) * svgWidth + svgPadding;

  // Convert coordinates to a string for the Polygon element
  const polygonPoints = coordinates
    .map(
      coord =>
        `${mapLongitudeToX(coord.longitude)},${mapLatitudeToY(coord.latitude)}`,
    )
    .join(' ');

  return (
    <Svg
      height={svgHeight + 2 * svgPadding}
      width={svgWidth + 2 * svgPadding}
      style={[
        commonStyles.flex1,
        borderStyles.border1,
        borderStyles.radius8,
        {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.outline,
        },
      ]}>
      {/* Draw the polygon */}
      <Polygon
        points={polygonPoints}
        fill={theme.colors.elevation.level4}
        stroke={theme.colors.onPrimary}
        strokeWidth="2"
      />

      {/* Draw circles and text at each coordinate */}
      {coordinates.map((coord, index) => (
        <React.Fragment key={index}>
          <Circle
            cx={mapLongitudeToX(coord.longitude)}
            cy={mapLatitudeToY(coord.latitude)}
            r="4"
            fill={theme.colors.primary}
            stroke={theme.colors.onPrimary}
            strokeWidth={3}
          />
          <SvgText
            x={mapLongitudeToX(coord.longitude) + 8} // adjust text position
            y={mapLatitudeToY(coord.latitude) + 4} // adjust text position
            fill={theme.colors.onPrimary} // set text color
            fontSize="10">
            {ALPHABETS[index]}
          </SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
};

export default CoordinatesDrawer;

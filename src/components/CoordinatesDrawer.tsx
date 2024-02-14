// CoordinatesDrawer.tsx

import React from 'react';
import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';
import Svg, {Circle, Polygon} from 'react-native-svg';
import {Coordinate} from '@typedefs/common';

const CoordinatesDrawer = ({
  coordinates,
  theme,
}: {
  coordinates: Coordinate[];
  theme: MD3Theme;
}) => {
  const svgPadding = 10;
  const svgWidth = 130;
  const svgHeight = 130;

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
        styles.svg,
        {
          backgroundColor: theme.colors.tertiaryContainer,
          borderRadius: theme.roundness,
          borderColor: theme.colors.outline,
        },
      ]}>
      {/* Draw the polygon */}
      <Polygon
        points={polygonPoints}
        fill={theme.colors.secondaryContainer}
        stroke={theme.colors.secondary}
        strokeWidth="2"
      />

      {/* Draw circles at each coordinate */}
      {coordinates.map((coord, index) => (
        <Circle
          key={index}
          cx={mapLongitudeToX(coord.longitude)}
          cy={mapLatitudeToY(coord.latitude)}
          r="4"
          fill={theme.colors.tertiaryContainer}
          stroke={theme.colors.tertiary}
          strokeWidth={3}
        />
      ))}
    </Svg>
  );
};

export default CoordinatesDrawer;

const styles = StyleSheet.create({
  svg: {
    flex: 1,
    borderWidth: 1,
    position: 'relative',
  },
});

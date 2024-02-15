// FormCoordinatesInput.tsx

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Chip, HelperText, Text, useTheme} from 'react-native-paper';
import {Control, FieldValues, useController} from 'react-hook-form';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import CoordinatesDrawer from '@components/CoordinatesDrawer';
import {Coordinate} from '@typedefs/common';

interface FormCoordinatesInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormCoordinatesInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Geo-trace',
  onLayout = () => {},
}: FormCoordinatesInputProps<TFieldValues>) => {
  const theme = useTheme();
  const {
    field: {value, onChange},
    fieldState: {error},
  } = useController({
    name,
    control,
  });
  const [coordinates, setCoordinates] = useState<Coordinate[]>(
    value ? JSON.parse(value) : [],
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        locationProvider: 'playServices',
      });
    } catch (err) {
      setLocationError(err as string);
    }
  }, []);

  const addCurrentLocation = useCallback(() => {
    setLocationError(null);
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const {latitude, longitude} = position.coords;
        setCoordinates(coords => [...coords, {latitude, longitude}]);
        onChange(JSON.stringify(coordinates));
        setLoading(false);
      },
      (geoError: GeolocationError) => {
        setLocationError(geoError.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
      },
    );
  }, [coordinates, onChange]);

  const deleteCoordinate = useCallback(
    (index: number) => {
      setCoordinates(coords => {
        const newCoords = [...coords];
        newCoords.splice(index, 1);
        return newCoords;
      });
      onChange(JSON.stringify(coordinates));
    },
    [coordinates, onChange],
  );

  const renderedChips = useMemo(() => {
    return coordinates.map((coord, index) => (
      <Chip
        key={index}
        onClose={() => {
          deleteCoordinate(index);
        }}>
        <Text>
          {coord.latitude.toFixed(6)},{coord.longitude.toFixed(6)}
        </Text>
      </Chip>
    ));
  }, [coordinates, deleteCoordinate]);
  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <View style={[styles.container, styles.rowContainer]}>
        <Text style={[styles.label, theme.fonts.labelLarge]}>{label}</Text>
        <Button
          icon="map-marker-radius-outline"
          mode="contained-tonal"
          buttonColor={
            error ? theme.colors.errorContainer : theme.colors.tertiaryContainer
          }
          textColor={theme.colors.primary}
          onPress={addCurrentLocation}
          loading={loading}
          disabled={loading}
          style={styles.addBtn}>
          Add location
        </Button>
      </View>
      {coordinates.length > 0 && (
        <View
          style={[
            styles.container,
            styles.rowContainer,
            styles.outputContainer,
          ]}>
          <CoordinatesDrawer coordinates={coordinates} theme={theme} />
          <ScrollView contentContainerStyle={styles.chipContainer}>
            {renderedChips}
          </ScrollView>
        </View>
      )}

      <HelperText type="error" visible={locationError || error ? true : false}>
        {locationError || error?.message || 'Error'}
      </HelperText>
    </View>
  );
};

export default FormCoordinatesInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    minWidth: 70,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  outputContainer: {
    height: 150,
    marginVertical: 8,
  },
  addBtn: {
    marginLeft: 12,
  },
  chipContainer: {
    flex: 1,
    alignItems: 'flex-start',
    rowGap: 4,
    flexGrow: 1,
  },
});

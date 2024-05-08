// FormCoordinatesInput.tsx

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Button, Chip, HelperText, Text, useTheme} from 'react-native-paper';
import {Control, FieldValues, useController} from 'react-hook-form';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
// import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import CoordinatesDrawer from '@components/CoordinatesDrawer';
import {LocationIcon} from '@components/icons/LocationIcon';
import {Coordinate} from '@typedefs/common';
import {
  borderStyles,
  commonStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';
import {ALPHABETS} from '@helpers/constants';

interface FormCoordinatesInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

// function checkPermission() {
//   check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
//     .then(result => {
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//           return 'This feature is not available (on this device / in this context)';
//         case RESULTS.DENIED:
//           return 'The permission has not been requested / is denied but requestable';
//         case RESULTS.LIMITED:
//           return 'The permission is limited: some actions are possible';
//         case RESULTS.GRANTED:
//           return 'The permission is granted';
//         case RESULTS.BLOCKED:
//           return 'The permission is denied and not requestable anymore';
//       }
//     })
//     .catch(() => {
//       return "The permission can't be checked";
//     });
// }

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

  const addCurrentLocation = () => {
    setLocationError(null);
    setLoading(true);
    try {
      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          const {latitude, longitude} = position.coords;
          setCoordinates(coords => [...coords, {latitude, longitude}]);
          setLoading(false);
        },
        (geoError: GeolocationError) => {
          setLocationError(geoError.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          // timeout: 15000,
          maximumAge: 1000,
        },
      );
    } catch (err) {
      setLoading(false);
      setLocationError('Unable to retrieve location');
    }
  };

  useEffect(() => {
    onChange(JSON.stringify(coordinates));
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
    return coordinates.map((_coord, index) => (
      <Chip
        key={index}
        onClose={() => {
          deleteCoordinate(index);
        }}
        style={[
          spacingStyles.m4,
          {backgroundColor: theme.colors.primaryContainer},
        ]}
        textStyle={{color: theme.colors.onPrimaryContainer}}>
        <Text>
          {ALPHABETS[index]}
          {/* {coord.latitude.toFixed(6)},{coord.longitude.toFixed(6)} */}
        </Text>
      </Chip>
    ));
  }, [
    coordinates,
    deleteCoordinate,
    theme.colors.onPrimaryContainer,
    theme.colors.primaryContainer,
  ]);

  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <View style={[commonStyles.row]}>
        <Text
          style={[
            theme.fonts.bodyLarge,
            {color: theme.colors.outline},
            tableStyles.w120,
            spacingStyles.mr16,
          ]}>
          {label}
        </Text>
        <Button
          icon={props => LocationIcon({height: 20, width: 20, ...props})}
          onPress={addCurrentLocation}
          loading={loading}
          disabled={loading}
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          style={[
            borderStyles.radius8,
            error ? borderStyles.border2 : borderStyles.border1,
            {borderColor: error ? theme.colors.error : theme.colors.tertiary},
            commonStyles.flex1,
          ]}
          contentStyle={tableStyles.flexStart}>
          Add location
        </Button>
      </View>
      {coordinates.length > 0 && (
        <View style={spacingStyles.mt8}>
          <CoordinatesDrawer
            coordinates={coordinates}
            theme={theme}
            width={300}
            height={150}
          />
          <View style={[commonStyles.rowWrap, spacingStyles.mt8]}>
            {renderedChips}
          </View>
        </View>
      )}
      <HelperText type="error" visible={locationError || error ? true : false}>
        {locationError || error?.message || 'Error'}
      </HelperText>
    </View>
  );
};

export default FormCoordinatesInput;

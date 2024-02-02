// FormImageInput.tsx

import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  Button,
  HelperText,
  Icon,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useReducedMotion} from 'react-native-reanimated';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {Control, FieldValues, useController} from 'react-hook-form';
import {calculateHash} from '@helpers/cryptoHelpers';
import useSnackbar from '@hooks/useSnackbar';

interface FormImageInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name']; // form field name
  control: Control<TFieldValues>; // form control
  label?: string;
  variant?: 'round' | 'square';
  border?: 'none' | 'dashed';
  placeholderViewStyles?: StyleProp<ViewStyle>;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormImageInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Photo',
  variant = 'round',
  border = 'none',
  placeholderViewStyles = {},
  onLayout = () => {},
}: FormImageInputProps<TFieldValues>) => {
  const reducedMotion = useReducedMotion();
  const theme = useTheme();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');

  const {
    field: {value, onChange},
    fieldState: {error},
  } = useController({
    name,
    control,
  });

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const handleImageContainerPress = () => {
    setBottomSheetVisible(true);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
  };

  const handleCameraPress = () => {
    handleImagePickerAction('camera');
  };

  const handleGalleryPress = () => {
    handleImagePickerAction('gallery');
  };

  const handleClearPress = () => {
    onChange(null);

    setBottomSheetVisible(false);
    // showSnackbar('Image cleared');
  };

  const handleImagePickerAction = async (source: 'camera' | 'gallery') => {
    // TODO: compress image, check more options
    const options = {
      mediaType: 'photo' as const,
      quality: 0.5 as const,
      includeBase64: true,
    };
    let result: ImagePickerResponse;
    if (source === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }
    handleImagePickerResponse(result);
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      showSnackbar('Image selection canceled');
    } else if (response.errorCode) {
      switch (response.errorCode) {
        case 'camera_unavailable':
          showSnackbar('Camera not available on device');
          break;
        case 'permission':
          showSnackbar('Permission not satisfied');
          break;
        default:
          showSnackbar(
            response.errorMessage
              ? response.errorMessage
              : 'Unknown error occurred',
          );
          break;
      }
    } else if (response.assets) {
      const {uri, base64} = response.assets[0];
      onChange(
        uri ? {uri: uri, hash: calculateHash(base64 ?? null, 256)} : null,
      );
      setBottomSheetVisible(false);
      // showSnackbar('Image selected');
    }
  };

  const imageBorderRadiusStyle =
    variant === 'square' ? {borderRadius: theme.roundness} : styles.roundBorder;
  const imageBoundaryStyle =
    variant === 'square'
      ? {...styles.imageBoundarySquare, borderRadius: theme.roundness}
      : styles.imageBoundaryRound;
  const placeholderBorderStyle =
    border === 'dashed' ? styles.dashedBorder : null;
  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <Pressable
        onPress={handleImageContainerPress}
        style={styles.centeredContainer}>
        {value && value.uri ? (
          <View
            style={[
              styles.thinBorder,
              imageBorderRadiusStyle,
              {borderColor: theme.colors.outline},
            ]}>
            <Image source={{uri: value.uri}} style={imageBoundaryStyle} />
          </View>
        ) : (
          <View
            style={[
              imageBoundaryStyle,
              placeholderBorderStyle,
              styles.imagePlaceholderContent,
              {
                backgroundColor: error
                  ? theme.colors.errorContainer
                  : theme.colors.tertiaryContainer,
              },
              placeholderViewStyles,
            ]}>
            <Icon source="tray-arrow-up" size={24} />
            <Text style={theme.fonts.labelMedium}>{label}</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.centeredContainer}>
        <HelperText type="error" visible={error ? true : false}>
          {error?.message ?? 'Image error'}
        </HelperText>
      </View>

      {bottomSheetVisible && (
        <Portal>
          <BottomSheet
            snapPoints={[150]}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={handleBottomSheetClose}
            animateOnMount={!reducedMotion}>
            <View style={styles.bottomSheetRow}>
              <Button
                buttonColor={theme.colors.primaryContainer}
                icon="camera-outline"
                mode="contained-tonal"
                onPress={handleCameraPress}
                style={styles.bottomSheetButton}>
                Camera
              </Button>
              <Button
                buttonColor={theme.colors.secondaryContainer}
                icon="image-outline"
                mode="contained-tonal"
                onPress={handleGalleryPress}
                style={styles.bottomSheetButton}>
                Gallery
              </Button>
              <Button
                buttonColor={theme.colors.tertiaryContainer}
                disabled={!value}
                icon="backspace-outline"
                mode="contained-tonal"
                onPress={handleClearPress}
                style={styles.bottomSheetButton}>
                Clear
              </Button>
            </View>
          </BottomSheet>
        </Portal>
      )}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBoundaryRound: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageBoundarySquare: {
    width: 120,
    height: 120,
  },
  dashedBorder: {
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  thinBorder: {
    borderWidth: 1,
  },
  roundBorder: {
    borderRadius: 50,
  },
  imagePlaceholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4,
  },
  bottomSheetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
  },
  bottomSheetButton: {
    minWidth: 100,
  },
});

export default FormImageInput;

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
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {Control, FieldValues, useController} from 'react-hook-form';

interface FormImageInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name']; // form field name
  control: Control<TFieldValues>; // form control
  label?: string;
  variant?: 'round' | 'square';
  border?: 'none' | 'dashed';
  placeholderViewStyles?: StyleProp<ViewStyle>;
}

const FormImageInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Photo',
  variant = 'round',
  border = 'none',
  placeholderViewStyles = {},
}: FormImageInputProps<TFieldValues>) => {
  const theme = useTheme();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    field: {value, onChange},
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
    // setSnackbarVisible(true);
    // setSnackbarMessage('Image cleared');
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
      setSnackbarVisible(true);
      setSnackbarMessage('Image selection canceled');
    } else if (response.errorCode) {
      switch (response.errorCode) {
        case 'camera_unavailable':
          setSnackbarMessage('Camera not available on device');
          break;
        case 'permission':
          setSnackbarMessage('Permission not satisfied');
          break;
        default:
          setSnackbarMessage(
            response.errorMessage
              ? response.errorMessage
              : 'Unknown error occurred',
          );
          break;
      }
      setSnackbarVisible(true);
    } else if (response.assets) {
      const {uri, base64} = response.assets[0];
      onChange(uri ? {uri: uri, base64: base64 ?? null} : null);
      setBottomSheetVisible(false);
      // setSnackbarVisible(true);
      // setSnackbarMessage('Image selected');
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  const imageBoundaryStyle =
    variant === 'square'
      ? styles.imageBoundarySquare
      : styles.imageBoundaryRound;
  const placeholderBorderStyle =
    border === 'dashed' ? styles.dashedBorder : null;
  return (
    <View>
      <Pressable onPress={handleImageContainerPress}>
        {value && value.uri ? (
          <Image source={{uri: value.uri}} style={imageBoundaryStyle} />
        ) : (
          <View
            style={[
              imageBoundaryStyle,
              placeholderBorderStyle,
              styles.imagePlaceholderContent,
              {backgroundColor: theme.colors.tertiaryContainer},
              placeholderViewStyles,
            ]}>
            <Icon source="tray-arrow-up" size={24} />
            <Text style={theme.fonts.labelMedium}>{label}</Text>
          </View>
        )}
      </Pressable>

      {bottomSheetVisible && (
        <Portal>
          <BottomSheet
            snapPoints={[150]}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={handleBottomSheetClose}>
            <BottomSheetView style={styles.bottomSheetRow}>
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
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      )}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBoundaryRound: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageBoundarySquare: {
    width: 120,
    height: 120,
    borderRadius: 4,
  },
  dashedBorder: {
    borderStyle: 'dashed',
    borderWidth: 1,
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

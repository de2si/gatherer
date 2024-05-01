// FormImageInput.tsx

import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  Button,
  HelperText,
  Portal,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import {useReducedMotion} from 'react-native-reanimated';

import {Control, FieldValues, useController} from 'react-hook-form';
import {calculateHash} from '@helpers/cryptoHelpers';
import useSnackbar from '@hooks/useSnackbar';

import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import RoundSingleView from '@components/FormImageInput/RoundSingleView';
import SquarePlaceholder from '@components/FormImageInput/SquarePlaceholder';
import ValueView from '@components/FormImageInput/ValueView';

interface FormImageInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name']; // form field name
  control: Control<TFieldValues>; // form control
  label?: string;
  variant?: 'single' | 'multiple';
  styleVariant?: 'round' | 'square';
  maxSelect?: number;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormImageInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Photo',
  variant = 'single',
  styleVariant = 'round',
  maxSelect = 3,
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
      selectionLimit: variant === 'single' ? 1 : maxSelect,
    };
    let result: ImagePickerResponse;
    if (source === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }
    handleImagePickerResponse(result);
  };

  const handleImagePickerError = (response: ImagePickerResponse) => {
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
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      showSnackbar('Image selection canceled');
    } else if (response.errorCode) {
      handleImagePickerError(response);
    } else if (response.assets) {
      if (variant === 'single') {
        const {uri, base64, type, fileName} = response.assets[0];
        onChange(
          uri
            ? {
                uri: uri,
                hash: calculateHash(base64 ?? null, 256),
                type,
                name: fileName,
              }
            : null,
        );
      } else {
        response.assets.length
          ? onChange(
              response.assets.map(imgItem => ({
                uri: imgItem.uri,
                hash: calculateHash(imgItem.base64 ?? null, 256),
                type: imgItem.type,
                name: imgItem.fileName,
              })),
            )
          : onChange(null);
      }
      setBottomSheetVisible(false);
      // showSnackbar('Image selected');
    }
  };

  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <Pressable onPress={handleImageContainerPress}>
        {value && (value.uri || (Array.isArray(value) && value.length > 0)) ? (
          <ValueView value={value} styleVariant={styleVariant} />
        ) : styleVariant === 'square' ? (
          <SquarePlaceholder label={label} />
        ) : (
          <RoundSingleView />
        )}
      </Pressable>
      <View>
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
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onSecondary}
                icon="camera-outline"
                mode="contained-tonal"
                onPress={handleCameraPress}
                style={styles.bottomSheetButton}>
                Camera
              </Button>
              <Button
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onSecondary}
                icon="image-outline"
                mode="contained-tonal"
                onPress={handleGalleryPress}
                style={styles.bottomSheetButton}>
                Gallery
              </Button>
              <Button
                buttonColor={theme.colors.tertiary}
                textColor={theme.colors.onTertiary}
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

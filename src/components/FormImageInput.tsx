// FormImageInput.tsx

import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
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
import {FormImage} from '@typedefs/common';

interface FormImageInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name']; // form field name
  control: Control<TFieldValues>; // form control
  label?: string;
  variant?: 'single' | 'multiple';
  styleVariant?: 'round' | 'square';
  maxSelect?: number;
  border?: 'none' | 'dashed';
  placeholderViewStyles?: StyleProp<ViewStyle>;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormImageInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Photo',
  variant = 'single',
  styleVariant = 'round',
  maxSelect = 3,
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
        const {uri, base64} = response.assets[0];
        onChange(
          uri ? {uri: uri, hash: calculateHash(base64 ?? null, 256)} : null,
        );
      } else {
        response.assets.length
          ? onChange(
              response.assets.map(imgItem => ({
                uri: imgItem.uri,
                hash: calculateHash(imgItem.base64 ?? null, 256),
              })),
            )
          : onChange(null);
      }
      setBottomSheetVisible(false);
      // showSnackbar('Image selected');
    }
  };

  const imageBorderRadiusStyle =
    styleVariant === 'square'
      ? {borderRadius: theme.roundness}
      : styles.roundBorder;
  const imageBoundaryStyle =
    styleVariant === 'square'
      ? {...styles.imageBoundarySquare, borderRadius: theme.roundness}
      : styles.imageBoundaryRound;
  const placeholderBorderStyle =
    border === 'dashed' ? styles.dashedBorder : null;

  const renderImages = () => {
    return Array.isArray(value) ? (
      // Render multiple images if value is an array
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.multiImageScrollView}>
        {value.map((image: FormImage, index: number) => (
          <View
            key={index}
            style={[
              styles.thinBorder,
              imageBorderRadiusStyle,
              {borderColor: theme.colors.outline},
            ]}>
            <Image
              source={{uri: image.uri}}
              style={[
                imageBoundaryStyle,
                {backgroundColor: theme.colors.primary},
              ]}
            />
          </View>
        ))}
      </ScrollView>
    ) : (
      // Render a single image if value is not an array
      <View
        style={[
          styles.thinBorder,
          imageBorderRadiusStyle,
          {borderColor: theme.colors.outline},
        ]}>
        <Image
          source={{uri: (value as FormImage).uri}}
          style={[imageBoundaryStyle, {backgroundColor: theme.colors.primary}]}
        />
      </View>
    );
  };

  const renderImagePlaceholder = () => (
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
  );

  return (
    <View
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      <Pressable
        onPress={handleImageContainerPress}
        style={styles.centeredContainer}>
        {value && (value.uri || (Array.isArray(value) && value.length > 0))
          ? renderImages()
          : renderImagePlaceholder()}
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
  multiImageScrollView: {
    columnGap: 8,
  },
});

export default FormImageInput;

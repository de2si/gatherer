// ImageInput.tsx

import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
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

const ImageInput = () => {
  const theme = useTheme();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    setSelectedImage(null);
    setBottomSheetVisible(false);
    // setSnackbarVisible(true);
    // setSnackbarMessage('Image cleared');
  };

  const handleImagePickerAction = async (source: 'camera' | 'gallery') => {
    // TODO: compress image, check more options
    const options = {
      mediaType: 'photo' as const,
      quality: 0.5 as const,
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
      const {uri} = response.assets[0];
      setSelectedImage(uri ? uri : null);
      setBottomSheetVisible(false);
      // setSnackbarVisible(true);
      // setSnackbarMessage('Image selected');
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  return (
    <View>
      <Pressable onPress={handleImageContainerPress}>
        {selectedImage ? (
          <Image source={{uri: selectedImage}} style={styles.imageBoundary} />
        ) : (
          <View
            style={[
              styles.imageBoundary,
              styles.imagePlaceholderContent,
              {backgroundColor: theme.colors.tertiaryContainer},
            ]}>
            <Icon source="upload" size={24} />
            <Text style={theme.fonts.labelMedium}>Photo</Text>
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
                disabled={!selectedImage}
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
  imageBoundary: {
    width: 100,
    height: 100,
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

export default ImageInput;

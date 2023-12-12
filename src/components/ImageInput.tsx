import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Button, Icon, Text, useTheme, Snackbar} from 'react-native-paper';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import BottomSheet from '@gorhom/bottom-sheet';

const ImageInput = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageContainerPress = () => {
    setBottomSheetVisible(true);
  };

  const handleOutsidePress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
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
    setSnackbarVisible(true);
    setSnackbarMessage('Image cleared');
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
      setSnackbarMessage('Error picking image');
    } else if (response.assets) {
      const {uri} = response.assets[0];
      setSelectedImage(uri ? uri : null);
      setBottomSheetVisible(false);
      setSnackbarVisible(true);
      setSnackbarMessage('Image selected');
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.imageInputContainer]}
          onPress={handleImageContainerPress}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.selectedImage} />
          ) : (
            <View
              style={[
                styles.imagePlaceholderContent,
                {backgroundColor: theme.colors.secondaryContainer},
              ]}>
              <Icon source="upload" size={24} />
              <Text style={[styles.imagePlaceholderText]}>Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {bottomSheetVisible && (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['20%']}
            handleComponent={null}
            onClose={handleBottomSheetClose}>
            <View style={styles.bottomSheetRow}>
              <Button
                icon="camera-outline"
                buttonColor={theme.colors.primaryContainer}
                textColor={theme.colors.onPrimaryContainer}
                onPress={handleCameraPress}
                style={styles.bottomSheetButton}>
                Camera
              </Button>
              <Button
                icon="image-outline"
                buttonColor={theme.colors.secondaryContainer}
                textColor={theme.colors.onSecondaryContainer}
                onPress={handleGalleryPress}
                style={styles.bottomSheetButton}>
                Gallery
              </Button>
              <Button
                icon="backspace-outline"
                mode="contained-tonal"
                buttonColor={theme.colors.tertiaryContainer}
                textColor={theme.colors.onTertiaryContainer}
                onPress={handleClearPress}
                disabled={!selectedImage}
                style={styles.bottomSheetButton}>
                Clear
              </Button>
            </View>
          </BottomSheet>
        )}

        <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageInputContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholderContent: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    margin: 4,
  },
  bottomSheetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetButton: {
    margin: 4,
    minWidth: 120,
  },
});

export default ImageInput;

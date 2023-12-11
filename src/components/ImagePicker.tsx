import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Icon, Text, useTheme} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';

const ImagePicker = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleImagePlaceholderPress = () => {
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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.imagePlaceholder]}
          onPress={handleImagePlaceholderPress}>
          <View
            style={[
              styles.imagePlaceholderContent,
              {backgroundColor: theme.colors.secondaryContainer},
            ]}>
            <Icon source="upload" size={24} />
            <Text style={[styles.imagePlaceholderText]}>Photo</Text>
          </View>
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
                onPress={() => console.log('Pressed Camera')}
                style={styles.bottomSheetButton}>
                Camera
              </Button>
              <Button
                icon="image-outline"
                buttonColor={theme.colors.secondaryContainer}
                textColor={theme.colors.onSecondaryContainer}
                onPress={() => console.log('Pressed Gallery')}
                style={styles.bottomSheetButton}>
                Gallery
              </Button>
              <Button
                icon="backspace-outline"
                buttonColor={theme.colors.tertiaryContainer}
                textColor={theme.colors.onTertiaryContainer}
                onPress={() => console.log('Pressed Clear')}
                style={styles.bottomSheetButton}>
                Clear
              </Button>
            </View>
          </BottomSheet>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePlaceholder: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
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

export default ImagePicker;

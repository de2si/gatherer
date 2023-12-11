import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Button, Icon, Text, useTheme} from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';

const HomeScreen = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.placeholderBodyBox]}>
        <View
          style={[
            styles.placeholderBox,
            {backgroundColor: theme.colors.secondaryContainer},
          ]}>
          <Icon source="upload" size={24} />
          <Text
            style={[
              styles.placeholderText,
              {color: theme.colors.inverseSurface},
            ]}>
            Photo
          </Text>
        </View>
      </TouchableOpacity>
      <BottomSheet snapPoints={['15%']} handleComponent={null}>
        <View style={styles.bottomSheetRow}>
          <Button
            icon="camera-outline"
            buttonColor={theme.colors.primaryContainer}
            textColor={theme.colors.onPrimaryContainer}
            mode="contained"
            onPress={() => console.log('Pressed')}
            style={styles.bottomSheetButton}>
            Camera
          </Button>
          <Button
            icon="image-outline"
            buttonColor={theme.colors.secondaryContainer}
            textColor={theme.colors.onSecondaryContainer}
            style={styles.bottomSheetButton}>
            Gallery
          </Button>
          <Button
            icon="backspace-outline"
            buttonColor={theme.colors.tertiaryContainer}
            textColor={theme.colors.onTertiaryContainer}
            style={styles.bottomSheetButton}>
            Clear
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBodyBox: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  placeholderText: {
    margin: 4,
  },
  bottomSheetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  bottomSheetButton: {
    margin: 4,
    minWidth: 120,
  },
});

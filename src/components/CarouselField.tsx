import {Pressable, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {IconButton, MD3Theme} from 'react-native-paper';
import ImageWrapper from '@components/ImageWrapper';
import {ApiImage} from '@typedefs/common';
import {borderStyles, commonStyles} from '@styles/common';

const CarouselField = ({
  value,
  theme,
}: {
  value: ApiImage[];
  theme: MD3Theme;
}) => {
  const [picIndex, setPicIndex] = useState(0);
  const goToNext = () => {
    setPicIndex(picIndex === value.length - 1 ? 0 : picIndex + 1);
  };

  const goToPrev = () => {
    setPicIndex(picIndex === 0 ? value.length - 1 : picIndex - 1);
  };
  return (
    <View style={commonStyles.row}>
      <View
        style={[
          commonStyles.centeredContainer,
          borderStyles.borderMinimal,
          borderStyles.radius8,
          {borderColor: theme.colors.outline},
        ]}>
        <ImageWrapper
          flavor="regular"
          value={value[picIndex]}
          style={styles.imgThumbnail}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.prevButton} onPress={goToPrev}>
          <IconButton icon="chevron-left" size={30} iconColor="white" />
        </Pressable>
        <Pressable style={styles.nextButton} onPress={goToNext}>
          <IconButton icon="chevron-right" size={30} iconColor="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default CarouselField;

const styles = StyleSheet.create({
  buttonsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    position: 'absolute',
    left: 10,
  },
  nextButton: {
    position: 'absolute',
    right: 10,
  },
  imgThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

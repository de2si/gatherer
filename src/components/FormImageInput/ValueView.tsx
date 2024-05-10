import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import RoundSingleView from '@components/FormImageInput/RoundSingleView';
import SingleImage from '@components/FormImageInput/SingleImage';

import {FormFile} from '@typedefs/common';

interface ValueImageProps {
  styleVariant?: 'round' | 'square';
  value: null | FormFile | FormFile[];
}

const ValueImage = ({styleVariant = 'round', value}: ValueImageProps) => {
  return Array.isArray(value) ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={styles.multiImageScrollView}>
      {value.map((image: FormFile, index: number) => (
        <SingleImage
          key={index}
          showEditIcon={true}
          styleVariant={styleVariant}
          uri={image.uri}
        />
      ))}
    </ScrollView>
  ) : styleVariant === 'square' ? (
    <SingleImage
      styleVariant={styleVariant}
      uri={value?.uri ?? ''}
      showEditIcon={true}
    />
  ) : (
    <RoundSingleView uri={value?.uri ?? ''} />
  );
};

export default ValueImage;

const styles = StyleSheet.create({
  multiImageScrollView: {
    columnGap: 8,
  },
});

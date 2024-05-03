import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {EditIcon} from '@components/icons/EditIcon';
import {borderStyles} from '@styles/common';

interface SingleImageProps {
  styleVariant?: 'round' | 'square';
  showEditIcon?: boolean;
  uri: string;
}

export const SQUARE_WIDTH = 110;
export const SQUARE_HEIGHT = 90;
export const CIRCLE_DIAMETER = 64;
export const ICON_SIZE = 24;

const SingleImage = ({
  styleVariant = 'round',
  showEditIcon = false,
  uri,
}: SingleImageProps) => {
  const theme = useTheme();
  const containerStyles = [
    styles.container,
    borderStyles.borderMinimal,
    {
      borderColor: theme.colors.outline,
      borderRadius:
        styleVariant === 'square' ? theme.roundness : CIRCLE_DIAMETER / 2,
    },
  ];
  const imageStyles = {
    borderRadius:
      styleVariant === 'square' ? theme.roundness : CIRCLE_DIAMETER / 2,
    width: styleVariant === 'square' ? SQUARE_WIDTH : CIRCLE_DIAMETER,
    height: styleVariant === 'square' ? SQUARE_HEIGHT : CIRCLE_DIAMETER,
    backgroundColor: theme.colors.primary,
  };
  return (
    <View style={containerStyles}>
      {showEditIcon && (
        <EditIcon
          color={theme.colors.primary}
          height={ICON_SIZE}
          width={ICON_SIZE}
          style={styles.editIcon}
        />
      )}
      <Image source={{uri}} style={imageStyles} />
    </View>
  );
};

export default SingleImage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    margin: 'auto',
    top: '50%',
    left: '50%',
    transform: [{translateX: -(ICON_SIZE / 2)}, {translateY: -(ICON_SIZE / 2)}],
    zIndex: 1,
  },
});

import React from 'react';
import {Image, ImageProps, ImageSourcePropType} from 'react-native';
import {Avatar, AvatarImageProps, useTheme} from 'react-native-paper';
import {useS3Download} from '@hooks/useS3';
import {ApiImage} from '@typedefs/common';

type CommonProps = {
  value: ApiImage;
  //   theme: MD3Theme;
};

// Omit 'source' from ImageProps
type RegularProps = CommonProps &
  Omit<ImageProps, 'source'> & {
    flavor: 'regular';
  };

// Omit 'source' from AvatarImageProps
type AvatarProps = CommonProps &
  Omit<AvatarImageProps, 'source'> & {
    flavor: 'avatar';
  };

const ImageWrapper: React.FC<RegularProps | AvatarProps> = ({
  flavor,
  value,
  //   theme,
  style,
  ...restProps
}) => {
  const {localUrl, error} = useS3Download(value);
  const theme = useTheme();
  const renderImage = () => {
    if (flavor === 'regular') {
      return (
        <Image
          {...(restProps as ImageProps)}
          source={{uri: localUrl} as ImageSourcePropType}
          style={[style, error ? {backgroundColor: theme.colors.error} : null]}
        />
      );
    } else {
      return (
        <Avatar.Image
          {...restProps}
          source={{uri: localUrl} as ImageSourcePropType}
          style={[style, error ? {backgroundColor: theme.colors.error} : null]}
        />
      );
    }
  };

  return renderImage();
};

export default ImageWrapper;

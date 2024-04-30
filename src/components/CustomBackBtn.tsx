import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {BackIcon} from '@components/icons/BackIcon';

const CustomBackBtn: React.FC<HeaderBackButtonProps> = ({
  canGoBack,
  tintColor,
}) => {
  const navigation = useNavigation();
  const goBack = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };
  return canGoBack ? (
    <View style={styles.backIconContainer}>
      <BackIcon onPress={goBack} color={tintColor} height={18} width={18} />
    </View>
  ) : (
    <></>
  );
};

export default CustomBackBtn;

const styles = StyleSheet.create({
  backIconContainer: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// FormRadioInput.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HelperText, Text, useTheme} from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {convertToSentenceCase} from '@helpers/formatters';
import {commonStyles, fontStyles} from '@styles/common';

interface FormRadioInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label: string;
  options: {label: string; value: string}[];
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormRadioInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  onLayout = () => {},
}: FormRadioInputProps<TFieldValues>) => {
  const theme = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}, fieldState: {error}}) => (
        <View
          style={commonStyles.width100}
          onLayout={event => {
            onLayout({name, y: event.nativeEvent.layout.y});
          }}>
          <Text style={[theme.fonts.bodyLarge, {color: theme.colors.outline}]}>
            {label}
          </Text>
          <View style={[commonStyles.rowWrap, commonStyles.pv16]}>
            {options.map((option, index) => (
              <BouncyCheckbox
                key={index}
                isChecked={value === option.value}
                // TODO: Fix the formatting logic.
                // The following is a quickfix so that SC ST OBC are as they are and
                //  other options are shown in sentence case.
                onPress={() => {
                  if (value !== option.value) {
                    onChange(option.value);
                  }
                }}
                disabled={value === option.value}
                text={
                  option.label.length > 3
                    ? convertToSentenceCase(option.label)
                    : option.label
                }
                fillColor={
                  value === option.value
                    ? theme.colors.primary
                    : theme.colors.outline
                }
                style={styles.radioContainer}
                textStyle={[
                  styles.radioTextStyle,
                  theme.fonts.bodyLarge,
                  fontStyles.regularText,
                ]}
                innerIconStyle={styles.innerIconStyle}
              />
            ))}
          </View>
          <HelperText type="error" visible={error ? true : false}>
            {error?.message ?? 'Error'}
          </HelperText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    marginBottom: 8,
  },
  radioTextStyle: {
    minWidth: 70,
    textDecorationLine: 'none',
  },
  innerIconStyle: {borderWidth: 5},
});

export default FormRadioInput;

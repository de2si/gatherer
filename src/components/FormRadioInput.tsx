// FormRadioInput.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton, Text, useTheme} from 'react-native-paper';
import {Control, Controller, FieldValues} from 'react-hook-form';

interface FormRadioInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label: string;
  options: {label: string; value: string}[];
}

const FormRadioInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
}: FormRadioInputProps<TFieldValues>) => {
  const theme = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}}) => (
        <View style={styles.container}>
          <Text style={[styles.radioLabel, theme.fonts.labelLarge]}>
            {label}
          </Text>
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={styles.radioButtonContainer}>
              {options.map((option, index) => (
                <RadioButton.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                  position="leading"
                  labelVariant="labelSmall"
                  rippleColor={theme.colors.background}
                />
              ))}
            </View>
          </RadioButton.Group>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  radioLabel: {
    minWidth: 70,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default FormRadioInput;

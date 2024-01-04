// FormInput.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HelperText, TextInput, TextInputProps} from 'react-native-paper';
import {Controller, Control, FieldValues} from 'react-hook-form';

interface FormInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldValues['name'];
  inputProps?: TextInputProps; // Pass TextInputProps directly
}

const FormInput = <TFieldValues extends FieldValues>({
  control,
  name,
  inputProps = {},
}: FormInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View style={[styles.container]}>
            <TextInput
              error={error ? true : false}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...inputProps}
            />
            {error && (
              <HelperText type="error" visible={error ? true : false}>
                {error.message || 'Error'}
              </HelperText>
            )}
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default FormInput;

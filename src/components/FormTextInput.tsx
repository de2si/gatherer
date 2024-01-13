// FormTextInput.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HelperText, TextInput, TextInputProps} from 'react-native-paper';
import {Controller, Control, FieldValues} from 'react-hook-form';
import {convertToSentenceCase} from '@helpers/formatters';

interface FormTextInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldValues['name'];
  sentenceCase?: boolean;
  inputProps?: TextInputProps; // Pass TextInputProps directly
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormTextInput = <TFieldValues extends FieldValues>({
  control,
  name,
  sentenceCase = false,
  inputProps = {},
  onLayout = () => {},
}: FormTextInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <View
          style={[styles.container]}
          onLayout={event => {
            onLayout({name, y: event.nativeEvent.layout.y});
          }}>
          <TextInput
            error={error ? true : false}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={text =>
              onChange(sentenceCase ? convertToSentenceCase(text) : text)
            }
            value={value}
            {...inputProps}
          />
          <HelperText type="error" visible={error ? true : false}>
            {error?.message || 'Error'}
          </HelperText>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default FormTextInput;

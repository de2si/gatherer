// FormTextInput.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  HelperText,
  TextInput,
  TextInputProps,
  useTheme,
} from 'react-native-paper';
import {Controller, Control, FieldValues} from 'react-hook-form';
import {convertToSentenceCase, formatDate} from '@helpers/formatters';
import {commonStyles, fontStyles} from '@styles/common';

interface FormTextInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldValues['name'];
  sentenceCase?: boolean;
  dateValue?: boolean;
  numericValue?: boolean;
  inputProps?: TextInputProps;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormTextInput = <TFieldValues extends FieldValues>({
  control,
  name,
  sentenceCase = false,
  dateValue = false,
  numericValue = false,
  inputProps = {},
  onLayout = () => {},
}: FormTextInputProps<TFieldValues>) => {
  const theme = useTheme();

  // Merge inputProps with default props
  const mergedInputProps: TextInputProps = {
    mode: 'outlined',
    style: [
      {backgroundColor: theme.colors.primary},
      theme.fonts.bodyLarge,
      styles.textInput,
      fontStyles.regularText,
    ],
    outlineStyle: styles.outline,
    placeholderTextColor: theme.colors.primaryContainer,
    selectionColor: theme.colors.onPrimary,
    textColor: theme.colors.onPrimary,
    cursorColor: theme.colors.onPrimary,
    outlineColor: theme.colors.tertiary,
    activeOutlineColor: theme.colors.onPrimaryContainer,
    readOnly: dateValue ? true : false,
    ...inputProps,
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <View
          style={[commonStyles.width100]}
          onLayout={event => {
            onLayout({name, y: event.nativeEvent.layout.y});
          }}>
          <TextInput
            error={error ? true : false}
            onBlur={onBlur}
            onChangeText={text =>
              onChange(
                numericValue
                  ? text
                    ? parseFloat(text)
                    : undefined
                  : sentenceCase
                  ? convertToSentenceCase(text)
                  : text,
              )
            }
            value={
              dateValue
                ? formatDate(value)
                : numericValue && value
                ? value.toString()
                : value
            }
            {...mergedInputProps}
          />
          {!dateValue && (
            <HelperText type="error" visible={error ? true : false}>
              {error?.message || 'Error'}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
  },
  outline: {
    borderRadius: 8,
  },
});

export default FormTextInput;

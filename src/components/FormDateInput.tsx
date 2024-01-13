// FormDateInput.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HelperText, IconButton, Text, useTheme} from 'react-native-paper';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {formatDate} from '@helpers/formatters';

interface FormDatePickerProps
  extends Omit<DatePickerProps, 'date' | 'onConfirm'> {
  date?: Date;
  onConfirm?: (date: Date) => void;
}

interface FormDateInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  datePickerProps?: FormDatePickerProps;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormDateInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Date',
  datePickerProps = {},
  onLayout = () => {},
}: FormDateInputProps<TFieldValues>) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}, fieldState: {error}}) => (
        <View
          onLayout={event => {
            onLayout({name, y: event.nativeEvent.layout.y});
          }}>
          <View style={[styles.container, styles.rowContainer]}>
            <Text style={[styles.dateInputLabel, theme.fonts.labelLarge]}>
              {label}
            </Text>

            <View style={styles.colContainer}>
              <View style={styles.rowContainer}>
                <Text style={[theme.fonts.bodyMedium]}>
                  {formatDate(value)}
                </Text>
                <IconButton
                  icon="calendar"
                  mode="contained-tonal"
                  size={24}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                  containerColor={
                    error
                      ? theme.colors.errorContainer
                      : theme.colors.tertiaryContainer
                  }
                />
              </View>
            </View>
            <DatePicker
              modal
              open={showDatePicker}
              date={value ?? datePickerProps.date ?? new Date('1990-01-01')}
              onConfirm={changedDate => {
                onChange(changedDate);
                setShowDatePicker(false);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
              textColor={theme.colors.primary}
              fadeToColor={theme.colors.onPrimary}
              mode="date"
              confirmText="Ok"
              {...datePickerProps}
              title={label}
              // maximumDate
              // minimumDate
            />
          </View>
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
  dateInputLabel: {
    minWidth: 70,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  colContainer: {
    flexDirection: 'column',
  },
});

export default FormDateInput;

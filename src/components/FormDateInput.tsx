// FormDateInput.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HelperText, IconButton, Text, useTheme} from 'react-native-paper';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import {Control, Controller, FieldValues} from 'react-hook-form';

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
}

// Helper function to format DOB
const formatDate = (dateToFormat: Date | undefined) => {
  if (!dateToFormat) {
    return '';
  }
  const day = dateToFormat.getDate().toString().padStart(2, '0');
  const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
  const year = dateToFormat.getFullYear();
  return `${day}-${month}-${year}`;
};

const FormDateInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Date',
  datePickerProps = {},
}: FormDateInputProps<TFieldValues>) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}, fieldState: {error}}) => (
        <View style={[styles.container, styles.rowContainer]}>
          <Text style={[styles.dateInputLabel, theme.fonts.labelLarge]}>
            {label}
          </Text>

          <View style={styles.colContainer}>
            <View style={styles.rowContainer}>
              <Text style={[theme.fonts.bodyMedium]}>{formatDate(value)}</Text>
              <IconButton
                icon="calendar"
                mode="contained"
                size={24}
                onPress={() => {
                  setShowDatePicker(true);
                }}
              />
            </View>
            {error && (
              <HelperText type="error" visible={error ? true : false}>
                {error.message || 'Error'}
              </HelperText>
            )}
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

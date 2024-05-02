// FormDateInput.tsx

import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {HelperText, useTheme} from 'react-native-paper';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import {Control, Controller, FieldValues} from 'react-hook-form';
import FormTextInput from '@components/FormTextInput';
import {CalendarIcon} from '@components/icons/CalendarIcon';
import {commonStyles} from '@styles/common';

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
          <View style={[commonStyles.width100, styles.container]}>
            <View style={styles.dateInput}>
              <FormTextInput
                control={control}
                name={name}
                dateValue
                inputProps={{readOnly: true}}
              />
            </View>
            <Pressable
              onPress={() => {
                setShowDatePicker(true);
              }}
              style={styles.dateIcon}>
              <CalendarIcon
                height={32}
                width={32}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
          <HelperText type="error" visible={error ? true : false}>
            {error?.message || 'Error'}
          </HelperText>
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
    flex: 1,
    flexDirection: 'row',
    columnGap: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    maxWidth: 120,
  },
  dateIcon: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FormDateInput;

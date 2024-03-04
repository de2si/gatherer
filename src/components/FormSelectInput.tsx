// FormSelectInput.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  ActivityIndicator,
  Chip,
  HelperText,
  Text,
  useTheme,
  // MD3Theme,
} from 'react-native-paper';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {Control, FieldValues, useController} from 'react-hook-form';
import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import {MultiSelectProps} from 'react-native-element-dropdown/lib/typescript/components/MultiSelect/model';

// component to show when the options list is empty
interface RenderEmptyProps {
  message?: string;
}
const RenderEmpty: React.FC<RenderEmptyProps> = ({message = 'List Empty!'}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text>{message}</Text>
    </View>
  );
};

// component to show loading state at the list footer
interface RenderFooterProps {
  isLoading: boolean;
}
const RenderFooter: React.FC<RenderFooterProps> = ({isLoading}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.footerContainer}>
      <ActivityIndicator />
    </View>
  );
};

interface RenderSelectedItemProps<T> {
  item: T;
  unSelect?: (item: T) => void;
  labelField?: keyof T;
  // theme: MD3Theme;
}

const RenderSelectedItem = <T extends any>({
  item,
  unSelect,
  labelField,
}: // theme,
RenderSelectedItemProps<T>) => {
  return (
    <Chip
      style={styles.chip}
      // style={[styles.chip, {backgroundColor: theme.colors.secondaryContainer}]}
      // textStyle={{color: theme.colors.onSecondaryContainer}}
      onPress={() => unSelect && unSelect(item)}
      onClose={() => unSelect && unSelect(item)}
      ellipsizeMode="middle">
      {labelField ? (item[labelField] as string) : (item as string)}
    </Chip>
  );
};

interface FormSelectInputBaseProps<TForm extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TForm>;
  loading: boolean;
  onLayout?: (fieldY: {name: string; y: number}) => void;
  hideErrors?: boolean;
}

interface FormSingleSelectInputProps<T = any, TForm extends FieldValues = any>
  extends FormSelectInputBaseProps<TForm> {
  variant: 'single';
  selectProps: Omit<DropdownProps<T>, 'value' | 'onChange' | 'onBlur'>;
}

interface FormMultiSelectInputProps<T = any, TForm extends FieldValues = any>
  extends FormSelectInputBaseProps<TForm> {
  variant: 'multiple';
  selectProps: Omit<MultiSelectProps<T>, 'value' | 'onChange' | 'onBlur'>;
}

export type FormSelectInputProps<T = any, TForm extends FieldValues = any> =
  | FormSingleSelectInputProps<T, TForm>
  | FormMultiSelectInputProps<T, TForm>;

export const FormSelectInput = <T, TForm extends FieldValues>({
  name,
  control,
  loading = false,
  onLayout = () => {},
  hideErrors = false,
  variant = 'single',
  selectProps,
}: FormSelectInputProps<T, TForm>) => {
  const theme = useTheme();
  const [isFocus, setIsFocus] = useState(false);
  const {
    field: {value: ctrlValue, onChange: ctrlOnChange, onBlur: ctrlOnBlur},
    fieldState: {error: ctrlError},
  } = useController({
    name,
    control,
  });

  const {
    style,
    containerStyle,
    placeholderStyle,
    selectedTextStyle,
    iconStyle,
    inputSearchStyle,
    flatListProps,
    search,
    searchPlaceholder,
    backgroundColor,
    valueField,
    inverted,
    ...remainingSelectProps
  } = selectProps;

  let computedProps = {
    backgroundColor: backgroundColor ?? theme.colors.backdrop,
    style: [
      styles.dropdown,
      {
        backgroundColor: ctrlError
          ? theme.colors.errorContainer
          : theme.colors.background,
        borderColor: theme.colors.outline,
        borderRadius: theme.roundness,
      },
      isFocus && styles.dropdownFocusStyle,
      // isFocus && {borderColor: theme.colors.primary, borderWidth: 2},
      style ?? null,
    ],
    containerStyle: [styles.containerStyle, containerStyle ?? null],
    placeholderStyle: [
      {color: theme.colors.onSurfaceVariant},
      styles.placeholderStyle,
      theme.fonts.bodyLarge,
      placeholderStyle ?? null,
    ],
    selectedTextStyle: [
      {color: theme.colors.onSurface},
      styles.selectedTextStyle,
      theme.fonts.bodyLarge,
      selectedTextStyle ?? null,
    ],
    selectedStyle: [
      styles.selectedStyle,
      'selectedStyle' in remainingSelectProps
        ? remainingSelectProps.selectedStyle
        : null,
    ],
    iconStyle: [styles.iconStyle, iconStyle ?? null],
    inputSearchStyle: [styles.inputSearchStyle, inputSearchStyle ?? null],
    search: search ?? remainingSelectProps.data.length > 5,
    searchPlaceholder: searchPlaceholder ?? 'Search...',
    value: ctrlValue,
    valueField,
    onFocus: () => {
      setIsFocus(true);
    },
    onBlur: () => {
      setIsFocus(false);
      ctrlOnBlur();
    },
    flatListProps: {
      ListEmptyComponent: <RenderEmpty />,
      ListFooterComponent: <RenderFooter isLoading={loading} />,
      ...(flatListProps ?? {}),
    },
    inverted: inverted ? inverted : false,
  };
  let singleSelectProps = {
    onChange: (item: T) => {
      valueField ? ctrlOnChange(item[valueField]) : ctrlOnChange(item);
    },
  };
  let multiSelectProps = {
    // inside: true,
    onChange: ctrlOnChange,
    renderSelectedItem:
      'renderSelectedItem' in remainingSelectProps
        ? remainingSelectProps.renderSelectedItem
        : (item: T, unSelect?: (item: T) => void) => {
            return RenderSelectedItem<T>({
              item,
              unSelect,
              labelField: remainingSelectProps.labelField,
              // theme,
            });
          },
  };
  return (
    <View
      style={styles.container}
      onLayout={event => {
        onLayout({name, y: event.nativeEvent.layout.y});
      }}>
      {variant === 'single' && (
        <Dropdown<T>
          {...computedProps}
          {...remainingSelectProps}
          {...singleSelectProps}
        />
      )}
      {variant === 'multiple' && (
        <MultiSelect<T>
          {...computedProps}
          {...remainingSelectProps}
          {...multiSelectProps}
        />
      )}
      {!hideErrors && (
        <HelperText type="error" visible={ctrlError ? true : false}>
          {ctrlError?.message ?? 'Error'}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%'},
  dropdown: {
    width: '100%',
    height: 50,
    // borderRadius: 12,
    // borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dropdownFocusStyle: {
    // borderColor: 'pink',
  },
  containerStyle: {
    borderRadius: 12,
    paddingVertical: 12,
    // borderTopLeftRadius: 0,
    // borderTopRightRadius: 0,
    // borderBottomLeftRadius: 12,
    // borderBottomRightRadius: 12,
  },
  placeholderStyle: {
    // fontSize: 16,
    // // color: MD3LightTheme.colors.onSurfaceVariant,
    // fontSize: MD3LightTheme.fonts.bodyLarge.fontSize,
  },
  selectedTextStyle: {
    // fontSize: 14,
    // // color: MD3LightTheme.colors.primary,
    // fontSize: MD3LightTheme.fonts.bodyLarge.fontSize,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  chip: {
    margin: 4,
  },
});

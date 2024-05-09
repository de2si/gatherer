// FormFarmerInput.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {
  Button,
  HelperText,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {Control, Controller, FieldValues} from 'react-hook-form';

import FarmerListItem from '@components/FarmerListItem';
import ExpandableSearch from '@components/ExpandableSearch';
import {SearchIcon} from '@components/icons/SearchIcon';
import {BackIcon} from '@components/icons/BackIcon';

import {useFarmerSearch} from '@hooks/useFarmerSearch';

import {
  borderStyles,
  commonStyles,
  spacingStyles,
  tableStyles,
} from '@styles/common';

interface FormFarmerInputProps<TFieldValues extends FieldValues> {
  name: FieldValues['name'];
  control: Control<TFieldValues>;
  label?: string;
  onLayout?: (fieldY: {name: string; y: number}) => void;
}

const FormFarmerInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Farmer',
  onLayout = () => {},
}: FormFarmerInputProps<TFieldValues>) => {
  const [showFarmerPicker, setShowFarmerPicker] = React.useState(false);
  const theme = useTheme();
  const {
    loading,
    data,
    setSearchText,
    snackbarVisible,
    snackbarMessage,
    dismissSnackbar,
  } = useFarmerSearch();

  const renderLoadingIndicator = () => {
    return loading ? (
      <ActivityIndicator size="large" color={theme.colors.primary} />
    ) : null;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}, fieldState: {error}}) => (
        <View
          onLayout={event => {
            onLayout({name, y: event.nativeEvent.layout.y});
          }}>
          <View style={commonStyles.row}>
            <Text
              style={[
                theme.fonts.bodyLarge,
                {color: theme.colors.outline},
                tableStyles.w120,
                spacingStyles.mr16,
              ]}>
              {label}
            </Text>
            <View style={commonStyles.row}>
              <Button
                icon={props => SearchIcon({height: 20, width: 20, ...props})}
                onPress={() => {
                  setShowFarmerPicker(true);
                }}
                buttonColor={theme.colors.primary}
                textColor={
                  value ? theme.colors.onPrimary : theme.colors.primaryContainer
                }
                style={[
                  borderStyles.radius8,
                  error ? borderStyles.border2 : borderStyles.border1,
                  {
                    borderColor: error
                      ? theme.colors.error
                      : theme.colors.tertiary,
                  },
                  commonStyles.flex1,
                ]}
                contentStyle={tableStyles.flexStart}>
                {value ? value.name : 'Search and add'}
              </Button>
            </View>
            {showFarmerPicker && (
              <Portal>
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {backgroundColor: theme.colors.background},
                  ]}>
                  <View
                    style={[
                      commonStyles.rowCentered,
                      commonStyles.h40,
                      spacingStyles.mh16,
                    ]}>
                    <Pressable onPress={() => setShowFarmerPicker(false)}>
                      <BackIcon
                        color={theme.colors.tertiary}
                        height={24}
                        width={24}
                      />
                    </Pressable>
                    <View style={commonStyles.flex1}>
                      <ExpandableSearch
                        visible={true}
                        applySearch={setSearchText}
                      />
                    </View>
                  </View>

                  <View style={[commonStyles.flex1, spacingStyles.mv16]}>
                    <FlatList
                      data={data}
                      renderItem={({item}) => (
                        <FarmerListItem
                          data={item}
                          onPress={farmer => {
                            onChange({id: farmer.id, name: farmer.name});
                            setShowFarmerPicker(false);
                          }}
                          color={theme.colors.primary}
                          borderColor={theme.colors.tertiary}
                          dialEnabled={false}
                        />
                      )}
                      keyExtractor={item => item.id.toString()}
                      ListEmptyComponent={
                        <Text
                          style={[
                            theme.fonts.titleLarge,
                            {color: theme.colors.onSurfaceVariant},
                          ]}>
                          No farmer found
                        </Text>
                      }
                      ListFooterComponent={renderLoadingIndicator}
                      contentContainerStyle={
                        !data.length && commonStyles.centeredContainer
                      }
                    />
                  </View>
                  <Snackbar
                    visible={snackbarVisible}
                    onDismiss={dismissSnackbar}
                    duration={Snackbar.DURATION_SHORT}>
                    {snackbarMessage}
                  </Snackbar>
                </View>
              </Portal>
            )}
          </View>
          <HelperText type="error" visible={error ? true : false}>
            {error?.message || 'Error'}
          </HelperText>
        </View>
      )}
    />
  );
};

export default FormFarmerInput;

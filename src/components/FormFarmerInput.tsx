// FormFarmerInput.tsx

import React from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {
  Button,
  HelperText,
  IconButton,
  Portal,
  Searchbar,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {Control, Controller, FieldValues} from 'react-hook-form';
import FarmerListItem from '@components/FarmerListItem';
import {useFarmerSearch} from '@hooks/useFarmerSearch';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const theme = useTheme();
  const {
    loading,
    data,
    setSearchText,
    snackbarVisible,
    snackbarMessage,
    dismissSnackbar,
  } = useFarmerSearch();

  const renderSearchRightButton = () => (
    <>
      {searchQuery && (
        <IconButton icon="close" onPress={() => setSearchQuery('')} />
      )}
      <IconButton
        icon="account-search"
        mode="contained-tonal"
        onPress={() => setSearchText(searchQuery)}
        selected
      />
    </>
  );

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
          <View style={[styles.container, styles.rowContainer]}>
            <Text style={[styles.label, theme.fonts.labelLarge]}>{label}</Text>
            <View style={styles.colContainer}>
              <View style={[styles.rowContainer, styles.wrap]}>
                <Text style={[theme.fonts.bodyMedium]}>
                  {value ? value.name : ''}
                </Text>
                <Button
                  icon="badge-account-horizontal-outline"
                  onPress={() => {
                    setShowFarmerPicker(true);
                  }}
                  mode="contained-tonal"
                  buttonColor={
                    error
                      ? theme.colors.errorContainer
                      : theme.colors.tertiaryContainer
                  }
                  textColor={theme.colors.primary}>
                  Search & add
                </Button>
              </View>
            </View>
            {showFarmerPicker && (
              <Portal>
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    {backgroundColor: theme.colors.background},
                  ]}>
                  <View style={styles.row}>
                    <IconButton
                      icon="arrow-left"
                      size={24}
                      onPress={() => setShowFarmerPicker(false)}
                    />
                    <View style={styles.searchContainer}>
                      <Searchbar
                        placeholder="Aadhaar, code, name, phone..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        right={renderSearchRightButton}
                        onBlur={() => setSearchText(searchQuery)}
                        autoFocus={true}
                      />
                    </View>
                  </View>

                  <View style={styles.searchListContainer}>
                    <FlatList
                      data={data}
                      renderItem={({item}) => (
                        <FarmerListItem
                          data={item}
                          onPress={farmer => {
                            onChange({id: farmer.id, name: farmer.name});
                            setShowFarmerPicker(false);
                          }}
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
                      contentContainerStyle={!data.length && styles.noData}
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    minWidth: 70,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    rowGap: 12,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  colContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  row: {
    flexDirection: 'row',
  },
  searchContainer: {
    flex: 1,
    paddingRight: 12,
  },
  searchListContainer: {
    flex: 1,
    marginVertical: 24,
  },
});

export default FormFarmerInput;

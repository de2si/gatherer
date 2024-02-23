// LandListScreen.tsx

import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl} from 'react-native-gesture-handler';
import {Snackbar, Text, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LandStackScreenProps} from '@nav/LandStack';

// store
import {useLandStore} from '@hooks/useLandStore';
import {useAuthStore} from '@hooks/useAuthStore';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';

// components
import FilterSheet, {
  locationFilterDefaultValues,
} from '@components/FilterSheet';
import SearchSheet from '@components/SearchSheet';
import {ListScreenHeaderRight} from '@components/ListScreenHeaderRight';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import LandListItem from '@components/LandListItem';

type LandListScreenProps = NativeStackScreenProps<
  LandStackScreenProps,
  'LandList'
>;

const LandListScreen: React.FC<LandListScreenProps> = ({navigation}) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const lands = useLandStore(store => store.data);
  const fetchData = useLandStore(store => store.fetchData);
  const refresh = useLandStore(store => store.refresh);
  const setRefresh = useLandStore(store => store.setRefresh);
  const theme = useTheme();
  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const [searchBottomSheetVisible, setSearchBottomSheetVisible] =
    useState(false);
  const [filters, setFilters] = useState(locationFilterDefaultValues);
  const [searchText, setSearchText] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');

  const handleFilterPress = () => {
    setFilterBottomSheetVisible(true);
  };
  const handleSearchPress = () => {
    setSearchBottomSheetVisible(true);
  };
  const handleSearchClearPress = () => {
    setSearchText('');
  };

  const showDetailScreen = (id: number) => {
    navigation.navigate('LandDetail', {id});
  };

  useEffect(() => {
    const handleAddPress = () => {
      navigation.navigate('LandAdd', {variant: 'add'});
    };
    navigation.setOptions({
      headerRight: () =>
        ListScreenHeaderRight({
          isFilterApplied,
          isSearchApplied,
          handleFilterPress,
          handleSearchPress,
          handleSearchClearPress,
          handleAddPress,
        }),
    });
  }, [isFilterApplied, isSearchApplied, navigation]);

  const initialLoad = useRef(false);
  const prevSearchText = useRef(searchText);
  const prevFilters = useRef({...filters});
  useEffect(() => {
    const fetchProcessing = async () => {
      try {
        setLoading(true);
        await withAuth(async () => {
          await fetchData(filters, searchText);
        });
      } catch (error) {
        let message = getErrorMessage(error);
        typeof message === 'string'
          ? showSnackbar(message)
          : showSnackbar('Error in getting land data');
      } finally {
        setLoading(false);
      }
      setIsSearchApplied(!!searchText.length);
      setIsFilterApplied(Object.values(filters).some(arr => arr.length > 0));

      // Update previous values for comparison in the next render
      prevSearchText.current = searchText;
      prevFilters.current = {...filters};
    };

    // Call fetchProcessing on the first run
    if (!initialLoad.current) {
      initialLoad.current = true;
      fetchProcessing();
    }

    // Call fetchProcessing when refresh is set to true
    if (refresh) {
      fetchProcessing();
    }

    // Call fetchProcessing when searchText or filters change
    if (
      searchText !== prevSearchText.current ||
      !areFiltersEqual(filters, prevFilters.current)
    ) {
      fetchProcessing();
    }
  }, [fetchData, filters, searchText, refresh, withAuth, showSnackbar]);

  return (
    <View style={styles.container}>
      <FlatList
        data={lands}
        renderItem={({item}) => (
          <LandListItem
            data={item}
            onPress={land => showDetailScreen(land.id)}
            theme={theme}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={[
              theme.fonts.titleLarge,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Lands not found
          </Text>
        }
        contentContainerStyle={!lands.length && styles.noData}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={setRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />
      <FilterSheet
        visible={filterBottomSheetVisible}
        filterValues={filters}
        onClose={() => setFilterBottomSheetVisible(false)}
        applyFilters={setFilters}
      />
      <SearchSheet
        visible={searchBottomSheetVisible}
        searchText={searchText}
        onClose={() => setSearchBottomSheetVisible(false)}
        applySearch={setSearchText}
        helperText={
          '\n• Search using farmer code\n• Search using aadhaar no.\n• Search using name\n• Search using phone number'
        }
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default LandListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
// BeneficiaryListScreen.tsx

import {FlatList, RefreshControl, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Snackbar, Text, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BeneficiaryStackScreenProps} from '@nav/BeneficiaryStack';

// hooks, types
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {
  useBeneficiaryStore,
  BeneficiaryPreview,
} from '@hooks/useBeneficiaryStore';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';

// components
import BeneficiaryListItem from '@components/FarmerListItem';
import FilterSheet, {
  locationFilterDefaultValues,
} from '@components/FilterSheet';
import ExpandableSearch from '@components/ExpandableSearch';
import {ListScreenHeaderRight} from '@components/ListScreenHeaderRight';

import {commonStyles} from '@styles/common';

type BeneficiaryListScreenProps = NativeStackScreenProps<
  BeneficiaryStackScreenProps,
  'BeneficiaryList'
>;

const BeneficiaryListScreen: React.FC<BeneficiaryListScreenProps> = ({
  navigation,
}) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const beneficiaries = useBeneficiaryStore(store => store.data);
  const fetchData = useBeneficiaryStore(store => store.fetchData);
  const refresh = useBeneficiaryStore(store => store.refresh);
  const setRefresh = useBeneficiaryStore(store => store.setRefresh);

  const theme = useTheme();

  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
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

  const showDetailScreen = (beneficiary: BeneficiaryPreview) => {
    navigation.navigate('BeneficiaryDetail', {id: beneficiary.id});
  };

  useEffect(() => {
    const handleSearchPress = () => {
      setExpandSearch(val => !val);
    };
    const handleAddPress = () => {
      navigation.navigate('BeneficiaryAdd', {variant: 'add'});
    };
    navigation.setOptions({
      headerRight: () =>
        ListScreenHeaderRight({
          isFilterApplied,
          isSearchApplied,
          handleFilterPress,
          handleSearchPress,
          handleAddPress,
          theme,
        }),
    });
  }, [isFilterApplied, isSearchApplied, navigation, theme]);

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
          : showSnackbar('Error in getting beneficiaries');
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
    <View style={commonStyles.flex1}>
      <ExpandableSearch
        visible={expandSearch}
        applySearch={setSearchText}
        placeholder="Search code, name, aadhaar, phone number..."
      />
      <FlatList
        data={beneficiaries}
        renderItem={({item}) => (
          <BeneficiaryListItem
            data={item}
            onPress={showDetailScreen}
            color={theme.colors.primary}
            borderColor={theme.colors.tertiary}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={[
              theme.fonts.titleLarge,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Beneficiaries not found
          </Text>
        }
        contentContainerStyle={
          !beneficiaries.length && commonStyles.centeredContainer
        }
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
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default BeneficiaryListScreen;

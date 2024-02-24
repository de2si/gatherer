// ParticipantListScreen.tsx

import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {Card, MD3Theme, Snackbar, Text, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParticipantStackScreenProps} from '@nav/Project/CarbonSeq/ParticipantStack';

// hooks, types
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {useParticipantStore, ParticipantPreview} from '@hooks/carbonSeqHooks';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';
import {formatNumber, truncateString} from '@helpers/formatters';

// components, constants
import {ListScreenHeaderRight} from '@components/ListScreenHeaderRight';
import SearchSheet from '@components/SearchSheet';
import FilterSheet, {
  locationFilterDefaultValues,
} from '@components/FilterSheet';
import {Ownership} from '@helpers/constants';

const Item = ({
  data,
  onPress,
  theme,
}: {
  data: ParticipantPreview;
  onPress: any;
  theme: MD3Theme;
}) => (
  <Card mode="elevated" onPress={() => onPress(data)}>
    <Card.Content style={styles.row}>
      <Image
        source={{uri: data.land.picture.url}}
        style={[
          styles.farmThumbnail,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.roundness,
          },
        ]}
      />
      <View style={styles.cardTextContent}>
        <View style={styles.cardDataRow}>
          <Text variant="titleSmall">
            {data.land.ownership_type === Ownership.PRIVATE
              ? truncateString(data.land.farmer.name)
              : data.land.ownership_type}
          </Text>
          <Text variant="titleSmall">{data.land.code}</Text>
        </View>
        <View style={styles.cardDataRow}>
          <Text variant="bodySmall">{data.land.village.name}</Text>
          <Text variant="bodySmall">{data.land.khasra_number}</Text>
        </View>
        <View style={styles.cardDataRow}>
          {Object.entries({
            Target: data.total_pits_target,
            Dug: data.total_pits_dug,
            Fertilized: data.total_pits_fertilized,
            Planted: data.total_pits_planted,
          }).map(([title, value]) => (
            <View style={styles.listItem} key={title}>
              <Text
                variant="bodySmall"
                style={{color: theme.colors.inverseSurface}}>
                {title}
              </Text>
              <Text variant="bodySmall">{formatNumber(value)}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card.Content>
  </Card>
);

type ParticipantListScreenProps = NativeStackScreenProps<
  ParticipantStackScreenProps,
  'ParticipantList'
>;

const ParticipantListScreen: React.FC<ParticipantListScreenProps> = ({
  navigation,
}) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const participants = useParticipantStore(store => store.data);
  const fetchData = useParticipantStore(store => store.fetchData);
  const refresh = useParticipantStore(store => store.refresh);
  const setRefresh = useParticipantStore(store => store.setRefresh);

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

  const showDetailScreen = (participant: ParticipantPreview) => {
    navigation.navigate('ParticipantDetail', {id: participant.id});
  };

  useEffect(() => {
    const handleAddPress = () => {
      navigation.navigate('ParticipantAdd', {});
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
          : showSnackbar('Error in getting participants');
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
        data={participants}
        renderItem={({item}) => (
          <Item data={item} onPress={showDetailScreen} theme={theme} />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={[
              theme.fonts.titleLarge,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Participants not found
          </Text>
        }
        contentContainerStyle={!participants.length && styles.noData}
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

export default ParticipantListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  row: {
    flexDirection: 'row',
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  farmThumbnail: {
    height: 80,
    width: 80,
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  listItem: {
    justifyContent: 'center',
    paddingVertical: 4,
  },
});

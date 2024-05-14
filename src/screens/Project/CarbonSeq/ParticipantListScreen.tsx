// ParticipantListScreen.tsx

import {FlatList, RefreshControl, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Card, Snackbar, useTheme} from 'react-native-paper';

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
import FilterSheet, {
  locationFilterDefaultValues,
} from '@components/FilterSheet';
import {Text} from '@components/Text';
import ExpandableSearch from '@components/ExpandableSearch';
import ImageWrapper from '@components/ImageWrapper';
import {Ownership} from '@helpers/constants';

import {cardStyles, commonStyles, spacingStyles} from '@styles/common';

interface ItemProps {
  data: ParticipantPreview;
  onPress: any;
  color: string;
  borderColor: string;
}

const Item = ({data, onPress, color, borderColor}: ItemProps) => (
  <Card
    mode="contained"
    onPress={() => onPress(data)}
    style={[cardStyles.card, {borderColor}, spacingStyles.mh16]}>
    <Card.Content style={cardStyles.cardContent}>
      <ImageWrapper
        flavor="regular"
        value={data.land.picture}
        style={[cardStyles.cardThumbnail, {backgroundColor: color}]}
      />
      <View style={commonStyles.flex1}>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodyXl" style={{color}}>
            {data.land.ownership_type === Ownership.PRIVATE
              ? truncateString(data.land.farmer.name)
              : data.land.ownership_type}
          </Text>
          <Text variant="bodyXl" style={{color}}>
            {data.land.code}
          </Text>
        </View>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodySmall" style={{color}}>
            {data.land.village.name}
          </Text>
          <Text variant="bodySmall" style={{color}}>
            {data.land.khasra_number}
          </Text>
        </View>
        <View style={[cardStyles.cardDataRow, spacingStyles.mt8]}>
          {Object.entries({
            Target: data.total_pits_target,
            Dug: data.total_pits_dug,
            Fertilized: data.total_pits_fertilized,
            Planted: data.total_pits_planted,
          }).map(([title, value]) => (
            <View key={title}>
              <Text variant="bodySmall" style={{color}}>
                {title}
              </Text>
              <Text variant="bodySmall" style={{color}}>
                {formatNumber(value)}
              </Text>
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
  const showDetailScreen = (participant: ParticipantPreview) => {
    navigation.navigate('ParticipantDetail', {id: participant.id});
  };

  useEffect(() => {
    const handleSearchPress = () => {
      setExpandSearch(val => !val);
    };
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
    <View style={commonStyles.flex1}>
      <ExpandableSearch visible={expandSearch} applySearch={setSearchText} />
      <FlatList
        data={participants}
        renderItem={({item}) => (
          <Item
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
            Participants not found
          </Text>
        }
        contentContainerStyle={
          !participants.length && commonStyles.centeredContainer
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

export default ParticipantListScreen;

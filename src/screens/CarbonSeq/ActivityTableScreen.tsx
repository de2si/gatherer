// ActivityTableScreen.tsx

import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {IconButton, Snackbar, Text, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityStackScreenProps} from '@nav/Project/CarbonSeq/ActivityStack';

// hooks, types
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {
  ActivityStore,
  useDugStore,
  useFertilizedStore,
  usePlantedStore,
  useTargetStore,
} from '@hooks/carbonSeqHooks';
import {StoreApi, UseBoundStore} from 'zustand';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';

// components, constants
import ActivityTable from '@components/CarbonSeq/ActivityTable';
import FilterSheet, {
  locationFilterDefaultValues,
} from '@components/FilterSheet';
import {ACTIVITY_NAMES} from '@screens/CarbonSeq/ActivityListScreen';

const activityTableHeaderRight = ({
  isFilterApplied = false,
  handleFilterPress = () => {},
}: {
  isFilterApplied?: boolean;
  handleFilterPress?: () => void;
}) => (
  <IconButton
    icon="filter-outline"
    size={24}
    onPress={handleFilterPress}
    selected={isFilterApplied}
    mode={isFilterApplied ? 'contained' : undefined}
  />
);

type ActivityTableScreenProps = NativeStackScreenProps<
  ActivityStackScreenProps,
  'ActivityTable'
>;

const ActivityTableScreen: React.FC<ActivityTableScreenProps> = ({
  route: {
    params: {name},
  },
  navigation,
}) => {
  const withAuth = useAuthStore(store => store.withAuth);
  let useActivityStore: UseBoundStore<StoreApi<ActivityStore>>;
  switch (name) {
    case ACTIVITY_NAMES[0]:
      useActivityStore = useTargetStore;
      break;
    case ACTIVITY_NAMES[1]:
      useActivityStore = useDugStore;
      break;
    case ACTIVITY_NAMES[2]:
      useActivityStore = useFertilizedStore;
      break;
    case ACTIVITY_NAMES[3]:
      useActivityStore = usePlantedStore;
      break;
    default:
      useActivityStore = useTargetStore;
  }
  const activityRows = useActivityStore(store => store.data);
  const fetchData = useActivityStore(store => store.fetchData);
  const refresh = useActivityStore(store => store.refresh);
  const setRefresh = useActivityStore(store => store.setRefresh);

  const theme = useTheme();

  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const [filters, setFilters] = useState(locationFilterDefaultValues);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');

  const handleFilterPress = () => {
    setFilterBottomSheetVisible(true);
  };

  const showParticipantScreen = (participantId: number) => {
    (navigation as any).navigate('ParticipantDetail', {id: participantId});
  };

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () =>
        activityTableHeaderRight({isFilterApplied, handleFilterPress}),
    });
  }, [isFilterApplied, name, navigation]);

  const initialLoad = useRef(false);
  const prevFilters = useRef({...filters});
  useEffect(() => {
    const fetchProcessing = async () => {
      try {
        setLoading(true);
        await withAuth(async () => {
          await fetchData(filters);
        });
      } catch (error) {
        let message = getErrorMessage(error);
        typeof message === 'string'
          ? showSnackbar(message)
          : showSnackbar(`Error in getting ${name} data`);
      } finally {
        setLoading(false);
      }
      setIsFilterApplied(Object.values(filters).some(arr => arr.length > 0));

      // Update previous values for comparison in the next render
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

    // Call fetchProcessing when filters change
    if (!areFiltersEqual(filters, prevFilters.current)) {
      fetchProcessing();
    }
  }, [fetchData, filters, refresh, withAuth, showSnackbar, name]);

  if (activityRows.length === 0) {
    return (
      <View style={styles.noData}>
        <Text
          style={[
            theme.fonts.titleLarge,
            {color: theme.colors.onSurfaceVariant},
          ]}>
          No data found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={setRefresh}
            colors={[theme.colors.primary]}
          />
        }>
        <ActivityTable data={activityRows} onPress={showParticipantScreen} />
      </ScrollView>

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

export default ActivityTableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

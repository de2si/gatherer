// FarmerListScreen.tsx

import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl} from 'react-native-gesture-handler';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

// store
import {FarmerPreview, useFarmerStore} from '@hooks/useFarmerStore';

// helpers
import {areLocationFiltersEqual} from '@helpers/comparators';

// components
import LocationFilterSheet, {
  locationFilterDefaultValues,
} from '@components/LocationFilterSheet';
import SearchSheet from '@components/SearchSheet';

const farmerListHeaderRight = ({
  isFilterApplied,
  isSearchApplied,
  handleFilterPress,
  handleSearchPress,
  handleAddPress,
}: {
  isFilterApplied: boolean;
  isSearchApplied: boolean;
  handleFilterPress: () => void;
  handleSearchPress: () => void;
  handleAddPress: () => void;
}) => {
  return (
    <>
      <IconButton
        icon="filter-outline"
        size={24}
        onPress={handleFilterPress}
        selected={isFilterApplied}
        mode={isFilterApplied ? 'contained' : undefined}
      />
      <IconButton
        icon="magnify"
        size={24}
        onPress={handleSearchPress}
        selected={isSearchApplied}
        mode={isSearchApplied ? 'contained' : undefined}
      />
      <Button mode="contained-tonal" onPress={handleAddPress}>
        Add
      </Button>
    </>
  );
};

const Item = ({
  data: {id, name, photo, code, village, guardian, phone},
  onPress,
}: {
  data: FarmerPreview;
  onPress: any;
}) => (
  <Card mode="elevated" onPress={() => onPress(id)}>
    <Card.Content style={styles.row}>
      <Avatar.Image source={{uri: photo.url}} size={80} style={styles.avatar} />
      <View style={styles.cardTextContent}>
        <View style={styles.cardDataRow}>
          <Text variant="titleSmall">{name}</Text>
          <Text variant="titleSmall">{code}</Text>
        </View>
        <View style={styles.cardDataRow}>
          <Text variant="bodySmall">{guardian}</Text>
          <Text variant="bodySmall">{phone}</Text>
        </View>
        <Text variant="bodySmall">{village.name}</Text>
      </View>
    </Card.Content>
  </Card>
);

type FarmerListScreenProps = NativeStackScreenProps<
  FarmerStackScreenProps,
  'FarmerList'
>;

const FarmerListScreen: React.FC<FarmerListScreenProps> = ({navigation}) => {
  const farmers = useFarmerStore(store => store.data);
  const loading = useFarmerStore(store => store.loading);
  const fetchData = useFarmerStore(store => store.fetchData);
  const refresh = useFarmerStore(store => store.refresh);
  const setRefresh = useFarmerStore(store => store.setRefresh);
  const theme = useTheme();
  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const [searchBottomSheetVisible, setSearchBottomSheetVisible] =
    useState(false);
  const [filters, setFilters] = useState(locationFilterDefaultValues);
  const [searchText, setSearchText] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const handleFilterPress = () => {
    setFilterBottomSheetVisible(true);
  };
  const handleSearchPress = () => {
    setSearchBottomSheetVisible(true);
  };

  const showDetailScreen = (id: number) => {
    navigation.navigate('FarmerDetail', {id});
  };

  useEffect(() => {
    const handleAddPress = () => {
      navigation.navigate('FarmerAdd', {});
    };
    navigation.setOptions({
      headerRight: () =>
        farmerListHeaderRight({
          isFilterApplied,
          isSearchApplied,
          handleFilterPress,
          handleSearchPress,
          handleAddPress,
        }),
    });
  }, [isFilterApplied, isSearchApplied, navigation]);

  const initialLoad = useRef(false);
  const prevSearchText = useRef(searchText);
  const prevFilters = useRef({...filters});
  useEffect(() => {
    const fetchProcessing = async () => {
      await fetchData(filters, searchText);
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
      !areLocationFiltersEqual(filters, prevFilters.current)
    ) {
      fetchProcessing();
    }
  }, [fetchData, filters, searchText, refresh]);

  return (
    <View style={styles.container}>
      <FlatList
        data={farmers}
        renderItem={({item}) => <Item data={item} onPress={showDetailScreen} />}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={[
              theme.fonts.titleLarge,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Farmers not found
          </Text>
        }
        contentContainerStyle={!farmers.length && styles.noData}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={setRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />
      <LocationFilterSheet
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
    </View>
  );
};

export default FarmerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noData: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  row: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

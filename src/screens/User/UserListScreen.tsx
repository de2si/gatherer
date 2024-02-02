// UserListScreen.tsx

import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl} from 'react-native-gesture-handler';
import {Avatar, Card, Snackbar, Text, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

// store
import {UserPreview, useUserStore} from '@hooks/useUserStore';
import {useAuthStore} from '@hooks/useAuthStore';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';

// components
import FilterSheet, {filterDefaultValues} from '@components/FilterSheet';
import SearchSheet from '@components/SearchSheet';
import {ListScreenHeaderRight} from '@components/ListScreenHeaderRight';

// hooks
import useSnackbar from '@hooks/useSnackbar';

//types
import {UserType} from '@helpers/constants';

const Item = ({
  data: {id, name, photo, phone, projects},
  onPress,
}: {
  data: UserPreview;
  onPress: any;
}) => (
  <Card mode="elevated" onPress={() => onPress(id)}>
    <Card.Content style={styles.row}>
      {photo.url ? (
        <Avatar.Image source={{uri: photo.url}} style={styles.avatar} />
      ) : (
        <Avatar.Text style={styles.avatar} label={name[0]} />
      )}

      <View style={styles.cardTextContent}>
        <View style={styles.cardDataRow}>
          <Text variant="titleSmall">{name}</Text>
          <Text variant="bodySmall">{phone}</Text>
        </View>
        <View style={styles.cardDataRow}>
          {projects.map(project => (
            <Text key={project.id} variant="bodySmall">
              {project.name}
            </Text>
          ))}
        </View>
      </View>
    </Card.Content>
  </Card>
);

type UserListScreenProps = NativeStackScreenProps<
  UserStackScreenProps,
  'UserList'
>;

const UserListScreen: React.FC<UserListScreenProps> = ({
  navigation,
  route: {params},
}) => {
  const userType = params.userType;
  const withAuth = useAuthStore(store => store.withAuth);

  const users = useUserStore(store => store.data);
  const fetchData = useUserStore(store => store.fetchData);
  const refresh = useUserStore(store => store.refresh);
  const setRefresh = useUserStore(store => store.setRefresh);
  const theme = useTheme();
  const [filterBottomSheetVisible, setFilterBottomSheetVisible] =
    useState(false);
  const [searchBottomSheetVisible, setSearchBottomSheetVisible] =
    useState(false);
  const [filters, setFilters] = useState(filterDefaultValues);
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
    navigation.navigate('UserDetail', {id, userType});
  };

  useEffect(() => {
    const handleAddPress = () => {
      navigation.navigate('UserAdd', {variant: 'add', userType});
    };
    navigation.setOptions({
      headerRight: () =>
        ListScreenHeaderRight({
          showFilterBtn: userType !== UserType.ADMIN,
          isFilterApplied,
          isSearchApplied,
          handleFilterPress,
          handleSearchPress,
          handleSearchClearPress,
          handleAddPress,
        }),
    });
  }, [isFilterApplied, isSearchApplied, navigation, userType]);

  const initialLoad = useRef(false);
  const prevSearchText = useRef(searchText);
  const prevFilters = useRef({...filters});
  useEffect(() => {
    const fetchProcessing = async () => {
      try {
        setLoading(true);
        await withAuth(async () => {
          await fetchData(userType, filters, searchText);
        });
      } catch (error) {
        let message = getErrorMessage(error);
        typeof message === 'string'
          ? showSnackbar(message)
          : showSnackbar('Error in getting users');
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
    if (refresh[userType]) {
      fetchProcessing();
    }

    // Call fetchProcessing when searchText or filters change
    if (
      searchText !== prevSearchText.current ||
      !areFiltersEqual(filters, prevFilters.current)
    ) {
      fetchProcessing();
    }
  }, [
    fetchData,
    filters,
    searchText,
    refresh,
    withAuth,
    showSnackbar,
    userType,
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users[userType]}
        renderItem={({item}) => <Item data={item} onPress={showDetailScreen} />}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text
            style={[
              theme.fonts.titleLarge,
              {color: theme.colors.onSurfaceVariant},
            ]}>
            Users not found
          </Text>
        }
        contentContainerStyle={!users[userType].length && styles.noData}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setRefresh(userType)}
            colors={[theme.colors.primary]}
          />
        }
      />
      <FilterSheet
        variant="(SD)BP"
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
        helperText={'\n• Search using name\n• Search using phone number'}
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

export default UserListScreen;

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

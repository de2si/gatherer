// UserListScreen.tsx

import {FlatList, Pressable, RefreshControl, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Card, Snackbar, useTheme} from 'react-native-paper';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

// store
import {UserPreview, useUserStore} from '@hooks/useUserStore';
import {useAuthStore} from '@hooks/useAuthStore';

// helpers
import {areFiltersEqual} from '@helpers/comparators';
import {getErrorMessage} from '@helpers/formHelpers';
import {handleDialPress} from '@components/FarmerListItem';
import {maskPhoneNumber} from '@helpers/formatters';

// components
import FilterSheet, {filterDefaultValues} from '@components/FilterSheet';
import {ListScreenHeaderRight} from '@components/ListScreenHeaderRight';
import {PhoneIcon} from '@components/icons/PhoneIcon';
import {Text} from '@components/Text';
import ImageWrapper from '@components/ImageWrapper';
import ExpandableSearch from '@components/ExpandableSearch';

// hooks
import useSnackbar from '@hooks/useSnackbar';

//types
import {UserType} from '@helpers/constants';

// styles
import {
  cardStyles,
  commonStyles,
  fontStyles,
  spacingStyles,
} from '@styles/common';

interface ItemProps {
  data: UserPreview;
  onPress: any;
  color: string;
  borderColor: string;
}

const Item = ({
  data: {id, name, photo, code, phone, projects},
  onPress,
  color,
  borderColor,
}: ItemProps) => (
  <Card
    mode="contained"
    onPress={() => onPress(id)}
    style={[cardStyles.card, {borderColor}, spacingStyles.mh16]}>
    <Card.Content style={cardStyles.cardContent}>
      {photo.url ? (
        <ImageWrapper
          flavor="avatar"
          value={photo}
          size={70}
          style={spacingStyles.mr16}
        />
      ) : (
        <Avatar.Text style={spacingStyles.mr16} label={name[0]} />
      )}

      <View style={commonStyles.flex1}>
        <View style={cardStyles.cardDataRow}>
          <Text variant="bodyXl" style={{color}}>
            {name}
          </Text>
          <Text variant="bodyXl" style={{color}}>
            {code}
          </Text>
        </View>
        <View style={cardStyles.cardDataRow}>
          <View style={commonStyles.row}>
            <Text variant="bodySmall" style={{color: borderColor}}>
              {projects.length ? projects[0].name : ''}
              {projects.length > 1 ? `+ ${projects.length - 1}  projects` : ''}
            </Text>
          </View>
          <Pressable
            style={cardStyles.cardSideItem}
            onPress={() => handleDialPress(phone)}>
            <PhoneIcon height={24} width={24} color={color} />
            <Text variant="bodyLarge" style={[{color}, fontStyles.regularText]}>
              {maskPhoneNumber(phone)}
            </Text>
          </Pressable>
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
  const [expandSearch, setExpandSearch] = useState(false);
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

  const showDetailScreen = (id: number) => {
    navigation.navigate('UserDetail', {id, userType});
  };

  useEffect(() => {
    const handleSearchPress = () => {
      setExpandSearch(val => !val);
    };
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
          handleAddPress,
          theme,
        }),
    });
  }, [isFilterApplied, isSearchApplied, navigation, theme, userType]);

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
    <View style={commonStyles.flex1}>
      <ExpandableSearch visible={expandSearch} applySearch={setSearchText} />
      <FlatList
        data={users[userType]}
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
            Users not found
          </Text>
        }
        contentContainerStyle={
          !users[userType].length && commonStyles.centeredContainer
        }
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

import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

// icons
import {FilterIcon} from '@components/icons/FilterIcon';
import {SearchIcon} from '@components/icons/SearchIcon';
import {AddIcon} from '@components/icons/AddIcon';

interface ListScreenHeaderRightProps {
  showFilterBtn?: boolean;
  isFilterApplied?: boolean;
  isSearchApplied?: boolean;
  handleFilterPress?: () => void;
  handleSearchPress?: () => void;
  handleAddPress?: () => void;
}

export const ListScreenHeaderRight = ({
  showFilterBtn = true,
  isFilterApplied = false,
  isSearchApplied = false,
  handleFilterPress = () => {},
  handleSearchPress = () => {},
  handleAddPress = () => {},
}: ListScreenHeaderRightProps) => {
  const theme = useTheme();
  const bgColor = (applied: boolean) =>
    applied ? theme.colors.secondary : theme.colors.background;
  const iconColor = (applied: boolean) =>
    applied ? theme.colors.onSecondary : theme.colors.primary;
  return (
    <>
      {showFilterBtn && (
        <Pressable
          onPress={handleFilterPress}
          style={[
            {backgroundColor: bgColor(isFilterApplied)},
            styles.pressable,
          ]}>
          <FilterIcon
            height={24}
            width={24}
            color={iconColor(isFilterApplied)}
          />
        </Pressable>
      )}
      <Pressable
        onPress={handleSearchPress}
        style={[
          {backgroundColor: bgColor(isSearchApplied)},
          styles.pressable,
          isSearchApplied ? styles.searchApplied : styles.searchUnapplied,
        ]}>
        <SearchIcon
          height={isSearchApplied ? 24 : 32}
          width={isSearchApplied ? 24 : 32}
          color={iconColor(isSearchApplied)}
        />
      </Pressable>
      <Pressable onPress={handleAddPress} style={styles.pressable}>
        <AddIcon height={24} width={24} color={iconColor(false)} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  pressable: {
    padding: 8,
    borderRadius: 500,
  },
  searchApplied: {
    margin: 8,
  },
  searchUnapplied: {
    marginLeft: 8,
    marginTop: 4,
  },
});

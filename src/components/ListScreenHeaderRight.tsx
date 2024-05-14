import React from 'react';
import {Pressable} from 'react-native';
import {MD3Theme} from 'react-native-paper';

// icons
import {FilterIcon} from '@components/icons/FilterIcon';
import {SearchIcon} from '@components/icons/SearchIcon';
import {AddIcon} from '@components/icons/AddIcon';
import {headerStyles} from '@styles/common';

interface ListScreenHeaderRightProps {
  showFilterBtn?: boolean;
  showAddBtn?: boolean;
  isFilterApplied?: boolean;
  isSearchApplied?: boolean;
  handleFilterPress?: () => void;
  handleSearchPress?: () => void;
  handleAddPress?: () => void;
  theme: MD3Theme;
}

export const ListScreenHeaderRight = ({
  showFilterBtn = true,
  showAddBtn = true,
  isFilterApplied = false,
  isSearchApplied = false,
  handleFilterPress = () => {},
  handleSearchPress = () => {},
  handleAddPress = () => {},
  theme,
}: ListScreenHeaderRightProps) => {
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
            headerStyles.pressable,
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
          headerStyles.pressable,
          isSearchApplied
            ? headerStyles.searchApplied
            : headerStyles.searchUnapplied,
        ]}>
        <SearchIcon
          height={isSearchApplied ? 24 : 32}
          width={isSearchApplied ? 24 : 32}
          color={iconColor(isSearchApplied)}
        />
      </Pressable>
      {showAddBtn && (
        <Pressable onPress={handleAddPress} style={headerStyles.pressable}>
          <AddIcon height={24} width={24} color={iconColor(false)} />
        </Pressable>
      )}
    </>
  );
};

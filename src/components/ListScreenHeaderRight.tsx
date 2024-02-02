import React from 'react';
import {Button, IconButton} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SearchOffIcon = (props: any) => (
  <MaterialIcon name="search-off" {...props} />
);

export const ListScreenHeaderRight = ({
  showFilterBtn = true,
  isFilterApplied = false,
  isSearchApplied = false,
  handleFilterPress = () => {},
  handleSearchPress = () => {},
  handleSearchClearPress = () => {},
  handleAddPress = () => {},
}: {
  showFilterBtn?: boolean;
  isFilterApplied?: boolean;
  isSearchApplied?: boolean;
  handleFilterPress?: () => void;
  handleSearchPress?: () => void;
  handleSearchClearPress?: () => void;
  handleAddPress?: () => void;
}) => {
  return (
    <>
      {showFilterBtn && (
        <IconButton
          icon="filter-outline"
          size={24}
          onPress={handleFilterPress}
          selected={isFilterApplied}
          mode={isFilterApplied ? 'contained' : undefined}
        />
      )}
      <IconButton
        icon="magnify"
        size={24}
        onPress={handleSearchPress}
        selected={isSearchApplied}
        mode={isSearchApplied ? 'contained' : undefined}
      />
      {isSearchApplied && (
        <IconButton
          icon={SearchOffIcon}
          size={24}
          onPress={handleSearchClearPress}
          mode="contained-tonal"
        />
      )}
      <Button mode="contained-tonal" onPress={handleAddPress}>
        Add
      </Button>
    </>
  );
};

// SearchSheet.tsx

import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  Portal,
  Searchbar,
  IconButton,
  HelperText,
  useTheme,
} from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

// types
interface SearchSheetProps {
  visible: boolean;
  searchText: string;
  helperText?: string;
  onClose: () => void;
  clearSearch?: () => void;
  applySearch?: (searchText: string) => void;
}

const SearchSheet = ({
  visible = false,
  searchText = '',
  helperText = 'Type to search',
  onClose = () => {},
  clearSearch = () => {},
  applySearch = () => {},
}: SearchSheetProps) => {
  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const theme = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = React.useState(searchText);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleBottomSheetClose = () => {
    setSearchQuery(searchText);
    onClose();
  };

  const onSubmit = () => {
    bottomSheetRef?.current?.close();
    handleBottomSheetClose();
    applySearch(searchQuery);
  };

  const onClear = () => {
    setSearchQuery('');
    clearSearch();
  };
  const renderSearchButton = () => {
    return (
      <>
        {searchQuery && <IconButton icon="close" onPress={onClear} />}
        <IconButton
          icon="account-search"
          mode="contained-tonal"
          onPress={onSubmit}
          selected
        />
      </>
    );
  };

  return (
    <>
      {visible && (
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['40%']}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={handleBottomSheetClose}>
            <BottomSheetView style={styles.container}>
              <Searchbar
                placeholder="Search"
                value={searchQuery}
                onChangeText={onChangeSearch}
                right={renderSearchButton}
                onBlur={onSubmit}
                autoFocus={true}
              />
              <HelperText
                type="info"
                padding="none"
                style={[
                  styles.helperText,
                  {color: theme.colors.secondary},
                  theme.fonts.bodyMedium,
                ]}>
                {helperText}
              </HelperText>
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  helperText: {
    paddingTop: 0,
    paddingLeft: 36,
  },
});

export default SearchSheet;

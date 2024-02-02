// FilterSheet.tsx

import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Portal, Button, useTheme} from 'react-native-paper';
import {useReducedMotion} from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

// form
import {useForm} from 'react-hook-form';
import {
  FormStateSelectInput,
  FormDistrictSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
  FormProjectSelectInput,
  FormLoadedLocationSelectInput,
} from '@components/FormSelectInputCollection';

// stores
import {useProfileStore} from '@hooks/useProfileStore';
import {
  useBlockStore,
  useDistrictStore,
  useVillageStore,
} from '@hooks/locationHooks';

// types
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {Filter, LocationFilter} from '@typedefs/common';
import {UserType} from '@helpers/constants';

interface FilterSheetProps {
  visible: boolean;
  filterValues: Filter;
  variant?: '(SD)BV' | '(SD)BVP' | '(SD)BP' | '(SD)B';
  onClose: () => void;
  clearFilters?: () => void;
  applyFilters?: (data: Filter) => void;
}

// constants
export const locationFilterDefaultValues: LocationFilter = {
  stateCodes: [],
  districtCodes: [],
  blockCodes: [],
  villageCodes: [],
};
export const filterDefaultValues: Filter = {
  ...locationFilterDefaultValues,
  projectCodes: [],
};

const FilterSheet = ({
  visible = false,
  filterValues = filterDefaultValues,
  variant = '(SD)BV',
  onClose = () => {},
  clearFilters = () => {},
  applyFilters = () => {},
}: FilterSheetProps) => {
  let loggedUser = useProfileStore(store => store.data);

  const filterDistrictCodes = useDistrictStore(store => store.getFilteredCodes);
  const filterBlockCodes = useBlockStore(store => store.getFilteredCodes);
  const filterVillageCodes = useVillageStore(store => store.getFilteredCodes);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const reducedMotion = useReducedMotion();
  const theme = useTheme();

  const {handleSubmit, control, watch, reset, setValue} = useForm<Filter>({
    defaultValues: filterValues,
  });

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const handleBottomSheetClose = () => {
    reset(filterValues);
    onClose();
  };

  const onSubmit = (data: Filter) => {
    applyFilters(data);
    onClose();
  };

  const onClear = () => {
    reset(filterDefaultValues);
    clearFilters();
  };

  const stateCodes = watch('stateCodes');
  const districtCodes = watch('districtCodes');
  const blockCodes = watch('blockCodes');
  const villageCodes = watch('villageCodes');

  useEffect(() => {
    setValue(
      'districtCodes',
      filterDistrictCodes(stateCodes ?? [], districtCodes ?? []),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDistrictCodes, setValue, stateCodes]);
  // Intentionally removing districtCodes from the dependency array

  useEffect(() => {
    setValue(
      'blockCodes',
      filterBlockCodes(districtCodes ?? [], blockCodes ?? []),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBlockCodes, setValue, districtCodes]);
  // Intentionally removing blockCodes from the dependency array

  useEffect(() => {
    setValue(
      'villageCodes',
      filterVillageCodes(blockCodes ?? [], villageCodes ?? []),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVillageCodes, setValue, blockCodes]);
  // Intentionally removing villageCodes from the dependency array

  return (
    <>
      {visible && (
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['25%', '50%', '75%', '95%']}
            index={2}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={handleBottomSheetClose}
            animateOnMount={!reducedMotion}>
            <BottomSheetScrollView>
              <BottomSheetView style={styles.formContainer}>
                {variant.includes('(SD)B') &&
                  (loggedUser.userType === UserType.ADMIN ? (
                    <>
                      <FormStateSelectInput
                        name="stateCodes"
                        control={control}
                        variant="multiple"
                      />
                      <FormDistrictSelectInput
                        name="districtCodes"
                        control={control}
                        variant="multiple"
                        codes={stateCodes}
                      />
                      <FormBlockSelectInput
                        name="blockCodes"
                        control={control}
                        variant="multiple"
                        codes={districtCodes}
                      />
                    </>
                  ) : (
                    <FormLoadedLocationSelectInput
                      name="blockCodes"
                      control={control}
                      variant="multiple"
                      data={loggedUser.blocks}
                      placeholder="Select blocks"
                    />
                  ))}
                {variant.includes('V') && (
                  <FormVillageSelectInput
                    name="villageCodes"
                    control={control}
                    variant="multiple"
                    codes={blockCodes}
                  />
                )}
                {variant.includes('P') && (
                  <FormProjectSelectInput
                    name="projectCodes"
                    control={control}
                    variant="multiple"
                  />
                )}
                <BottomSheetView style={styles.row}>
                  <Button
                    onPress={onClear}
                    style={styles.button}
                    textColor={theme.colors.onTertiaryContainer}
                    buttonColor={theme.colors.tertiaryContainer}>
                    Clear
                  </Button>
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    mode="contained"
                    style={styles.button}>
                    Apply filter
                  </Button>
                </BottomSheetView>
              </BottomSheetView>
            </BottomSheetScrollView>
          </BottomSheet>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    marginHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'center',
    columnGap: 24,
    alignItems: 'flex-end',
  },
  button: {
    minWidth: 100,
  },
});

export default FilterSheet;

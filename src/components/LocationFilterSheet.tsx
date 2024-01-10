// LocationFilterSheet.tsx

import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Portal, Button, useTheme} from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

// form
import {useForm} from 'react-hook-form';
import {
  FormStateSelectInput,
  FormDistrictSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
} from '@components/FormSelectInputCollection';
import {
  useBlockStore,
  useDistrictStore,
  useVillageStore,
} from '@hooks/locationHooks';
import {LocationFilterGroup} from '@helpers/formHelpers';

// types

interface LocationFilterSheetProps {
  visible: boolean;
  filterValues: LocationFilterGroup;
  onClose: () => void;
  clearFilters?: () => void;
  applyFilters?: (data: LocationFilterGroup) => void;
}

// constants
const defaultValues: LocationFilterGroup = {
  stateCodes: [],
  districtCodes: [],
  blockCodes: [],
  villageCodes: [],
};
export {defaultValues as locationFilterDefaultValues};

const LocationFilterSheet = ({
  visible = false,
  filterValues = defaultValues,
  onClose = () => {},
  clearFilters = () => {},
  applyFilters = () => {},
}: LocationFilterSheetProps) => {
  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const filterDistrictCodes = useDistrictStore(store => store.getFilteredCodes);
  const filterBlockCodes = useBlockStore(store => store.getFilteredCodes);
  const filterVillageCodes = useVillageStore(store => store.getFilteredCodes);

  const handleBottomSheetClose = () => {
    reset(filterValues);
    onClose();
  };

  const onSubmit = (data: LocationFilterGroup) => {
    bottomSheetRef?.current?.close();
    handleBottomSheetClose();
    applyFilters(data);
  };

  const onClear = () => {
    reset(defaultValues);
    clearFilters();
  };

  const {handleSubmit, control, watch, reset, setValue} =
    useForm<LocationFilterGroup>({defaultValues: filterValues});

  const stateCodes = watch('stateCodes');
  const districtCodes = watch('districtCodes');
  const blockCodes = watch('blockCodes');
  const villageCodes = watch('villageCodes');

  useEffect(() => {
    setValue('districtCodes', filterDistrictCodes(stateCodes, districtCodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDistrictCodes, setValue, stateCodes]); // Intentionally removing districtCodes from the dependency array

  useEffect(() => {
    setValue('blockCodes', filterBlockCodes(districtCodes, blockCodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBlockCodes, setValue, districtCodes]); // Intentionally removing blockCodes from the dependency array

  useEffect(() => {
    setValue('villageCodes', filterVillageCodes(blockCodes, villageCodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVillageCodes, setValue, blockCodes]); // Intentionally removing villageCodes from the dependency array

  const theme = useTheme();
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
            onClose={handleBottomSheetClose}>
            <BottomSheetScrollView>
              <BottomSheetView style={styles.formContainer}>
                <FormStateSelectInput
                  name="stateCodes"
                  control={control}
                  variant="multiple"
                />
                <FormDistrictSelectInput
                  name="districtCodes"
                  control={control}
                  variant="multiple"
                  codes={watch('stateCodes')}
                />
                <FormBlockSelectInput
                  name="blockCodes"
                  control={control}
                  variant="multiple"
                  codes={watch('districtCodes')}
                />
                <FormVillageSelectInput
                  name="villageCodes"
                  control={control}
                  variant="multiple"
                  codes={watch('blockCodes')}
                />
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

export default LocationFilterSheet;

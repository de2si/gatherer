import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  FormSelectInput,
  FormSelectInputProps,
} from '@components/FormSelectInput';
import {FieldValues} from 'react-hook-form';
import {Text} from 'react-native-paper';
import {useDistrictStore, useStateStore} from '@hooks/locationHooks';

interface Location {
  code: number;
  name: string;
}

type LocationSelectProps<TForm extends FieldValues = any> = Omit<
  FormSelectInputProps<Location, TForm>,
  'loading' | 'selectProps'
> & {
  codes?: number[];
};

const renderLocationItem = (item: Location) => {
  return (
    <View style={styles.item}>
      <Text>
        {item.code} - {item.name}
      </Text>
    </View>
  );
};

const StateSelect = <TFieldValues extends FieldValues>({
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useStateStore(state => state.loadingState);
  const data = useStateStore(state => state.stateData);
  const fetchFn = useStateStore(state => state.fetchStateData);

  useEffect(() => {
    fetchFn();
  }, [fetchFn]);

  const stateSelectProps = {
    ...{
      data,
      labelField: 'name' as const,
      valueField: 'code' as const,
      placeholder: 'Select state',
      renderItem: renderLocationItem,
    },
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...stateSelectProps}}
      loading={isLoading}
    />
  );
};

const DistrictSelect = <TFieldValues extends FieldValues>({
  codes,
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useDistrictStore(state => state.loadingDistrict);
  const data = useDistrictStore(state => state.districtData);
  const fetchFn = useDistrictStore(state => state.fetchDistrictData);

  useEffect(() => {
    fetchFn(codes);
  }, [fetchFn, codes]);

  const districtSelectProps = {
    ...{
      data,
      labelField: 'name' as const,
      valueField: 'code' as const,
      placeholder: 'Select district',
      renderItem: renderLocationItem,
    },
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...districtSelectProps}}
      loading={isLoading}
    />
  );
};

let styles = StyleSheet.create({
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export {StateSelect, DistrictSelect};

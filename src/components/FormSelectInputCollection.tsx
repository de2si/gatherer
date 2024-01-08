import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FormSelectInput,
  FormSelectInputProps,
} from '@components/FormSelectInput';
import {FieldValues} from 'react-hook-form';
import {Text} from 'react-native-paper';
import {
  Location,
  useBlockStore,
  useDistrictStore,
  useStateStore,
  useVillageStore,
} from '@hooks/locationHooks';

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
  codes: _codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useStateStore(state => state.loading);
  const data = useStateStore(state => state.data);
  const fetchFn = useStateStore(state => state.fetchData);

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
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useDistrictStore(state => state.loading);
  const getData = useDistrictStore(state => state.getItemsByCodes);
  const fetchFn = useDistrictStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    const populateData = async () => {
      try {
        await fetchFn(codes);
        const tempData = getData(codes);
        setLocalData(tempData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    populateData();
  }, [codes, fetchFn, getData]);

  const districtSelectProps = {
    ...{
      data: localData,
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

const BlockSelect = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useBlockStore(state => state.loading);
  const getData = useBlockStore(state => state.getItemsByCodes);
  const fetchFn = useBlockStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    const populateData = async () => {
      try {
        await fetchFn(codes);
        const tempData = getData(codes);
        setLocalData(tempData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    populateData();
  }, [codes, fetchFn, getData]);

  const blockSelectProps = {
    ...{
      data: localData,
      labelField: 'name' as const,
      valueField: 'code' as const,
      placeholder: 'Select block',
      renderItem: renderLocationItem,
    },
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...blockSelectProps}}
      loading={isLoading}
    />
  );
};

const VillageSelect = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const isLoading = useVillageStore(state => state.loading);
  const getData = useVillageStore(state => state.getItemsByCodes);
  const fetchFn = useVillageStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    const populateData = async () => {
      try {
        await fetchFn(codes);
        const tempData = getData(codes);
        setLocalData(tempData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    populateData();
  }, [codes, fetchFn, getData]);

  const villageSelectProps = {
    ...{
      data: localData,
      labelField: 'name' as const,
      valueField: 'code' as const,
      placeholder: 'Select village',
      renderItem: renderLocationItem,
    },
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...villageSelectProps}}
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

export {StateSelect, DistrictSelect, BlockSelect, VillageSelect};

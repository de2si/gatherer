import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import {useAuthStore} from '@hooks/useAuthStore';

type LocationSelectProps<TForm extends FieldValues = any> = Omit<
  FormSelectInputProps<Location, TForm>,
  'loading' | 'selectProps'
> & {
  codes?: number[];
};

const RenderLocationItem = (item: Location) => {
  return (
    <View style={styles.item}>
      <Text>
        {item.code} - {item.name}
      </Text>
    </View>
  );
};

interface RenderLocationSelectInputProps<TFieldValues extends FieldValues> {
  data: Location[];
  placeholder: string;
  otherProps: Omit<
    FormSelectInputProps<Location, TFieldValues>,
    'loading' | 'selectProps'
  >;
  loading: boolean;
}
const RenderLocationSelectInput = <TFieldValues extends FieldValues>({
  data = [],
  placeholder = 'Select',
  otherProps,
  loading,
}: RenderLocationSelectInputProps<TFieldValues>) => {
  const selectProps = {
    data,
    labelField: 'name' as const,
    valueField: 'code' as const,
    placeholder: placeholder,
    renderItem: RenderLocationItem,
  };

  return (
    <FormSelectInput
      {...otherProps}
      selectProps={{...selectProps}}
      loading={loading}
    />
  );
};

const populateData = async (
  codes: number[],
  fetchFn: (codes: number[]) => Promise<void>,
  getData: (codes: number[]) => Location[],
  setLocalData: {
    (value: React.SetStateAction<Location[]>): void;
    (arg0: Location[]): void;
  },
  withAuth: (apiCallback: () => Promise<void>) => Promise<void>,
) => {
  try {
    await withAuth(async () => {
      await fetchFn(codes);
    });
    const tempData = getData(codes);
    setLocalData(tempData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const FormStateSelectInput = <TFieldValues extends FieldValues>({
  codes: _codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const withAuth = useAuthStore(store => store.withAuth);
  const isLoading = useStateStore(state => state.loading);
  const data = useStateStore(state => state.data);
  const fetchFn = useStateStore(state => state.fetchData);

  const fetchStates = useCallback(async () => {
    try {
      await withAuth(fetchFn);
    } catch (error) {}
  }, [fetchFn, withAuth]);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return (
    <RenderLocationSelectInput
      data={data}
      placeholder="Select state"
      otherProps={{...props}}
      loading={isLoading}
    />
  );
};

const FormDistrictSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const isLoading = useDistrictStore(state => state.loading);
  const getData = useDistrictStore(state => state.getItemsByCodes);
  const fetchFn = useDistrictStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    populateData(codes, fetchFn, getData, setLocalData, withAuth);
  }, [codes, fetchFn, getData, withAuth]);

  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select district"
      otherProps={{...props}}
      loading={isLoading}
    />
  );
};

const FormBlockSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const isLoading = useBlockStore(state => state.loading);
  const getData = useBlockStore(state => state.getItemsByCodes);
  const fetchFn = useBlockStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    populateData(codes, fetchFn, getData, setLocalData, withAuth);
  }, [codes, fetchFn, getData, withAuth]);

  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select block"
      otherProps={{...props}}
      loading={isLoading}
    />
  );
};

const FormVillageSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const withAuth = useAuthStore(store => store.withAuth);

  const isLoading = useVillageStore(state => state.loading);
  const getData = useVillageStore(state => state.getItemsByCodes);
  const fetchFn = useVillageStore(state => state.fetchData);
  const [localData, setLocalData] = useState<Location[]>([]);

  useEffect(() => {
    populateData(codes, fetchFn, getData, setLocalData, withAuth);
  }, [codes, fetchFn, getData, withAuth]);

  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select village"
      otherProps={{...props}}
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

export {
  FormStateSelectInput,
  FormDistrictSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
};

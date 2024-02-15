import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native-paper';

// form
import {FieldValues} from 'react-hook-form';
import {
  FormSelectInput,
  FormSelectInputProps,
} from '@components/FormSelectInput';

// types & stores
import {
  Location,
  useBlockStore,
  useDistrictStore,
  useStateStore,
  useVillageStore,
} from '@hooks/locationHooks';
import {useAuthStore} from '@hooks/useAuthStore';
import {Project, useProjectStore} from '@hooks/useProjectStore';

// helpers
import {arraysEqual} from '@helpers/comparators';
import {LV} from '@typedefs/common';

type LocationSelectProps<TForm extends FieldValues = any> = Omit<
  FormSelectInputProps<Location, TForm>,
  'loading' | 'selectProps'
> & {
  codes?: number[];
};

type LoadedLocationSelectProps<TForm extends FieldValues = any> = Omit<
  FormSelectInputProps<Location, TForm>,
  'loading' | 'selectProps'
> & {
  data: Location[];
  placeholder: string;
};

type StandardSelectProps<TForm extends FieldValues = any> = Omit<
  FormSelectInputProps<LV, TForm>,
  'loading' | 'selectProps'
> & {
  data: LV[];
  placeholder: string;
};

const renderSelectItem = (item: {name: string}) => {
  return (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );
};

const renderStandardSelectItem = (item: LV) => {
  return (
    <View style={styles.item}>
      <Text>{item.label}</Text>
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
    searchField: 'name' as const,
    placeholder: placeholder,
    renderItem: renderSelectItem,
  };

  return (
    <FormSelectInput
      {...otherProps}
      selectProps={{...selectProps}}
      loading={loading}
    />
  );
};

const usePopulateData = (
  getData: (codes: number[]) => Location[],
  fetchFn: (codes: number[]) => Promise<void>,
) => {
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState<Location[]>([]);
  const [codes, setCodes] = useState<number[]>([]);

  const updateCodes = useCallback(
    (newCodes: number[]) => {
      if (!arraysEqual(codes, newCodes)) {
        setCodes(newCodes);
      }
    },
    [codes],
  );

  const populateData = useCallback(async () => {
    try {
      setLoading(true);
      if (codes.length) {
        await withAuth(async () => {
          await fetchFn(codes);
        });
        setLocalData(getData(codes));
      } else {
        setLocalData([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [codes, fetchFn, getData, withAuth]);

  useEffect(() => {
    populateData();
  }, [populateData]);

  return {
    loading,
    localData,
    updateCodes,
  };
};

const FormStateSelectInput = <TFieldValues extends FieldValues>({
  codes: _codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const withAuth = useAuthStore(store => store.withAuth);
  const data = useStateStore(state => state.data);
  const fetchFn = useStateStore(state => state.fetchData);
  const [loading, setLoading] = useState(false);

  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      await withAuth(fetchFn);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [fetchFn, withAuth]);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return (
    <RenderLocationSelectInput
      data={data}
      placeholder="Select state"
      otherProps={{...props}}
      loading={loading}
    />
  );
};

const FormDistrictSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const getData = useDistrictStore(state => state.getItemsByCodes);
  const fetchFn = useDistrictStore(state => state.fetchData);

  const {loading, localData, updateCodes} = usePopulateData(getData, fetchFn);
  updateCodes(codes);

  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select district"
      otherProps={{...props}}
      loading={loading}
    />
  );
};

const FormBlockSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const getData = useBlockStore(state => state.getItemsByCodes);
  const fetchFn = useBlockStore(state => state.fetchData);

  const {loading, localData, updateCodes} = usePopulateData(getData, fetchFn);
  updateCodes(codes);
  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select block"
      otherProps={{...props}}
      loading={loading}
    />
  );
};

const FormVillageSelectInput = <TFieldValues extends FieldValues>({
  codes = [],
  ...props
}: LocationSelectProps<TFieldValues>) => {
  const getData = useVillageStore(state => state.getItemsByCodes);
  const fetchFn = useVillageStore(state => state.fetchData);

  const {loading, localData, updateCodes} = usePopulateData(getData, fetchFn);
  updateCodes(codes);

  return (
    <RenderLocationSelectInput
      data={localData}
      placeholder="Select village"
      otherProps={{...props}}
      loading={loading}
    />
  );
};

const FormProjectSelectInput = <TFieldValues extends FieldValues>({
  ...props
}: Omit<
  FormSelectInputProps<Project, TFieldValues>,
  'loading' | 'selectProps'
>) => {
  const withAuth = useAuthStore(store => store.withAuth);
  const data = useProjectStore(state => state.data);
  const fetchFn = useProjectStore(state => state.fetchData);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      await withAuth(fetchFn);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [fetchFn, withAuth]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectProps = {
    data,
    labelField: 'name' as const,
    valueField: 'id' as const,
    searchField: 'name' as const,
    placeholder: 'Select project',
    renderItem: renderSelectItem,
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...selectProps}}
      loading={loading}
    />
  );
};

const FormLoadedLocationSelectInput = <TFieldValues extends FieldValues>({
  data,
  placeholder,
  ...props
}: LoadedLocationSelectProps<TFieldValues>) => {
  return (
    <RenderLocationSelectInput
      data={data}
      placeholder={placeholder}
      otherProps={props}
      loading={false}
    />
  );
};

const FormStandardSelectInput = <TFieldValues extends FieldValues>({
  data,
  placeholder,
  ...props
}: StandardSelectProps<TFieldValues>) => {
  const selectProps = {
    data,
    labelField: 'label' as const,
    valueField: 'value' as const,
    searchField: 'label' as const,
    placeholder,
    renderItem: renderStandardSelectItem,
  };

  return (
    <FormSelectInput
      {...props}
      selectProps={{...selectProps}}
      loading={false}
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
  FormProjectSelectInput,
  FormLoadedLocationSelectInput,
  FormStandardSelectInput,
};

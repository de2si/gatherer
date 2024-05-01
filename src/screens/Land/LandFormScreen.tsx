// LandFormScreen.tsx

import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Portal, Snackbar, Text} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// form and form components
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';
import FormRadioInput from '@components/FormRadioInput';
import FormImageInput from '@components/FormImageInput/FormImageInput';
import FormFarmerInput from '@components/FormFarmerInput';
import FormCoordinatesInput from '@components/FormCoordinatesInput';
import {
  FormDistrictSelectInput,
  FormStateSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
  FormLoadedLocationSelectInput,
  FormStandardSelectInput,
} from '@components/FormSelectInputCollection';

// helpers
import {multiImageValidator, nameValidator} from '@helpers/validators';
import {
  convertToSquareMeters,
  formatToUrlKey,
  getErrorMessage,
  getFieldErrors,
  removeKeys,
  transformToLabelValuePair,
} from '@helpers/formHelpers';
import {AreaUnit, Ownership, UserType} from '@helpers/constants';
import {arePicturesEqual} from '@helpers/comparators';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useFormErrorScroll} from '@hooks/useFormErrorScroll';
import {ApiLand, useLandStore} from '@hooks/useLandStore';
import {useAuthStore} from '@hooks/useAuthStore';
import {useProfileStore} from '@hooks/useProfileStore';

// api
import {api} from '@api/axios';

// types
import {FormImage} from '@typedefs/common';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LandStackScreenProps} from '@nav/LandStack';

// types
interface LandBasicForm {
  ownership_type: Ownership;
  farmer: {id: number; name: string} | null;
  geo_trace?: string;
  area: number;
  area_unit: AreaUnit;
  khasra_number: string;
  pictures?: FormImage[];
  farm_workers: number;
  state?: number;
  district?: number;
  block: number;
  village: number;
}

const farmerValidator = Yup.object().shape({
  id: Yup.number()
    .required('Farmer is required')
    .positive('Farmer must be valid'),
  name: nameValidator,
});

// define validation schema(s)
const landBasicValidation = {
  ownership_type: Yup.string()
    .oneOf(Object.values(Ownership), 'Invalid ownership')
    .required('Ownership is required'),
  farmer: farmerValidator.when('ownership_type', ([ownership], _schema) => {
    return ownership === Ownership.COMMUNITY
      ? farmerValidator.nullable()
      : farmerValidator.required('Farmer is required');
  }),
  geo_trace: Yup.string().required('Geo-trace is required'),
  area: Yup.number()
    .required('Area is required')
    .positive('Area must be valid')
    .test('is-number', 'Area must be valid', value => !isNaN(value)),
  area_unit: Yup.string()
    .required('Unit is required')
    .oneOf(Object.values(AreaUnit), 'Invalid unit'),
  khasra_number: Yup.string().required('Khasra no. is required'),
  pictures: multiImageValidator,
  farm_workers: Yup.number()
    .required('No. of farm workers is required')
    .positive('Farm workers must be valid')
    .test('is-number', 'Farm workers must be valid', value => !isNaN(value)),
  state: Yup.number(),
  district: Yup.number(),
  block: Yup.number()
    .required('Block is required')
    .positive('Block code must be valid'),
  village: Yup.number()
    .required('Village is required')
    .positive('Village code must be valid'),
};

const stateDistrictValidation = {
  state: Yup.number()
    .required('State is required')
    .positive('State code must be positive'),
  district: Yup.number()
    .required('District is required')
    .positive('District code must be valid'),
};

const getLandValidationSchema = (
  loggedUserType: UserType,
): Yup.ObjectSchema<LandBasicForm> => {
  let landSchema = landBasicValidation;
  if (loggedUserType === UserType.ADMIN) {
    landSchema = {...landSchema, ...stateDistrictValidation};
  }
  return Yup.object().shape(landSchema);
};

// define default values
const landAddDefaultValues: Partial<LandBasicForm> = {
  state: 23,
  ownership_type: Ownership.PRIVATE,
  geo_trace: '',
  khasra_number: '',
  farmer: null,
  area_unit: AreaUnit.SquareMeters,
};
const getLandEditDefaultValues = ({
  ownership_type,
  farmer,
  farmer_name,
  geo_trace,
  area,
  khasra_number,
  pictures,
  farm_workers,
  village,
}: ApiLand): LandBasicForm => {
  return {
    ownership_type,
    farmer: {id: farmer, name: farmer_name},
    geo_trace,
    area,
    area_unit: AreaUnit.SquareMeters,
    khasra_number,
    farm_workers,
    state: village.block.district.state.code,
    district: village.block.district.code,
    block: village.block.code,
    village: village.code,
    pictures: pictures.map(pic => ({uri: pic.url, hash: pic.hash})),
  };
};

const prepareAddFormData = (formData: LandBasicForm) => {
  return {
    ...removeKeys(formData, [
      'state',
      'district',
      'block',
      'farmer',
      'pictures',
      'area',
      'area_unit',
    ]),
    area: convertToSquareMeters(formData.area, formData.area_unit),
    farmer_id: formData.farmer?.id ?? null,
    pictures: JSON.stringify(formData.pictures?.map(formatToUrlKey)),
  };
};
const prepareEditFormData = (
  formData: LandBasicForm,
  initialValues: LandBasicForm,
) => {
  const changedFields = Object.keys(formData).reduce((acc, key) => {
    let formKey = key as keyof LandBasicForm;
    if (formKey in ['state', 'district', 'block']) {
      // do nothing
    } else if (formKey === 'farmer') {
      // if (formData.farmer?.id !== initialValues.farmer?.id) {
      acc.farmer_id = formData.farmer?.id;
      // }
    } else if (formKey === 'pictures') {
      if (!arePicturesEqual(formData.pictures, initialValues.pictures)) {
        acc.pictures = JSON.stringify(formData.pictures?.map(formatToUrlKey));
      }
    } else if (formKey === 'area' || formKey === 'area_unit') {
      if (
        formData.area !== initialValues.area ||
        formData.area_unit !== initialValues.area_unit
      ) {
        acc.area = convertToSquareMeters(formData.area, formData.area_unit);
      }
    } else if (formData[formKey] !== initialValues[formKey]) {
      acc[formKey] = formData[formKey];
    }
    return acc;
  }, {} as Record<string, any>);
  return changedFields;
};

type LandFormScreenProps = NativeStackScreenProps<
  LandStackScreenProps,
  'LandAdd' | 'LandEdit'
>;

const LandFormScreen: React.FC<LandFormScreenProps> = ({route, navigation}) => {
  const {variant} = route.params;
  const land = 'land' in route.params ? route.params.land : undefined;

  const withAuth = useAuthStore(store => store.withAuth);
  let loggedUser = useProfileStore(store => store.data);

  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');

  const setRefresh = useLandStore(store => store.setRefresh);

  const defaultValues =
    variant === 'edit' && land
      ? getLandEditDefaultValues(land)
      : landAddDefaultValues;

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    setValue,
    formState: {errors},
  } = useForm<LandBasicForm>({
    defaultValues,
    resolver: yupResolver(getLandValidationSchema(loggedUser.userType)),
  });

  const state = watch('state');
  const district = watch('district');
  const block = watch('block');
  const initialStateChanged = useRef(false);
  const initialDistrictChanged = useRef(false);
  const initialBlockChanged = useRef(false);
  useEffect(() => {
    if (initialStateChanged.current) {
      setValue('district', 0);
    } else {
      initialStateChanged.current = true;
    }
  }, [setValue, state]);

  useEffect(() => {
    if (initialDistrictChanged.current) {
      setValue('block', 0);
    } else {
      initialDistrictChanged.current = true;
    }
  }, [setValue, district]);

  useEffect(() => {
    if (initialBlockChanged.current) {
      setValue('village', 0);
    } else {
      initialBlockChanged.current = true;
    }
  }, [setValue, block]);

  const {
    scrollViewRef,
    fieldOrder,
    handleLayout,
    manualScroll,
    setManualScroll,
    scrollToFirstError,
  } = useFormErrorScroll();

  useEffect(() => {
    scrollToFirstError(errors);
  }, [errors, scrollToFirstError]);

  useEffect(() => {
    if (manualScroll) {
      scrollToFirstError(errors);
      setManualScroll(false);
    }
  }, [errors, manualScroll, scrollToFirstError, setManualScroll]);

  if (variant === 'edit' && !land) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge">Land not found error</Text>
      </View>
    );
  }

  const onSubmit = async (formData: LandBasicForm) => {
    try {
      setLoading(true);
      if (variant === 'add') {
        await withAuth(async () => {
          try {
            const result = await api.post(
              'land-parcels/',
              prepareAddFormData(formData),
            );
            if (result.status === 201) {
              reset(landAddDefaultValues);
              showSnackbar('Land added successfully');
              setRefresh();
              setTimeout(() => {
                navigation.replace('LandDetail', {
                  id: result.data.land_id,
                  land: result.data,
                });
              }, 2000);
            }
          } catch (error) {
            throw error;
          }
        });
      } else if (variant === 'edit' && land) {
        const dataToUpdate = prepareEditFormData(
          formData,
          defaultValues as LandBasicForm,
        );
        if (!Object.keys(dataToUpdate).length) {
          throw new Error('No changes made');
        }
        await withAuth(async () => {
          try {
            const result = await api.patch(
              `land-parcels/${land.id}/`,
              dataToUpdate,
            );
            if (result.status === 200) {
              showSnackbar('Land updated successfully');
              setRefresh();
              setTimeout(() => {
                navigation.navigate('LandDetail', {
                  id: result.data.land_id,
                  land: result.data,
                });
              }, 2000);
            }
          } catch (error) {
            throw error;
          }
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (typeof errorMessage === 'string') {
        showSnackbar(errorMessage);
      } else {
        let picErrCount = 0;
        type FormFieldName = keyof LandBasicForm;
        getFieldErrors(errorMessage).forEach(
          ({fieldName, fieldErrorMessage}) => {
            if (
              fieldName === 'pictures' &&
              fieldErrorMessage.includes('already exists')
            ) {
              picErrCount += 1;
              setError(fieldName, {
                message: `${picErrCount} image${
                  picErrCount > 1 ? 's' : ''
                } already exist${picErrCount > 1 ? '' : 's'}`,
              });
            } else if (fieldOrder.current.includes(fieldName)) {
              setError(fieldName as FormFieldName, {
                message: fieldErrorMessage,
              });
            }
          },
        );
        setManualScroll(true);
      }
    } finally {
      setLoading(false);
    }
  };

  let ownership_type = watch('ownership_type');
  return (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FormTextInput
            name="khasra_number"
            control={control}
            inputProps={{
              placeholder: 'Khasra no.',
              autoCapitalize: 'characters',
            }}
            onLayout={handleLayout}
          />
          <FormRadioInput
            name="ownership_type"
            control={control}
            label="Ownership type"
            options={transformToLabelValuePair(Object.values(Ownership))}
            onLayout={handleLayout}
          />
          {ownership_type === Ownership.PRIVATE && (
            <FormFarmerInput
              name="farmer"
              control={control}
              onLayout={handleLayout}
            />
          )}
          <FormCoordinatesInput
            name="geo_trace"
            control={control}
            onLayout={handleLayout}
          />
          <View
            style={styles.areaRow}
            onLayout={event => {
              handleLayout({
                name: 'area',
                y: event.nativeEvent.layout.y,
              });
              handleLayout({
                name: 'area_unit',
                y: event.nativeEvent.layout.y,
              });
            }}>
            <View style={styles.areaRowItem}>
              <FormTextInput
                name="area"
                control={control}
                numericValue
                inputProps={{
                  placeholder: 'Area',
                  keyboardType: 'numeric',
                }}
              />
            </View>
            <View style={styles.areaRowItem}>
              <FormStandardSelectInput
                name="area_unit"
                control={control}
                variant="single"
                placeholder="Unit"
                data={transformToLabelValuePair(Object.values(AreaUnit))}
              />
            </View>
          </View>

          <FormTextInput
            name="farm_workers"
            control={control}
            numericValue
            inputProps={{
              placeholder: 'No. of farm workers',
              keyboardType: 'numeric',
            }}
            onLayout={handleLayout}
          />
          {loggedUser.userType === UserType.ADMIN ? (
            <>
              <FormStateSelectInput
                name="state"
                control={control}
                variant="single"
                onLayout={handleLayout}
              />
              <FormDistrictSelectInput
                name="district"
                control={control}
                variant="single"
                codes={state ? [state] : []}
                onLayout={handleLayout}
              />
              <FormBlockSelectInput
                name="block"
                control={control}
                variant="single"
                codes={district ? [district] : []}
                onLayout={handleLayout}
              />
            </>
          ) : (
            <FormLoadedLocationSelectInput
              name="block"
              control={control}
              variant="single"
              data={loggedUser.blocks}
              placeholder="Select block"
              onLayout={handleLayout}
            />
          )}

          <FormVillageSelectInput
            name="village"
            control={control}
            variant="single"
            codes={block ? [block] : []}
            onLayout={handleLayout}
          />
          <FormImageInput
            name="pictures"
            variant="multiple"
            styleVariant="square"
            maxSelect={3}
            control={control}
            onLayout={handleLayout}
            label={'Pictures'}
          />
          <Button
            onPress={handleSubmit(onSubmit)}
            mode="contained-tonal"
            style={styles.button}
            disabled={loading}>
            Submit
          </Button>
        </View>
        <Portal>{loading && <LoadingIndicator />}</Portal>
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
        </Portal>
      </View>
    </ScrollView>
  );
};

export default LandFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    rowGap: 24,
    marginHorizontal: 24,
  },
  button: {
    marginHorizontal: 48,
    marginTop: 20,
    marginBottom: 60,
  },
  areaRow: {
    flexDirection: 'row',
    marginVertical: 6,
    columnGap: 12,
    alignItems: 'center',
  },
  areaRowItem: {
    flex: 1,
  },
});

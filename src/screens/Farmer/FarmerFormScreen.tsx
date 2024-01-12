// FarmerForm.tsx

import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';

// form and form components
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';
import FormDateInput from '@components/FormDateInput';
import FormRadioInput from '@components/FormRadioInput';
import FormImageInput from '@components/FormImageInput';
import {
  FormDistrictSelectInput,
  FormStateSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
} from '@components/FormSelectInputCollection';

// helpers
import {calculateHash} from '@helpers/cryptoHelpers';
import {imageValidator, isAdult, nameValidator} from '@helpers/validators';
import {add91Prefix, formatDate, remove91Prefix} from '@helpers/formatters';
import {
  formatToUrlKey,
  getErrorMessage,
  removeKeys,
} from '@helpers/formHelpers';
import {CATEGORY, GENDER, INCOME_LEVELS} from '@helpers/constants';
import {areDatesEqual, areObjectsEqual} from '@helpers/comparators';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {APiFarmer} from '@hooks/useFarmerStore';

// api
import {api} from '@api/axios';

// types
import {FormImage} from '@typedefs/common';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

const transformToLabelValuePair = (
  originalArray: readonly string[],
): {label: string; value: string}[] => {
  return originalArray.map(item => ({label: item, value: item}));
};

// types
interface FarmerBasicForm {
  profile_photo: FormImage;
  id_front_image: FormImage;
  id_back_image: FormImage;
  state: number;
  district: number;
  block: number;
  village: number;
  name: string;
  guardian_name: string;
  date_of_birth: Date;
  phone_number: string;
  gender: (typeof GENDER)[number];
  address: string;
  income_level: (typeof INCOME_LEVELS)[number];
  category: (typeof CATEGORY)[number];
}
interface FarmerAddForm extends FarmerBasicForm {
  aadhaar: string;
  confirm_aadhaar: string;
}

// define validation schema(s)
const farmerBasicSchema: Yup.ObjectSchema<FarmerBasicForm> = Yup.object().shape(
  {
    profile_photo: imageValidator.required('Profile photo is required'),
    id_front_image: imageValidator.required('Aadhaar front image is required'),
    id_back_image: imageValidator.required('Aadhaar back image is required'),
    state: Yup.number()
      .required('State is required')
      .positive('State code must be positive'),
    district: Yup.number()
      .required('District is required')
      .positive('District code must be positive'),
    block: Yup.number()
      .required('Block is required')
      .positive('Block code must be positive'),
    village: Yup.number()
      .required('Village is required')
      .positive('Village code must be positive'),
    name: nameValidator,
    guardian_name: nameValidator,
    date_of_birth: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future')
      .test('is-adult', 'Farmer must be at least 18 years old', isAdult),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(GENDER, 'Invalid gender'),
    address: Yup.string()
      .required('Address is required')
      .min(5, 'Invalid address'),
    income_level: Yup.string()
      .required('Income level is required')
      .oneOf(INCOME_LEVELS, 'Invalid gender'),
    category: Yup.string()
      .required('Category is required')
      .oneOf(CATEGORY, 'Invalid category'),
  },
);
const farmerAddSchema: Yup.ObjectSchema<FarmerAddForm> =
  farmerBasicSchema.shape({
    aadhaar: Yup.string()
      .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid aadhaar number')
      .required('Aadhaar number is required'),
    confirm_aadhaar: Yup.string()
      .required('Confirm aadhaar number is required')
      .oneOf(
        [Yup.ref('confirm_aadhaar')],
        'Aadhaar and Confirm aadhaar must match',
      ),
  });

// define default values
const farmerAddDefaultValues: Partial<FarmerAddForm> = {
  state: 23,
  aadhaar: '',
  confirm_aadhaar: '',
  name: '',
  guardian_name: '',
  date_of_birth: new Date('1990-01-01'),
  phone_number: '',
  gender: 'MALE' as const,
  address: '',
  income_level: '30-50k' as const,
  category: 'GENERAL' as const,
};
const getFarmerEditDefaultValues = ({
  profile_photo,
  id_front_image,
  id_back_image,
  village,
  date_of_birth,
  phone_number,
  name,
  guardian_name,
  gender,
  address,
  income_level,
  category,
}: APiFarmer): FarmerBasicForm => {
  return {
    profile_photo: {uri: profile_photo.url, hash: profile_photo.hash},
    id_front_image: {uri: id_front_image.url, hash: id_front_image.hash},
    id_back_image: {uri: id_back_image.url, hash: id_back_image.hash},
    date_of_birth: new Date(date_of_birth),
    phone_number: remove91Prefix(phone_number),
    village: village.code,
    state: 0,
    district: 0,
    block: 0,
    name,
    guardian_name,
    gender,
    address,
    income_level,
    category,
  };
};

const prepareAddFormData = (formData: FarmerAddForm) => {
  return {
    ...removeKeys(formData, [
      'phone_number',
      'profile_photo',
      'id_front_image',
      'id_back_image',
      'state',
      'district',
      'block',
      'aadhaar',
      'confirm_aadhaar',
      'date_of_birth',
    ]),
    id_hash: calculateHash(formData.aadhaar),
    profile_photo: formatToUrlKey(formData.profile_photo),
    id_back_image: formatToUrlKey(formData.id_back_image),
    id_front_image: formatToUrlKey(formData.id_front_image),
    date_of_birth: formatDate(formData.date_of_birth, 'YYYY-MM-DD'),
    phone_number: add91Prefix(formData.phone_number),
  };
};
const prepareEditFormData = (
  formData: FarmerBasicForm,
  initialValues: FarmerBasicForm,
) => {
  const changedFields = Object.keys(formData).reduce((acc, key) => {
    let formKey = key as keyof FarmerBasicForm;
    if (formKey === 'date_of_birth') {
      if (!areDatesEqual(formData[formKey], initialValues[formKey])) {
        acc[formKey] = formatDate(formData[formKey], 'YYYY-MM-DD');
      }
    } else if (formKey === 'phone_number') {
      if (formData[formKey] !== initialValues[formKey]) {
        acc[formKey] = add91Prefix(formData[formKey]);
      }
    } else if (
      formKey === 'profile_photo' ||
      formKey === 'id_back_image' ||
      formKey === 'id_front_image'
    ) {
      if (!areObjectsEqual(formData[formKey], initialValues[formKey])) {
        acc[formKey] = formatToUrlKey(formData[formKey]);
      }
    } else if (formData[formKey] !== initialValues[formKey]) {
      acc[formKey] = formData[formKey];
    }
    return acc;
  }, {} as Record<string, any>);
  return changedFields;
};

type FarmerFormScreenProps = NativeStackScreenProps<
  FarmerStackScreenProps,
  'FarmerAdd' | 'FarmerEdit'
>;

const FarmerFormScreen: React.FC<FarmerFormScreenProps> = ({route}) => {
  const {variant} = route.params;
  const farmer = 'farmer' in route.params ? route.params.farmer : undefined;

  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');
  type FarmerFormType = FarmerBasicForm &
    (typeof variant extends 'add' ? FarmerAddForm : {});

  const defaultValues =
    variant === 'edit' && farmer
      ? getFarmerEditDefaultValues(farmer)
      : farmerAddDefaultValues;

  const {handleSubmit, control, watch, reset} = useForm<FarmerFormType>({
    defaultValues,
    resolver: yupResolver(
      variant === 'add' ? farmerAddSchema : farmerBasicSchema,
    ),
  });

  if (variant === 'edit' && !farmer) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge">Farmer not found error</Text>
      </View>
    );
  }

  const onSubmit = async (formData: FarmerFormType) => {
    try {
      setLoading(true);
      if (variant === 'add') {
        const result = await api.post(
          'farmers/',
          prepareAddFormData(formData as FarmerAddForm),
        );
        if (result.status === 201) {
          reset(farmerAddDefaultValues);
          showSnackbar('Farmer added successfully');
        }
      } else if (variant === 'edit' && farmer) {
        const result = await api.patch(
          `farmers/${farmer.farmer_id}/`,
          prepareEditFormData(formData, defaultValues as FarmerBasicForm),
        );
        if (result.status === 200) {
          reset(farmerAddDefaultValues);
          showSnackbar('Farmer updated successfully');
        }
      }
    } catch (error) {
      showSnackbar(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FormImageInput name="profile_photo" control={control} />
          <FormTextInput
            name="name"
            control={control}
            sentenceCase
            inputProps={{placeholder: 'Name', autoCapitalize: 'words'}}
          />
          <FormTextInput
            name="guardian_name"
            control={control}
            sentenceCase
            inputProps={{
              placeholder: 'Father/Spouse Name',
              autoCapitalize: 'words',
            }}
          />
          {variant === 'add' && (
            <FormTextInput
              name="aadhaar"
              control={control}
              inputProps={{placeholder: 'Aadhaar'}}
            />
          )}
          {variant === 'add' && (
            <FormTextInput
              name="confirm_aadhaar"
              control={control}
              inputProps={{placeholder: 'Confirm Aadhaar'}}
            />
          )}
          <View style={styles.imgRow}>
            <FormImageInput
              name="id_front_image"
              control={control}
              label="Aadhaar Front"
              variant="square"
              border="dashed"
            />
            <FormImageInput
              name="id_back_image"
              control={control}
              label="Aadhaar Back"
              variant="square"
              border="dashed"
            />
          </View>
          <FormTextInput
            name="phone_number"
            control={control}
            inputProps={{placeholder: 'Phone number'}}
          />
          <FormRadioInput
            name="gender"
            control={control}
            label="Gender"
            options={transformToLabelValuePair(GENDER)}
          />
          <FormDateInput name="date_of_birth" control={control} label="DOB" />
          <FormTextInput
            name="address"
            control={control}
            inputProps={{placeholder: 'Home address', autoCapitalize: 'words'}}
          />
          <FormRadioInput
            name="category"
            control={control}
            label="Category"
            options={transformToLabelValuePair(CATEGORY)}
          />
          <FormRadioInput
            name="income_level"
            control={control}
            label="Income level"
            options={transformToLabelValuePair(INCOME_LEVELS)}
          />
          <FormStateSelectInput
            name="state"
            control={control}
            variant="single"
          />
          <FormDistrictSelectInput
            name="district"
            control={control}
            variant="single"
            codes={
              watch('state') ? [watch('state') as number] : ([] as number[])
            }
          />
          <FormBlockSelectInput
            name="block"
            control={control}
            variant="single"
            codes={
              watch('district')
                ? [watch('district') as number]
                : ([] as number[])
            }
          />
          <FormVillageSelectInput
            name="village"
            control={control}
            variant="single"
            codes={
              watch('block') ? [watch('block') as number] : ([] as number[])
            }
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            mode="contained-tonal"
            style={styles.button}
            disabled={loading}>
            Submit
          </Button>
        </View>
        <Portal>
          {loading && (
            <View style={StyleSheet.absoluteFill}>
              <ActivityIndicator
                style={[
                  styles.loadingIndicator,
                  {backgroundColor: theme.colors.backdrop},
                ]}
                size="large"
                animating={true}
              />
            </View>
          )}
        </Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

export default FarmerFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    rowGap: 24,
    marginHorizontal: 24,
  },
  imgRow: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  button: {
    marginHorizontal: 48,
    marginTop: 20,
    marginBottom: 60,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// BeneficiaryFormScreen.tsx

import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Divider,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// form and form components
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';
import FormDateInput from '@components/FormDateInput';
import FormRadioInput from '@components/FormRadioInput';
import FormImageInput from '@components/FormImageInput/FormImageInput';
import FormFarmerInput from '@components/FormFarmerInput';
import {
  FormDistrictSelectInput,
  FormStateSelectInput,
  FormBlockSelectInput,
  FormVillageSelectInput,
  FormLoadedLocationSelectInput,
} from '@components/FormSelectInputCollection';

// helpers
import {calculateHash} from '@helpers/cryptoHelpers';
import {imageValidator, isValidAge, nameValidator} from '@helpers/validators';
import {add91Prefix, formatDate, remove91Prefix} from '@helpers/formatters';
import {
  formatToUrlKey,
  getErrorMessage,
  getFieldErrors,
  removeKeys,
  transformToLabelValuePair,
} from '@helpers/formHelpers';
import {areDatesEqual, areObjectsEqual} from '@helpers/comparators';
import {GENDER, UserType} from '@helpers/constants';

// hooks, types
import useSnackbar from '@hooks/useSnackbar';
import {useFormErrorScroll} from '@hooks/useFormErrorScroll';
import {useAuthStore} from '@hooks/useAuthStore';
import {useProfileStore} from '@hooks/useProfileStore';
import {ApiBeneficiary, useBeneficiaryStore} from '@hooks/useBeneficiaryStore';
import {FormImage} from '@typedefs/common';

// api
import {api} from '@api/axios';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BeneficiaryStackScreenProps} from '@nav/BeneficiaryStack';

// styles
import {
  commonStyles,
  detailStyles,
  fontStyles,
  spacingStyles,
} from '@styles/common';

interface BeneficiaryBasicForm {
  profile_photo: FormImage;
  id_front_image: FormImage;
  id_back_image: FormImage;
  farmer: {id: number; name: string} | null;
  name: string;
  state?: number;
  district?: number;
  block: number;
  village: number;
  date_of_birth: Date;
  phone_number: string;
  gender: (typeof GENDER)[number];
  address: string;
  aadhaar?: string;
  confirm_aadhaar?: string;
}

const farmerValidator = Yup.object().shape({
  id: Yup.number()
    .required('Farmer is required')
    .positive('Farmer must be valid'),
  name: nameValidator,
});

// define validation schema(s)
const beneficiaryBasicValidation = {
  profile_photo: imageValidator.required('Profile photo is required'),
  id_front_image: imageValidator
    .required('Aadhaar front image is required')
    .test('front-image-unique', 'Duplicate image', function (value) {
      if (!value.hash) {
        return true;
      }
      return (
        value.hash !== this.parent.profile_photo.hash &&
        value.hash !== this.parent.id_back_image.hash
      );
    }),
  id_back_image: imageValidator
    .required('Aadhaar back image is required')
    .test('back-image-unique', 'Duplicate image', function (value) {
      if (!value.hash) {
        return true;
      }
      return (
        value.hash !== this.parent.profile_photo.hash &&
        value.hash !== this.parent.id_front_image.hash
      );
    }),
  farmer: farmerValidator.required('Farmer is required'),
  name: nameValidator,
  state: Yup.number(),
  district: Yup.number(),
  block: Yup.number()
    .required('Block is required')
    .positive('Block code must be valid'),
  village: Yup.number()
    .required('Village is required')
    .positive('Village code must be valid'),
  date_of_birth: Yup.date()
    .required('Date of Birth is required')
    .max(new Date(), 'Date of Birth cannot be in the future')
    .test('is-valid-age', 'Date of Birth must be valid', isValidAge),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(GENDER, 'Invalid gender'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Invalid address'),
  aadhaar: Yup.string(),
  confirm_aadhaar: Yup.string(),
};

const stateDistrictValidation = {
  state: Yup.number()
    .required('State is required')
    .positive('State code must be valid'),
  district: Yup.number()
    .required('District is required')
    .positive('District code must be valid'),
};

const aadhaarValidation = {
  aadhaar: Yup.string()
    .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid aadhaar number')
    .required('Aadhaar number is required'),
  confirm_aadhaar: Yup.string()
    .required('Confirm aadhaar number is required')
    .oneOf([Yup.ref('aadhaar')], 'Aadhaar and Confirm aadhaar must match'),
};

const getBeneficiaryValidationSchema = (
  variant: 'add' | 'edit',
  loggedUserType: UserType,
): Yup.ObjectSchema<BeneficiaryBasicForm> => {
  let beneficiarySchema = beneficiaryBasicValidation;
  if (variant === 'add') {
    beneficiarySchema = {...beneficiarySchema, ...aadhaarValidation};
  }
  if (loggedUserType === UserType.ADMIN) {
    beneficiarySchema = {...beneficiarySchema, ...stateDistrictValidation};
  }
  return Yup.object().shape(beneficiarySchema);
};

// define default values
const beneficiaryAddDefaultValues: Partial<BeneficiaryBasicForm> = {
  state: 23,
  aadhaar: '',
  confirm_aadhaar: '',
  name: '',
  date_of_birth: new Date('1990-01-01'),
  phone_number: '',
  gender: 'MALE',
  address: '',
  farmer: null,
};
const getBeneficiaryEditDefaultValues = ({
  profile_photo,
  id_front_image,
  id_back_image,
  village,
  date_of_birth,
  phone_number,
  name,
  gender,
  address,
  guardian,
}: ApiBeneficiary): BeneficiaryBasicForm => {
  return {
    profile_photo: {uri: profile_photo.url, hash: profile_photo.hash},
    id_front_image: {uri: id_front_image.url, hash: id_front_image.hash},
    id_back_image: {uri: id_back_image.url, hash: id_back_image.hash},
    date_of_birth: new Date(date_of_birth),
    phone_number: remove91Prefix(phone_number),
    state: village.block.district.state.code,
    district: village.block.district.code,
    block: village.block.code,
    village: village.code,
    name,
    farmer: {id: parseFloat(guardian), name: 'Farmer'},
    gender,
    address,
  };
};

const prepareAddFormData = (formData: BeneficiaryBasicForm) => {
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
      'farmer',
    ]),
    guardian: formData.farmer?.id ?? null,
    id_hash: calculateHash(formData.aadhaar ?? ''),
    profile_photo: formatToUrlKey(formData.profile_photo),
    id_back_image: formatToUrlKey(formData.id_back_image),
    id_front_image: formatToUrlKey(formData.id_front_image),
    date_of_birth: formatDate(formData.date_of_birth, 'YYYY-MM-DD'),
    phone_number: add91Prefix(formData.phone_number),
  };
};
const prepareEditFormData = (
  formData: BeneficiaryBasicForm,
  initialValues: BeneficiaryBasicForm,
) => {
  const changedFields = Object.keys(formData).reduce((acc, key) => {
    let formKey = key as keyof BeneficiaryBasicForm;
    if (formKey in ['state', 'district', 'block']) {
      // do nothing
    } else if (formKey === 'farmer') {
      if (formData.farmer?.id !== initialValues.farmer?.id) {
        acc.guardian = formData.farmer?.id;
      }
    } else if (formKey === 'date_of_birth') {
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

type BeneficiaryFormScreenProps = NativeStackScreenProps<
  BeneficiaryStackScreenProps,
  'BeneficiaryAdd' | 'BeneficiaryEdit'
>;

const BeneficiaryFormScreen: React.FC<BeneficiaryFormScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const {variant} = route.params;
  const beneficiary =
    'beneficiary' in route.params ? route.params.beneficiary : undefined;

  const withAuth = useAuthStore(store => store.withAuth);
  let loggedUser = useProfileStore(store => store.data);

  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');
  const setRefresh = useBeneficiaryStore(store => store.setRefresh);

  const defaultValues =
    variant === 'edit' && beneficiary
      ? getBeneficiaryEditDefaultValues(beneficiary)
      : beneficiaryAddDefaultValues;

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    setValue,
    formState: {errors},
  } = useForm<BeneficiaryBasicForm>({
    defaultValues,
    resolver: yupResolver(
      getBeneficiaryValidationSchema(variant, loggedUser.userType),
    ),
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

  if (variant === 'edit' && !beneficiary) {
    return (
      <View style={commonStyles.flex1}>
        <Text variant="titleLarge">Beneficiary not found error</Text>
      </View>
    );
  }

  const onSubmit = async (formData: BeneficiaryBasicForm) => {
    try {
      setLoading(true);
      if (variant === 'add') {
        await withAuth(async () => {
          try {
            const result = await api.post(
              'beneficiaries/',
              prepareAddFormData(formData),
            );
            if (result.status === 201) {
              reset(beneficiaryAddDefaultValues);
              showSnackbar('Beneficiary added successfully');
              setRefresh();
              setTimeout(() => {
                navigation.replace('BeneficiaryDetail', {
                  id: result.data.id,
                  beneficiary: result.data,
                });
              }, 2000);
            }
          } catch (error) {
            throw error;
          }
        });
      } else if (variant === 'edit' && beneficiary) {
        const dataToUpdate = prepareEditFormData(
          formData,
          defaultValues as BeneficiaryBasicForm,
        );
        console.log(dataToUpdate);
        if (!Object.keys(dataToUpdate).length) {
          throw new Error('No changes made');
        }
        await withAuth(async () => {
          try {
            const result = await api.patch(
              `beneficiaries/${beneficiary.beneficiary_id}/`,
              dataToUpdate,
            );
            if (result.status === 200) {
              showSnackbar('Beneficiary updated successfully');
              setRefresh();
              setTimeout(() => {
                navigation.navigate('BeneficiaryDetail', {
                  id: result.data.beneficiary_id,
                  beneficiary: result.data,
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
        getFieldErrors(errorMessage).forEach(
          ({fieldName, fieldErrorMessage}) => {
            type FormFieldName = keyof BeneficiaryBasicForm;
            if (fieldName === 'id_hash') {
              fieldErrorMessage.includes('already exists')
                ? setError('aadhaar' as FormFieldName, {
                    message: 'Farmer with this Aadhaar id already exists',
                  })
                : setError('aadhaar' as FormFieldName, {
                    message: fieldErrorMessage,
                  });
            } else if (fieldName === 'guardian') {
              setError('farmer' as FormFieldName, {message: fieldErrorMessage});
            } else if (
              (fieldName === 'profile_photo' ||
                fieldName === 'id_back_image' ||
                fieldName === 'id_front_image') &&
              fieldErrorMessage.includes('already exists')
            ) {
              setError(fieldName, {message: 'Image file already exists'});
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

  return (
    <ScrollView ref={scrollViewRef}>
      <View style={commonStyles.flex1}>
        <View
          style={[
            spacingStyles.mh16,
            spacingStyles.pv16,
            spacingStyles.rowGap8,
          ]}>
          <FormImageInput
            name="profile_photo"
            control={control}
            onLayout={handleLayout}
          />
          <FormTextInput
            name="name"
            control={control}
            sentenceCase
            inputProps={{placeholder: 'Name*', autoCapitalize: 'words'}}
            onLayout={handleLayout}
          />
          <FormFarmerInput
            name="farmer"
            control={control}
            onLayout={handleLayout}
          />
          <FormDateInput
            name="date_of_birth"
            control={control}
            label="Date of birth"
            onLayout={handleLayout}
          />
          <FormTextInput
            name="phone_number"
            control={control}
            inputProps={{placeholder: 'Phone number*', keyboardType: 'numeric'}}
            onLayout={handleLayout}
          />
          <Divider style={spacingStyles.mv16} bold />
          <View style={commonStyles.row}>
            {variant === 'add' && (
              <View
                style={[
                  commonStyles.flex2,
                  spacingStyles.mr16,
                  spacingStyles.rowGap8,
                ]}>
                <FormTextInput
                  name="aadhaar"
                  control={control}
                  inputProps={{
                    placeholder: 'Aadhaar*',
                    keyboardType: 'numeric',
                    secureTextEntry: true,
                  }}
                  onLayout={handleLayout}
                />
                <FormTextInput
                  name="confirm_aadhaar"
                  control={control}
                  inputProps={{
                    placeholder: 'Confirm Aadhaar*',
                    keyboardType: 'numeric',
                  }}
                  onLayout={handleLayout}
                />
              </View>
            )}
            <View
              style={[
                variant === 'add'
                  ? [detailStyles.colSide, spacingStyles.rowGap8]
                  : [commonStyles.row, spacingStyles.colGap8],
              ]}>
              <FormImageInput
                name="id_front_image"
                control={control}
                label="Aadhaar Front"
                styleVariant="square"
                onLayout={handleLayout}
              />
              <FormImageInput
                name="id_back_image"
                control={control}
                label="Aadhaar Back"
                styleVariant="square"
                onLayout={handleLayout}
              />
            </View>
          </View>
          <Divider style={spacingStyles.mv16} bold />
          <FormRadioInput
            name="gender"
            control={control}
            label="Gender"
            options={transformToLabelValuePair(GENDER)}
            onLayout={handleLayout}
          />
          <Divider style={spacingStyles.mv16} bold />
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
          <FormTextInput
            name="address"
            control={control}
            inputProps={{placeholder: 'Home address*', autoCapitalize: 'words'}}
            onLayout={handleLayout}
          />
          <View
            style={[
              commonStyles.centeredContainer,
              spacingStyles.mt16,
              spacingStyles.mb48,
            ]}>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              buttonColor={theme.colors.secondary}
              disabled={loading}
              labelStyle={fontStyles.bodyXl}>
              Submit
            </Button>
          </View>
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

export default BeneficiaryFormScreen;

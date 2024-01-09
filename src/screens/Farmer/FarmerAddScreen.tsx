// FarmerAddScreen.tsx

import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Snackbar} from 'react-native-paper';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FarmerStackScreenProps} from '@nav/FarmerStack';

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

// api
import {api} from '@api/axios';

// helpers
import {calculateHash} from '@helpers/cryptoHelpers';
import {imageValidator, isAdult, nameValidator} from '@helpers/validators';
import {add91Prefix, formatDate} from '@helpers/formatters';
import {
  formatToUrlKey,
  getErrorMessage,
  removeKeys,
} from '@helpers/formHelpers';

// constants
const gender = ['MALE', 'FEMALE'] as const;
const category = ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITIES'] as const;
const incomeLevels = ['<30k', '30-50k', '50-80k', '>80k'] as const;

function transformToLabelValuePair(
  originalArray: readonly string[],
): {label: string; value: string}[] {
  return originalArray.map(item => ({label: item, value: item}));
}

// types
interface FarmerForm {
  profile_photo: {uri: string; hash: string};
  id_front_image: {uri: string; hash: string};
  id_back_image: {uri: string; hash: string};
  state: number;
  district: number;
  block: number;
  village: number;
  aadhaar: string;
  confirm_aadhaar: string;
  // id_hash: string;
  name: string;
  guardian_name: string;
  dob: Date;
  // date_of_birth: string;
  phone_number: string;
  gender: (typeof gender)[number];
  address: string;
  income_level: (typeof incomeLevels)[number];
  category: (typeof category)[number];
}
type FarmerAddScreenProps = NativeStackScreenProps<
  FarmerStackScreenProps,
  'FarmerAdd'
>;

const FarmerAddScreen: React.FC<FarmerAddScreenProps> = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Farmer add error');
  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  // define validation schema
  const farmerSchema = Yup.object().shape({
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
    aadhaar: Yup.string()
      .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid aadhaar number')
      .required('Aadhaar number is required'),
    confirm_aadhaar: Yup.string()
      .required('Confirm aadhaar number is required')
      .oneOf(
        [Yup.ref('confirm_aadhaar')],
        'Aadhaar and Confirm aadhaar must match',
      ),
    // id_hash: Yup.string()
    //   .required('Aadhaar Hash is required')
    //   .test('is-valid-sha3', 'Invalid SHA3 hash', isValidSHA3),
    name: nameValidator,
    guardian_name: nameValidator,
    dob: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future')
      .test('is-adult', 'Farmer must be at least 18 years old', isAdult),
    // date_of_birth: Yup.string()
    //   .required('Date of Birth is required')
    //   .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    //   .test('is-adult', 'Farmer must be at least 18 years old', isAdult),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(gender, 'Invalid gender'),
    address: Yup.string()
      .required('Address is required')
      .min(5, 'Invalid address'),
    income_level: Yup.string()
      .required('Income level is required')
      .oneOf(incomeLevels, 'Invalid gender'),
    category: Yup.string()
      .required('Category is required')
      .oneOf(category, 'Invalid category'),
  });

  // define default values
  const defaultValues = {
    // profile_photo: null,
    // id_front_image: null,
    // id_back_image: null,
    state: 23,
    // district: null,
    // block: null,
    // village: null,
    aadhaar: '',
    confirm_aadhaar: '',
    // id_hash: '',
    name: '',
    guardian_name: '',
    dob: new Date('1990-01-01'),
    // date_of_birth: '1990-01-01',
    phone_number: '',
    gender: 'MALE' as const,
    address: '',
    income_level: '30-50k' as const,
    category: 'GENERAL' as const,
  };

  // const defaultValues = {
  //   aadhaar: '523412341234',
  //   address: '#567 Kalyani Nagar, Bhujendra Chauraha',
  //   block: 3876,
  //   category: 'GENERAL' as const,
  //   confirm_aadhaar: '523412341234',
  //   // date_of_birth: '1990-01-01',
  //   district: 639,
  //   dob: new Date('1990-01-01'),
  //   gender: 'MALE' as const,
  //   guardian_name: 'Hari Prasad Wariyal',
  //   id_back_image: {
  //     hash: 'f27de692a20674f0be9fdecfa2e7619f9424aa689177a452c9d342bd4ff347a3',
  //     uri: 'file:///data/user/0/com.gatherer/cache/rn_image_picker_lib_temp_e1f7bc09-0c19-4a7e-aaf9-adc2ff60850a.jpg',
  //   },
  //   id_front_image: {
  //     hash: 'f27de692a20674f0be9fdecfa2e7619f9424aa689177a452c9d342bd4ff347a3',
  //     uri: 'file:///data/user/0/com.gatherer/cache/rn_image_picker_lib_temp_c2294da5-1e13-4fb4-9566-a58f52bd546e.jpg',
  //   },
  //   // id_hash:
  //   //   'ec115b70f654db75b25b038aeafc278a9cf55c2ce1dd30d411287c28a93693ffc797fe0587c8a333d1de5849a7a2bc75bb6ab2123fb2a7e8cd56974516db3213',
  //   income_level: '<30k' as const,
  //   name: 'Hemant Wariyal',
  //   phone_number: '9876543210',
  //   profile_photo: {
  //     hash: 'c074305b9b6317ae5bc44732a3183560dcbbe5bc0f8de75b15015bccbf2ea895',
  //     uri: 'file:///data/user/0/com.gatherer/cache/rn_image_picker_lib_temp_f0705d94-0210-4e68-a77a-1ef6d13c4fa9.png',
  //   },
  //   state: 23,
  //   village: 505086,
  // };
  const {handleSubmit, control, watch, reset} = useForm<FarmerForm>({
    defaultValues,
    resolver: yupResolver(farmerSchema),
  });

  // const aadhaar = watch('aadhaar');
  // useEffect(() => {
  //   // Update id_hash when id changes
  //   const updateIdHash = async () => {
  //     const hashedId = calculateHash(aadhaar) ?? '';
  //     setValue('id_hash', hashedId);
  //   };
  //   updateIdHash();
  // }, [aadhaar, setValue]);

  const onSubmit = async (data: FarmerForm) => {
    // console.log(data);
    try {
      const farmerPostData = {
        ...removeKeys(data, [
          'phone_number',
          'profile_photo',
          'id_front_image',
          'id_back_image',
          'state',
          'district',
          'block',
          'aadhaar',
          'confirm_aadhaar',
          'dob',
        ]),
        ...{
          id_hash: calculateHash(data.aadhaar),
          profile_photo: formatToUrlKey(data.profile_photo),
          id_back_image: formatToUrlKey(data.id_back_image),
          id_front_image: formatToUrlKey(data.id_front_image),
          date_of_birth: formatDate(data.dob, 'YYYY-MM-DD'),
          phone_number: add91Prefix(data.phone_number),
        },
      };
      // console.log('\n\n\nFARMER POST DATA: ', farmerPostData);
      const result = await api.post('farmers/', farmerPostData);
      if (result.status === 201) {
        reset(defaultValues);
        setSnackbarVisible(true);
        setSnackbarMessage('Farmer Added successfully');
      }
    } catch (error) {
      // console.log(data, error);
      setSnackbarVisible(true);
      setSnackbarMessage(getErrorMessage(error));
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
            inputProps={{placeholder: 'Name'}}
          />
          <FormTextInput
            name="guardian_name"
            control={control}
            inputProps={{placeholder: 'Father/Spouse Name'}}
          />
          <FormTextInput
            name="aadhaar"
            control={control}
            inputProps={{placeholder: 'Aadhaar'}}
          />
          <FormTextInput
            name="confirm_aadhaar"
            control={control}
            inputProps={{placeholder: 'Confirm Aadhaar'}}
          />
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
            options={transformToLabelValuePair(gender)}
          />
          <FormDateInput name="dob" control={control} label="DOB" />
          <FormTextInput
            name="address"
            control={control}
            inputProps={{placeholder: 'Home address'}}
          />
          <FormRadioInput
            name="category"
            control={control}
            label="Category"
            options={transformToLabelValuePair(category)}
          />
          <FormRadioInput
            name="income_level"
            control={control}
            label="Income level"
            options={transformToLabelValuePair(incomeLevels)}
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
            style={styles.button}>
            Submit
          </Button>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          duration={Snackbar.DURATION_SHORT}>
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

export default FarmerAddScreen;

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
});

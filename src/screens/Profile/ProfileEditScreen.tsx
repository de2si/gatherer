// ProfileEditScreen.tsx

import React, {useState} from 'react';
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

// helpers
import {imageValidator, nameValidator} from '@helpers/validators';
import {add91Prefix, remove91Prefix} from '@helpers/formatters';
import {
  formatToUrlKey,
  getErrorMessage,
  getFieldErrors,
  transformToLabelValuePair,
} from '@helpers/formHelpers';
import {GENDER} from '@helpers/constants';
import {areObjectsEqual} from '@helpers/comparators';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';
import {useProfileStore} from '@hooks/useProfileStore';

// api
import {api} from '@api/axios';

// types
import {FormImage} from '@typedefs/common';
import {ApiUserType} from '@hooks/useProfileStore';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MoreStackScreenProps} from '@nav/MoreStack';

// types
interface ProfileBasicForm {
  profile_photo: null | FormImage;
  name: string;
  gender: (typeof GENDER)[number];
  phone_number: string;
  email: string;
}

// define validation schema(s)
const profileBasicValidation: Yup.ObjectSchema<ProfileBasicForm> =
  Yup.object().shape({
    profile_photo: imageValidator.nullable(),
    name: nameValidator,
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(GENDER, 'Invalid gender'),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

// define default values
const getProfileEditDefaultValues = ({
  profile_photo,
  phone_number,
  name,
  email,
  gender,
}: ApiUserType): ProfileBasicForm => {
  return {
    profile_photo: profile_photo
      ? {uri: profile_photo.url, hash: profile_photo.hash}
      : null,
    name,
    gender,
    phone_number: remove91Prefix(phone_number),
    email,
  };
};

const fieldOrder = ['profile_photo', 'name', 'phone_number', 'email', 'gender'];

const prepareEditFormData = (
  formData: ProfileBasicForm,
  initialValues: ProfileBasicForm,
) => {
  const changedFields = Object.keys(formData).reduce((acc, key) => {
    let formKey = key as keyof ProfileBasicForm;
    if (formKey === 'phone_number') {
      if (formData[formKey] !== initialValues[formKey]) {
        acc[formKey] = add91Prefix(formData[formKey]);
      }
    } else if (formKey === 'profile_photo') {
      if (
        !areObjectsEqual(
          formData.profile_photo ?? {},
          initialValues.profile_photo ?? {},
        )
      ) {
        acc.profile_photo = formData.profile_photo
          ? formatToUrlKey(formData.profile_photo)
          : null;
      }
    } else if (formData[formKey] !== initialValues[formKey]) {
      acc[formKey] = formData[formKey];
    }
    return acc;
  }, {} as Record<string, any>);
  return changedFields;
};

type ProfileFormScreenProps = NativeStackScreenProps<
  MoreStackScreenProps,
  'ProfileEdit'
>;

const UserFormScreen: React.FC<ProfileFormScreenProps> = ({
  route: {
    params: {},
  },
  navigation,
}) => {
  let fetchProfile = useProfileStore(store => store.fetchData);
  let profile = useProfileStore(store => store.apiData);
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');

  const defaultValues = getProfileEditDefaultValues(profile);

  const {handleSubmit, control, setError} = useForm<ProfileBasicForm>({
    defaultValues,
    resolver: yupResolver(profileBasicValidation),
  });

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge">User not found error</Text>
      </View>
    );
  }

  const onSubmit = async (formData: ProfileBasicForm) => {
    try {
      setLoading(true);
      if (profile) {
        const dataToUpdate = prepareEditFormData(
          formData,
          defaultValues as ProfileBasicForm,
        );
        if (!Object.keys(dataToUpdate).length) {
          throw new Error('No changes made');
        }
        await withAuth(async () => {
          try {
            const result = await api.patch(
              `users/${profile.id}/`,
              dataToUpdate,
            );
            if (result.status === 200) {
              showSnackbar('Profile updated successfully');
              await fetchProfile();
              setTimeout(() => {
                navigation.navigate('ProfileDetail', {});
              }, 2000);
            }
          } catch (error) {
            throw error;
          }
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = getErrorMessage(error);
      console.log(errorMessage);
      if (typeof errorMessage === 'string') {
        showSnackbar(errorMessage);
      } else {
        getFieldErrors(errorMessage).forEach(
          ({fieldName, fieldErrorMessage}) => {
            type FormFieldName = keyof ProfileBasicForm;
            if (
              fieldName === 'profile_photo' &&
              fieldErrorMessage.includes('already exists')
            ) {
              setError(fieldName, {message: 'Image file already exists'});
            } else if (fieldOrder.includes(fieldName)) {
              setError(fieldName as FormFieldName, {
                message: fieldErrorMessage,
              });
            } else {
              showSnackbar(fieldErrorMessage);
            }
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const gotoPasswordScreen = () => {
    navigation.navigate('ProfilePassword', {
      id: profile.id,
    });
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
            name="phone_number"
            control={control}
            inputProps={{placeholder: 'Phone number', keyboardType: 'numeric'}}
          />
          <FormTextInput
            name="email"
            control={control}
            inputProps={{placeholder: 'Email'}}
          />
          <View>
            <Button onPress={gotoPasswordScreen} mode="contained">
              Change Password
            </Button>
          </View>

          <FormRadioInput
            name="gender"
            control={control}
            label="Gender"
            options={transformToLabelValuePair(GENDER)}
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

export default UserFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
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
    // marginTop: 10,
    // marginBottom: 60,
  },
});

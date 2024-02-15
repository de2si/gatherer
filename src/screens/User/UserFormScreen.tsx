// UserFormScreen.tsx

import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Portal, Snackbar, Text, useTheme} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// form and form components
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';
import FormRadioInput from '@components/FormRadioInput';
import FormImageInput from '@components/FormImageInput';
import {
  FormDistrictSelectInput,
  FormStateSelectInput,
  FormBlockSelectInput,
  FormProjectSelectInput,
  FormLoadedLocationSelectInput,
} from '@components/FormSelectInputCollection';

// helpers
import {imageValidator, nameValidator} from '@helpers/validators';
import {add91Prefix, remove91Prefix} from '@helpers/formatters';
import {
  formatToUrlKey,
  getErrorMessage,
  getFieldErrors,
  removeKeys,
} from '@helpers/formHelpers';
import {GENDER, UserType} from '@helpers/constants';
import {areObjectsEqual, arraysEqual} from '@helpers/comparators';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useFormErrorScroll} from '@hooks/useFormErrorScroll';
import {useUserStore} from '@hooks/useUserStore';
import {useAuthStore} from '@hooks/useAuthStore';
import {useProfileStore} from '@hooks/useProfileStore';
import {useBlockStore, useDistrictStore} from '@hooks/locationHooks';

// api
import {api} from '@api/axios';

// types
import {FormImage} from '@typedefs/common';
import {ApiUserType} from '@hooks/useProfileStore';

// nav
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

const transformToLabelValuePair = (
  originalArray: readonly string[],
): {label: string; value: string}[] => {
  return originalArray.map(item => ({label: item, value: item}));
};

// types
interface UserBasicForm {
  photo: null | FormImage;
  name: string;
  gender: (typeof GENDER)[number];
  phone_number: string;
  email: string;
  user_type: UserType;
  password?: string;
  states?: number[];
  districts?: number[];
  blocks?: number[];
  projects?: number[];
}

// define validation schema(s)
const userBasicValidation = {
  photo: imageValidator.nullable(),
  name: nameValidator,
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(GENDER, 'Invalid gender'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  user_type: Yup.string()
    .oneOf(Object.values(UserType), 'Invalid user type')
    .required('User type is required'),
  password: Yup.string(),
  states: Yup.array(),
  districts: Yup.array(),
  blocks: Yup.array().when('user_type', ([userType], _schema) =>
    userType === UserType.ADMIN
      ? Yup.array().of(Yup.number()) // Allow empty array
      : Yup.array().of(Yup.number()).min(1, 'At least one block is required'),
  ),
  projects: Yup.array().when('user_type', ([userType], _schema) =>
    userType === UserType.ADMIN
      ? Yup.array().of(Yup.number()) // Allow empty array
      : Yup.array().of(Yup.number()).min(1, 'At least one project is required'),
  ),
};

const userPasswordValidation = {
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
};

const userStateDistrictValidation = {
  states: Yup.array().when('user_type', ([userType], _schema) =>
    userType === UserType.ADMIN
      ? Yup.array().of(Yup.number()) // Allow empty array
      : Yup.array().of(Yup.number()).min(1, 'At least one state is required'),
  ),
  districts: Yup.array().when('user_type', ([userType], _schema) =>
    userType === UserType.ADMIN
      ? Yup.array().of(Yup.number()) // Allow empty array
      : Yup.array()
          .of(Yup.number())
          .min(1, 'At least one district is required'),
  ),
};

const getUserValidationSchema = (
  variant: 'add' | 'edit',
  loggedUserType: UserType,
): Yup.ObjectSchema<UserBasicForm> => {
  let userSchema = userBasicValidation;
  if (variant === 'add')
    userSchema = {...userSchema, ...userPasswordValidation};
  if (loggedUserType === UserType.ADMIN)
    userSchema = {...userSchema, ...userStateDistrictValidation};
  return Yup.object().shape(userSchema);
};

// define default values
const getUserAddDefaultValues = (
  userType: UserType,
): Partial<UserBasicForm> => ({
  password: '',
  photo: null,
  projects: [],
  states: [],
  districts: [],
  blocks: [],
  user_type: userType,
  name: '',
  gender: 'MALE',
  phone_number: '',
  email: '',
});
const getUserEditDefaultValues = ({
  phone_number,
  name,
  email,
  user_type,
  projects,
  blocks,
  gender,
}: ApiUserType): UserBasicForm => {
  const projectCodes: number[] = Object.keys(projects).map(key =>
    parseInt(key, 10),
  );
  const locationCodesSet = new Set<number>();
  const blockCodes: number[] = [];
  const districtCodes: number[] = [];
  const stateCodes: number[] = [];
  Object.entries(blocks).forEach(entry => {
    const [blockCode, block] = entry;
    const districtCode = block.district.code;
    const stateCode = block.district.state.code;
    blockCodes.push(parseInt(blockCode, 10));
    if (!locationCodesSet.has(districtCode)) {
      districtCodes.push(districtCode);
      locationCodesSet.add(districtCode);
    }
    if (!locationCodesSet.has(stateCode)) {
      stateCodes.push(stateCode);
      locationCodesSet.add(stateCode);
    }
  });
  return {
    photo: null,
    projects: projectCodes,
    states: stateCodes,
    districts: districtCodes,
    blocks: blockCodes,
    user_type,
    name,
    gender,
    phone_number: remove91Prefix(phone_number),
    email,
  };
};

const prepareAddFormData = (formData: UserBasicForm) => {
  return {
    ...removeKeys(formData, [
      'photo',
      'phone_number',
      'states',
      'districts',
      'blocks',
      'projects',
    ]),
    photo: formData.photo ? formatToUrlKey(formData.photo) : null,
    phone_number: add91Prefix(formData.phone_number),
    blocks: JSON.stringify(formData.blocks ?? []),
    projects: JSON.stringify(
      formData.projects?.reduce((acc, val) => {
        acc[val] = formData.blocks ?? [];
        return acc;
      }, {} as Record<number, number[]>),
    ),
  };
};
const prepareEditFormData = (
  formData: UserBasicForm,
  initialValues: UserBasicForm,
) => {
  const changedFields = Object.keys(formData).reduce((acc, key) => {
    let formKey = key as keyof UserBasicForm;
    if (formKey === 'phone_number') {
      if (formData[formKey] !== initialValues[formKey]) {
        acc[formKey] = add91Prefix(formData[formKey]);
      }
    } else if (formKey === 'photo') {
      if (!areObjectsEqual(formData.photo ?? {}, initialValues.photo ?? {})) {
        acc.photo = formData.photo ? formatToUrlKey(formData.photo) : null;
      }
    } else if (formKey === 'states' || formKey === 'districts') {
    } else if (formKey === 'blocks') {
      if (!arraysEqual(formData.blocks ?? [], initialValues.blocks ?? [])) {
        acc.blocks = JSON.stringify(formData.blocks ?? []);
      }
    } else if (formKey === 'projects') {
      if (!arraysEqual(formData.projects ?? [], initialValues.projects ?? [])) {
        acc.projects = JSON.stringify(
          formData.projects?.reduce((acc, val) => {
            acc[val] = formData.blocks ?? [];
            return acc;
          }, {} as Record<number, number[]>),
        );
      }
    } else if (formData[formKey] !== initialValues[formKey]) {
      acc[formKey] = formData[formKey];
    }
    return acc;
  }, {} as Record<string, any>);
  return changedFields;
};

type UserFormScreenProps = NativeStackScreenProps<
  UserStackScreenProps,
  'UserAdd' | 'UserEdit'
>;

const UserFormScreen: React.FC<UserFormScreenProps> = ({route, navigation}) => {
  const {variant} = route.params;
  const user = 'user' in route.params ? route.params.user : undefined;
  const userType = route.params.userType;

  const theme = useTheme();
  let loggedUser = useProfileStore(store => store.data);
  const withAuth = useAuthStore(store => store.withAuth);
  const filterDistrictCodes = useDistrictStore(store => store.getFilteredCodes);
  const filterBlockCodes = useBlockStore(store => store.getFilteredCodes);

  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Error');
  const setRefresh = useUserStore(store => store.setRefresh);

  const defaultValues =
    variant === 'edit' && user
      ? getUserEditDefaultValues(user)
      : getUserAddDefaultValues(userType);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    setValue,
    formState: {errors},
  } = useForm<UserBasicForm>({
    defaultValues,
    resolver: yupResolver(
      getUserValidationSchema(variant, loggedUser.userType),
    ),
  });

  const formUserType = watch('user_type');
  const states = watch('states');
  const districts = watch('districts');
  const blocks = watch('blocks');

  const initialStateChanged = useRef(false);
  const initialDistrictChanged = useRef(false);
  useEffect(() => {
    if (initialStateChanged.current) {
      setValue('districts', filterDistrictCodes(states ?? [], districts ?? []));
    } else {
      initialStateChanged.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDistrictCodes, setValue, states]); // Intentionally removing districts from the dependency array

  useEffect(() => {
    if (initialDistrictChanged.current) {
      setValue('blocks', filterBlockCodes(districts ?? [], blocks ?? []));
    } else {
      initialDistrictChanged.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBlockCodes, setValue, districts]); // Intentionally removing blocks from the dependency array

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
  }, [errors, manualScroll, scrollToFirstError]);

  if (variant === 'edit' && !user) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge">User not found error</Text>
      </View>
    );
  }

  const onSubmit = async (formData: UserBasicForm) => {
    try {
      setLoading(true);
      if (variant === 'add') {
        await withAuth(async () => {
          try {
            const result = await api.post(
              'users/',
              prepareAddFormData(formData),
            );
            if (result.status === 201) {
              reset(getUserAddDefaultValues(userType));
              showSnackbar('User added successfully');
              setRefresh(userType);
              setTimeout(() => {
                navigation.replace('UserDetail', {
                  id: result.data.user_id,
                  user: result.data,
                  userType,
                });
              }, 2000);
            }
          } catch (error) {
            throw error;
          }
        });
      } else if (variant === 'edit' && user) {
        const dataToUpdate = prepareEditFormData(
          formData,
          defaultValues as UserBasicForm,
        );
        if (!Object.keys(dataToUpdate).length)
          throw new Error('No changes made');
        await withAuth(async () => {
          try {
            const result = await api.patch(`users/${user.id}/`, dataToUpdate);
            if (result.status === 200) {
              showSnackbar('User updated successfully');
              setRefresh(userType);
              setTimeout(() => {
                navigation.navigate('UserDetail', {
                  id: result.data.user_id,
                  user: result.data,
                  userType,
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
            type FormFieldName = keyof UserBasicForm;
            if (
              fieldName === 'photo' &&
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
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <FormImageInput
            name="photo"
            control={control}
            onLayout={handleLayout}
          />
          <FormTextInput
            name="name"
            control={control}
            sentenceCase
            inputProps={{placeholder: 'Name', autoCapitalize: 'words'}}
            onLayout={handleLayout}
          />
          <FormTextInput
            name="phone_number"
            control={control}
            inputProps={{placeholder: 'Phone number', keyboardType: 'numeric'}}
            onLayout={handleLayout}
          />
          <FormTextInput
            name="email"
            control={control}
            inputProps={{placeholder: 'Email'}}
            onLayout={handleLayout}
          />
          {variant === 'add' && (
            <FormTextInput
              name="password"
              control={control}
              inputProps={{placeholder: 'Password', secureTextEntry: true}}
              onLayout={handleLayout}
            />
          )}
          <FormRadioInput
            name="gender"
            control={control}
            label="Gender"
            options={transformToLabelValuePair(GENDER)}
            onLayout={handleLayout}
          />
          {variant === 'edit' && (
            <FormRadioInput
              name="user_type"
              control={control}
              label="User Type"
              options={transformToLabelValuePair(Object.values(UserType))}
              onLayout={handleLayout}
            />
          )}

          {formUserType !== UserType.ADMIN && (
            <>
              <FormProjectSelectInput
                name="projects"
                control={control}
                variant="multiple"
                onLayout={handleLayout}
              />
              {loggedUser.userType === UserType.ADMIN && (
                <>
                  <FormStateSelectInput
                    name="states"
                    control={control}
                    variant="multiple"
                    onLayout={handleLayout}
                  />
                  <FormDistrictSelectInput
                    name="districts"
                    control={control}
                    variant="multiple"
                    codes={states ?? []}
                    onLayout={handleLayout}
                  />
                  <FormBlockSelectInput
                    name="blocks"
                    control={control}
                    variant="multiple"
                    codes={districts ?? []}
                    onLayout={handleLayout}
                  />
                </>
              )}
              {loggedUser.userType === UserType.SUPERVISOR && (
                <FormLoadedLocationSelectInput
                  name="blocks"
                  control={control}
                  variant="multiple"
                  data={loggedUser.blocks}
                  placeholder="Select blocks"
                  onLayout={handleLayout}
                />
              )}
            </>
          )}

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
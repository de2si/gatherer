// UserPasswordScreen.tsx

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Snackbar, Portal} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

// form
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';

// helpers
import {getErrorMessage} from '@helpers/formHelpers';
import {api} from '@api/axios';

// types
interface UserPasswordForm {
  password: string;
}
type UserPasswordScreenProps = NativeStackScreenProps<
  UserStackScreenProps,
  'UserPassword'
>;

// define validation schema
const userPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
// define default values
const defaultValues: UserPasswordForm = {
  password: '',
};

const UserPassword: React.FC<UserPasswordScreenProps> = ({
  route: {
    params: {id, userType},
  },
  navigation,
}) => {
  const withAuth = useAuthStore(store => store.withAuth);
  const [loading, setLoading] = useState(false);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('');

  const {handleSubmit, control} = useForm<UserPasswordForm>({
    defaultValues,
    resolver: yupResolver(userPasswordSchema),
  });

  const onSubmit = async (data: UserPasswordForm) => {
    try {
      setLoading(true);
      await withAuth(async () => {
        try {
          await api.put(`users/${id}/password/`, data);
          showSnackbar('Password changed successfully');
          setTimeout(() => {
            navigation.replace('UserDetail', {
              id,
              userType,
            });
          }, 2000);
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      typeof errorMessage === 'string'
        ? showSnackbar(errorMessage)
        : showSnackbar(errorMessage[0] ?? 'Error in changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <FormTextInput
          name="password"
          control={control}
          inputProps={{placeholder: 'Password', secureTextEntry: true}}
        />
        <Button
          mode="contained-tonal"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}>
          Submit
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
      <Portal>{loading && <LoadingIndicator />}</Portal>
    </View>
  );
};

export default UserPassword;

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
});

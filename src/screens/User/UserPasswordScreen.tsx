// UserPasswordScreen.tsx

import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Snackbar, Portal, useTheme} from 'react-native-paper';
import LoadingIndicator from '@components/LoadingIndicator';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {UserStackScreenProps} from '@nav/UserStack';
import {MoreStackScreenProps} from '@nav/MoreStack';

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

// styles
import {commonStyles, fontStyles, spacingStyles} from '@styles/common';

// Define a generic type for the route parameters
type UserPasswordScreenProps =
  | NativeStackScreenProps<UserStackScreenProps, 'UserPassword'>
  | NativeStackScreenProps<MoreStackScreenProps, 'ProfilePassword'>;
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

const UserPasswordScreen: React.FC<UserPasswordScreenProps> = ({
  route: {params, name: routeName},
  navigation,
}) => {
  const theme = useTheme();
  const id = params.id;

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
            if (routeName === 'ProfilePassword') {
              // handled by parent navigator
              (navigation as any).replace('ProfileDetail', {
                id,
              });
            } else {
              (navigation as any).replace('UserDetail', {
                id,
                userType: params?.userType,
              });
            }
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
    <ScrollView>
      <View style={commonStyles.flex1}>
        <View
          style={[
            spacingStyles.mh16,
            spacingStyles.pv16,
            spacingStyles.rowGap8,
          ]}>
          <FormTextInput
            name="password"
            control={control}
            inputProps={{placeholder: 'Password*', secureTextEntry: true}}
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
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={dismissSnackbar}
            duration={Snackbar.DURATION_SHORT}>
            {snackbarMessage}
          </Snackbar>
          {loading && <LoadingIndicator />}
        </Portal>
      </View>
    </ScrollView>
  );
};

export default UserPasswordScreen;

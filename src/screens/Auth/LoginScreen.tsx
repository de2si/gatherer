// LoginScreen.tsx

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, Button, useTheme, Snackbar} from 'react-native-paper';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackScreenProps} from '@nav/AuthStack';

// hooks
import useSnackbar from '@hooks/useSnackbar';
import {useAuthStore} from '@hooks/useAuthStore';

// form
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';

// assets
import Logo from '@assets/logo.png';

// helpers
import {getErrorMessage} from '@helpers/formHelpers';
import {add91Prefix} from '@helpers/formatters';
import {commonStyles, logoStyles} from '@styles/common';

// types
interface LoginForm {
  phoneNumber: string;
  password: string;
}
type LoginScreenProps = NativeStackScreenProps<
  AuthStackScreenProps,
  'LoginScreen'
>;

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const theme = useTheme();
  const login = useAuthStore(store => store.login);
  const loading = useAuthStore(store => store.loading);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Login error');

  // define validation schema
  const loginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });
  // define default values
  const defaultValues: LoginForm = {
    phoneNumber: '',
    password: '',
  };

  const {handleSubmit, control} = useForm<LoginForm>({
    defaultValues,
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(add91Prefix(data.phoneNumber), data.password);
    } catch (error) {
      let message = getErrorMessage(error);
      message = typeof message === 'string' ? message : message[0];
      showSnackbar(message ?? 'Login error');
    }
  };

  return (
    <View
      style={[commonStyles.flex1, {backgroundColor: theme.colors.background}]}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={logoStyles.logoImage} />
        <Text style={[theme.fonts.headlineLarge, logoStyles.gathererText]}>
          Gatherer
        </Text>
      </View>
      <View style={styles.formContainer}>
        <FormTextInput<LoginForm>
          name="phoneNumber"
          control={control}
          inputProps={{placeholder: 'Phone number', keyboardType: 'numeric'}}
        />
        <FormTextInput<LoginForm>
          name="password"
          control={control}
          inputProps={{placeholder: 'Password', secureTextEntry: true}}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          labelStyle={theme.fonts.titleMedium}
          loading={loading}
          disabled={loading}>
          Login
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={dismissSnackbar}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'flex-end',
  },
  formContainer: {
    flex: 2,
    rowGap: 4,
    marginTop: 48,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 24,
    marginTop: 60,
    marginBottom: 60,
  },
});

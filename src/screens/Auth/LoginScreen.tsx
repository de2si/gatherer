// LoginScreen.tsx

import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, Button, useTheme, Snackbar} from 'react-native-paper';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackScreenProps} from '@nav/AuthStack';

// stores
import {useAuthStore} from '@hooks/useAuthStore';

// form
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FormTextInput from '@components/FormTextInput';

// assets
import Logo from '@assets/logo.png';

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
  const doLogin = useAuthStore(store => store.login);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Login error');
  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

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
    let loginResult = await doLogin(data.phoneNumber, data.password);
    if (!loginResult.isSuccessful) {
      setSnackbarVisible(true);
      setSnackbarMessage(loginResult.errorMessage ?? 'Login error');
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logoImage} />
        <Text style={[theme.fonts.headlineLarge]}>Gatherer</Text>
        <Text style={[theme.fonts.titleLarge, {color: theme.colors.primary}]}>
          Haritika
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
          mode="contained-tonal"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}>
          Login
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        duration={Snackbar.DURATION_SHORT}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'flex-end',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  formContainer: {
    flex: 2,
    rowGap: 24,
    marginTop: 48,
    marginHorizontal: 24,
  },
  button: {
    marginHorizontal: 48,
    marginTop: 60,
    marginBottom: 60,
  },
});

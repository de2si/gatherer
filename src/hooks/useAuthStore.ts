// useAuthStore.ts

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {api} from '@api/axios';

// Define the shape of the store
interface AuthStore {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string;
  login: (
    phoneNumber: string,
    password: string,
  ) => Promise<{isSuccessful: boolean; errorMessage?: string}>;
  logout: () => void;
  initializeAxios: () => void;
}

// Create the store
export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      isLoading: false,
      isAuthenticated: false,
      token: '',
      login: async (phoneNumber: string, password: string) => {
        set({isLoading: true});
        let isLoginSuccessful = false;
        let errorMessage = '';
        try {
          const res = await api.post('api-token-auth/', {
            phone_number: phoneNumber,
            password,
          });
          set({token: res.data.token});
          api.defaults.headers.common.Authorization = `Token ${res.data.token}`;
          set({isAuthenticated: true});
          isLoginSuccessful = true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            set({token: ''});
            isLoginSuccessful = false;
            errorMessage =
              error?.response?.data?.non_field_errors?.[0] ?? 'Login error';
          }
        } finally {
          set({isLoading: false});
          return {isSuccessful: isLoginSuccessful, errorMessage};
        }
      },
      logout: () => {
        delete api.defaults.headers.common.Authorization;
        set({token: ''});
        set({isAuthenticated: false});
      },
      initializeAxios: () => {
        let {isAuthenticated, token} = get();
        // If a token is available, set it in the Authorization header
        if (isAuthenticated && token) {
          api.defaults.headers.common.Authorization = `Token ${token}`;
        }
      },
    }),
    {name: 'QJn5RXGF1dlx', storage: createJSONStorage(() => AsyncStorage)},
  ),
);

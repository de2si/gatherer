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
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the store
export const useAuthStore = create(
  persist<AuthStore>(
    set => ({
      isLoading: false,
      isAuthenticated: false,
      token: '',
      login: async (phoneNumber: string, password: string) => {
        set({isLoading: true});
        let loginResult = false;
        try {
          const res = await api.post('api-token-auth/', {
            phone_number: phoneNumber,
            password,
          });
          set({token: res.data.token});
          api.defaults.headers.common.Authorization = `Token ${res.data.token}`;
          set({isAuthenticated: true});
          loginResult = true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            set({token: ''});
            set({isAuthenticated: false});
            console.log('Login error:', error);
            loginResult = false;
          }
        } finally {
          set({isLoading: false});
          return loginResult;
        }
      },
      logout: () => {
        delete api.defaults.headers.common.Authorization;
        set({token: ''});
        set({isAuthenticated: false});
      },
    }),
    {name: 'QJn5RXGF1dlx', storage: createJSONStorage(() => AsyncStorage)},
  ),
);

// useAuthStore.ts

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {api} from '@api/axios';

interface ApiUserType {
  id: number;
  blocks: [];
  projects: {};
  user_type: 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';
  name: string;
  gender: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

interface User {
  id: number;
  blocks: []; // TODO: Update type
  projects: {}; // TODO: Update type
  userType: 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';
  name: string;
  gender: string; // TODO: Update type
  phoneNumber: string;
  email: string;
}

// Define the shape of the store
interface State {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string;
  user: User;
}
interface AuthStore extends State {
  login: (
    phoneNumber: string,
    password: string,
  ) => Promise<{isSuccessful: boolean; errorMessage?: string}>;
  logout: () => void;
  initializeAxios: () => void;
}

// Function to transform API response to match User interface
const transformApiUser = (apiResponse: ApiUserType): User => {
  return {
    id: apiResponse.id,
    blocks: apiResponse.blocks,
    projects: apiResponse.projects,
    userType: apiResponse.user_type,
    name: apiResponse.name,
    gender: apiResponse.gender,
    phoneNumber: apiResponse.phone_number,
    email: apiResponse.email,
  };
};

const initialState: State = {
  isLoading: false,
  isAuthenticated: false,
  token: '',
  user: {
    id: 0,
    blocks: [],
    projects: {},
    userType: 'SURVEYOR',
    name: '',
    gender: '',
    phoneNumber: '',
    email: '',
  },
};

// Create the store
export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      ...initialState,
      login: async (phoneNumber: string, password: string) => {
        set({isLoading: true});
        let isLoginSuccessful = false;
        let errorMessage = '';
        try {
          const res = await api.post('api-token-auth/', {
            phone_number: phoneNumber,
            password,
          });
          set({
            token: res.data.token,
            user: transformApiUser(res.data.user),
            isAuthenticated: true,
          });
          api.defaults.headers.common.Authorization = `Token ${res.data.token}`;
          isLoginSuccessful = true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
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
        set(initialState);
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

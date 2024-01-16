// useAuthStore.ts

import {useEffect, useState} from 'react';

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {isAxiosError} from 'axios';
import {api} from '@api/axios';

interface AuthState {
  loading: boolean;
  data: {
    access: string;
    refresh: string;
  };
  authenticated: boolean;
}

// Define initial auth state
const initialState: AuthState = {
  loading: false,
  data: {
    access: '',
    refresh: '',
  },
  authenticated: false,
};

// Define the shape of the store
interface AuthStore extends AuthState {
  getToken: (phone_number: string, password: string) => Promise<void>;
  verifyToken: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
  login: (phone_number: string, password: string) => Promise<void>;
  logout: () => void;
  setApiAuthHeader: () => void;
  withAuth: (apiCallback: () => any) => Promise<any>;
}

// Create the store
export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => {
      return {
        ...initialState,
        getToken: async (phone_number, password) => {
          try {
            const response = await api.post('api/token/', {
              phone_number,
              password,
            });
            const {access, refresh} = response.data;
            set({data: {access, refresh}, authenticated: true});
          } catch (error) {
            throw error;
          }
        },
        verifyToken: async () => {
          try {
            await api.post('api/token/verify/', {token: get().data.access});
            return true;
          } catch (error) {
            if (isAxiosError(error) && error.request) {
              throw error;
            }
            return false;
          }
        },
        refreshToken: async () => {
          try {
            const response = await api.post('api/token/refresh/', {
              refresh: get().data.refresh,
            });
            const {access} = response.data;
            set({data: {access, refresh: get().data.refresh}});
          } catch (error) {
            throw error;
          }
        },
        login: async (phone_number, password) => {
          try {
            set({loading: true});
            await get().getToken(phone_number, password);
            get().setApiAuthHeader();
          } catch (error) {
            throw error;
          } finally {
            set({loading: false});
          }
        },
        logout: () => {
          delete api.defaults.headers.common.Authorization;
          set(initialState);
        },
        setApiAuthHeader: () => {
          let {
            authenticated,
            data: {access},
          } = get();
          if (authenticated && access) {
            api.defaults.headers.common.Authorization = `Bearer ${access}`;
          }
        },
        withAuth: async (apiCallback: () => Promise<any>) => {
          if (get().authenticated) {
            try {
              const isTokenValid = await get().verifyToken();
              if (!isTokenValid) {
                await get().refreshToken();
                get().setApiAuthHeader();
              }
              await apiCallback();
            } catch (error) {
              throw error;
            }
          } else {
            throw new Error('User is not authenticated');
          }
        },
      };
    },
    {name: 'KQp5GHGV1etw', storage: createJSONStorage(() => AsyncStorage)},
  ),
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Note: This is just in case to take into account manual rehydration.
    // Can remove the following line if not needed.
    const unsubHydrate = useAuthStore.persist.onHydrate(() =>
      setHydrated(false),
    );

    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
      unsubHydrate();
      unsubFinishHydration();
    });

    setHydrated(useAuthStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

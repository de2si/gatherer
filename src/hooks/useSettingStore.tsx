// useSettingStore.ts

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

// Define the shape of the store
interface SettingStore {
  theme: ThemeMode;
  setTheme: (newTheme: ThemeMode) => void;
}

// Create the store
export const useSettingStore = create(
  persist<SettingStore>(
    set => ({
      theme: 'auto',
      setTheme: newTheme => {
        set({theme: newTheme});
      },
    }),
    {name: 'SQp5GHGV1etw', storage: createJSONStorage(() => AsyncStorage)},
  ),
);

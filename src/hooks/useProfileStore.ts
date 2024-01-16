// useProfileStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {GENDER} from '@helpers/constants';

export interface ApiUserType {
  id: number;
  blocks: [];
  projects: {};
  user_type: 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';
  name: string;
  gender: (typeof GENDER)[number];
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
  gender: (typeof GENDER)[number];
  phoneNumber: string;
  email: string;
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

interface ProfileState {
  loading: boolean;
  data: User;
}

// Define initial profile state
const initialState: ProfileState = {
  loading: false,
  data: {
    id: 0,
    blocks: [],
    projects: {},
    userType: 'SURVEYOR',
    name: '',
    gender: 'MALE',
    phoneNumber: '',
    email: '',
  },
};

// Define the shape of the store
interface ProfileStore extends ProfileState {
  fetchData: () => Promise<void>;
  reset: () => void;
}

// Create the store
export const useProfileStore = create<ProfileStore>(set => ({
  ...initialState,
  fetchData: async () => {
    try {
      set({loading: true});
      const response = await api.get('users/profile/');
      set({data: transformApiUser(response.data), loading: false});
    } catch (error) {
      throw error;
    }
  },
  reset: () => {
    set(initialState);
  },
}));

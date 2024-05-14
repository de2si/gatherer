// useProfileStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {GENDER, UserType} from '@helpers/constants';
import {Location} from '@hooks/locationHooks';
import {Project} from '@hooks/useProjectStore';
import {ApiFile} from '@typedefs/common';

export interface ApiUserType {
  id: number;
  blocks: {
    [key: string]: {
      name: string;
      district: Location & {
        state: Location;
      };
    };
  };
  projects: {
    [key: string]: {
      name: string;
      blocks: number[];
    };
  };
  profile_photo: ApiFile | null;
  user_type: UserType;
  name: string;
  gender: (typeof GENDER)[number];
  phone_number: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

interface User {
  id: number;
  blocks: Location[];
  projects: Project[];
  userType: UserType;
  name: string;
  gender: (typeof GENDER)[number];
  phoneNumber: string;
  email: string;
}

// Function to transform API response to match User interface
const transformApiUser = (apiResponse: ApiUserType): User => {
  return {
    id: apiResponse.id,
    blocks: Object.entries(apiResponse.blocks).map(([code, {name}]) => ({
      code: parseInt(code, 10),
      name,
    })),
    projects: Object.entries(apiResponse.projects).map(([id, {name}]) => ({
      id: parseInt(id, 10),
      name,
    })),
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
  apiData: ApiUserType;
}

// Define initial profile state
const initialState: ProfileState = {
  loading: false,
  data: {
    id: 0,
    blocks: [],
    projects: [],
    userType: UserType.SURVEYOR,
    name: '',
    gender: 'MALE',
    phoneNumber: '',
    email: '',
  },
  apiData: {
    id: 0,
    blocks: {},
    projects: {},
    user_type: UserType.SURVEYOR,
    name: '',
    gender: 'MALE',
    phone_number: '',
    email: '',
    is_active: false,
    date_joined: '',
    profile_photo: null,
  },
};

// Define the shape of the store
interface ProfileStore extends ProfileState {
  fetchData: () => Promise<void>;
  setProfile: (newProfile: ApiUserType) => void;
  reset: () => void;
}

// Create the store
export const useProfileStore = create<ProfileStore>(set => ({
  ...initialState,
  fetchData: async () => {
    try {
      set({loading: true});
      const response = await api.get('users/profile/');
      set({apiData: response.data, data: transformApiUser(response.data)});
    } catch (error) {
      throw error;
    } finally {
      set({loading: false});
    }
  },
  setProfile: newProfile => {
    set({apiData: newProfile, data: transformApiUser(newProfile)});
  },
  reset: () => {
    set(initialState);
  },
}));

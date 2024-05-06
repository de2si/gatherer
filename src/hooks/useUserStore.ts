// useUserStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {filterDefaultValues} from '@components/FilterSheet';

// helpers
import {formatIdAsCode, formatPhoneNumber} from '@helpers/formatters';
import {buildFilterQueryParams} from '@helpers/formHelpers';

// types
import {ApiUserType} from '@hooks/useProfileStore';
import {ApiImage, Filter} from '@typedefs/common';
import {UserType} from '@helpers/constants';
import {Project} from '@hooks/useProjectStore';

export interface UserPreview {
  id: number;
  name: string;
  photo: ApiImage;
  code: string;
  phone: string;
  projects: Project[];
}

// Define the shape of the store
interface UserStore {
  data: {
    [key in UserType]: UserPreview[];
  };
  loading: {
    [key in UserType]: boolean;
  };
  refresh: {
    [key in UserType]: boolean;
  };
  setRefresh: (userType: UserType) => void;
  fetchData: (
    userType: UserType,
    filters?: Filter,
    searchText?: string,
  ) => Promise<void>;
}

// Function to transform API response to match User Preview interface
const transformApiUser = (apiResponse: ApiUserType): UserPreview => {
  return {
    id: apiResponse.id,
    name: apiResponse.name,
    photo: {id: 0, url: '', hash: ''},
    code: formatIdAsCode('U', apiResponse.id),
    phone: formatPhoneNumber(apiResponse.phone_number),
    projects: Object.entries(apiResponse.projects).map(([id, {name}]) => ({
      id: parseInt(id, 10),
      name,
    })),
  };
};

// Create the store
export const useUserStore = create<UserStore>((set, get) => ({
  data: Object.fromEntries(
    Object.values(UserType).map(userType => [userType, [] as UserPreview[]]),
  ) as UserStore['data'],
  loading: Object.fromEntries(
    Object.values(UserType).map(userType => [userType, false]),
  ) as UserStore['loading'],
  refresh: Object.fromEntries(
    Object.values(UserType).map(userType => [userType, false]),
  ) as UserStore['refresh'],
  setRefresh: userType => {
    set(state => ({refresh: {...state.refresh, [userType]: true}}));
  },
  fetchData: async (
    userType,
    filters: Filter = filterDefaultValues,
    searchText = '',
  ) => {
    const queryParams = {
      ...buildFilterQueryParams(filters),
      ...(searchText ? {search: searchText} : {}),
      ...(userType ? {user_type: userType} : {}),
    };
    try {
      set(state => ({loading: {...state.loading, [userType]: true}}));
      const response = await api.get('users/', {
        params: queryParams,
      });
      set(state => ({
        data: {...state.data, [userType]: response.data.map(transformApiUser)},
      }));
    } catch (error) {
      throw error;
    } finally {
      get().refresh
        ? set(state => ({
            loading: {...state.loading, [userType]: false},
            refresh: {...state.refresh, [userType]: false},
          }))
        : set(state => ({loading: {...state.loading, [userType]: false}}));
    }
  },
}));

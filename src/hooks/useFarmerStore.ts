// useFarmerStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {Location} from './locationHooks';
import {ApiUserType} from './useAuthStore';
import {maskPhoneNumber} from '@helpers/formatters';
import {locationFilterDefaultValues} from '@components/LocationFilterSheet';
import {
  LocationFilterGroup,
  buildLocationFilterQueryParams,
} from '@helpers/formHelpers';
import {calculateHash} from '@helpers/cryptoHelpers';

// constants
const gender = ['MALE', 'FEMALE'] as const;
const category = ['GENERAL', 'OBC', 'SC', 'ST', 'MINORITIES'] as const;
const incomeLevels = ['<30k', '30-50k', '50-80k', '>80k'] as const;

interface ApiImage {
  id: number;
  url: string;
  hash: string;
}

interface APiFarmer {
  farmer_id: number;
  profile_photo: ApiImage;
  id_front_image: ApiImage;
  id_back_image: ApiImage;
  village: Location;
  added_by: ApiUserType;
  last_edited_by: ApiUserType;
  land_parcels: [];
  id_hash: string;
  name: string;
  guardian_name: string;
  date_of_birth: string;
  phone_number: string;
  gender: (typeof gender)[number];
  address: string;
  income_level: (typeof incomeLevels)[number];
  category: (typeof category)[number];
  added_on: string;
  last_edited_on: string;
}

export interface FarmerPreview {
  id: number;
  name: string;
  photo: ApiImage;
  code: string;
  village: Location;
  guardian: string;
  phone: string;
}

// Define the shape of the store
interface FarmerStore {
  data: FarmerPreview[];
  loading: boolean;
  fetchData: (
    filters?: LocationFilterGroup,
    searchText?: string,
  ) => Promise<void>;
}

// Function to transform API response to match Farmer Preview interface
const transformApiFarmer = (apiResponse: APiFarmer): FarmerPreview => {
  return {
    id: apiResponse.farmer_id,
    name: apiResponse.name,
    photo: apiResponse.profile_photo,
    code: 'AA9854',
    village: apiResponse.village,
    guardian: apiResponse.guardian_name,
    phone: maskPhoneNumber(apiResponse.phone_number),
  };
};

const buildSearchQueryParams = (searchText: string) => {
  if (!searchText) {
    return {};
  }
  if (
    searchText.length === 12 &&
    /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(searchText)
  ) {
    return {search: calculateHash(searchText)};
  }
  return {search: searchText};
};

// Create the store
export const useFarmerStore = create<FarmerStore>(set => ({
  data: [],
  loading: false,
  fetchData: async (
    locationFilters: LocationFilterGroup = locationFilterDefaultValues,
    searchText: string = '',
  ) => {
    set({loading: true});
    const queryParams = {
      ...buildLocationFilterQueryParams(locationFilters),
      ...buildSearchQueryParams(searchText),
    };
    const response = await api.get('farmers/', {
      params: queryParams,
    });
    console.log(queryParams);
    set({data: response.data.map(transformApiFarmer), loading: false});
  },
}));

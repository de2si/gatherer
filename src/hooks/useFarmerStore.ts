// useFarmerStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {locationFilterDefaultValues} from '@components/FilterSheet';

// helpers
import {formatIdAsCode, formatPhoneNumber} from '@helpers/formatters';
import {calculateHash} from '@helpers/cryptoHelpers';
import {CATEGORY, GENDER, INCOME_LEVELS} from '@helpers/constants';
import {buildFilterQueryParams} from '@helpers/formHelpers';

// types
import {Location} from '@hooks/locationHooks';
import {ApiUserType} from '@hooks/useProfileStore';
import {ApiFile, LocationFilter} from '@typedefs/common';
import {ApiLand} from '@hooks/useLandStore';

export interface ApiFarmer {
  farmer_id: number;
  profile_photo: ApiFile;
  id_front_image: ApiFile;
  id_back_image: ApiFile;
  village: Location & {
    block: Location & {
      district: Location & {
        state: Location;
      };
    };
  };
  added_by: ApiUserType;
  last_edited_by: ApiUserType;
  land_parcels: ApiLand[];
  id_hash: string;
  name: string;
  guardian_name: string;
  date_of_birth: string;
  phone_number: string;
  gender: (typeof GENDER)[number];
  address: string;
  income_level: (typeof INCOME_LEVELS)[number];
  category: (typeof CATEGORY)[number];
  added_on: string;
  last_edited_on: string;
}

export interface FarmerPreview {
  id: number;
  name: string;
  photo: ApiFile;
  code: string;
  village: Location;
  guardian: string;
  phone: string;
}

// Define the shape of the store
interface FarmerStore {
  data: FarmerPreview[];
  loading: boolean;
  refresh: boolean;
  setRefresh: () => void;
  fetchData: (filters?: LocationFilter, searchText?: string) => Promise<void>;
}

// Function to transform API response to match Farmer Preview interface
export const transformApiFarmer = (apiResponse: ApiFarmer): FarmerPreview => {
  return {
    id: apiResponse.farmer_id,
    name: apiResponse.name,
    photo: apiResponse.profile_photo,
    code: formatIdAsCode('F', apiResponse.farmer_id),
    village: {name: apiResponse.village.name, code: apiResponse.village.code},
    guardian: apiResponse.guardian_name,
    phone: formatPhoneNumber(apiResponse.phone_number),
  };
};

export const buildFarmerSearchQueryParams = (searchText: string) => {
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
export const useFarmerStore = create<FarmerStore>((set, get) => ({
  data: [],
  loading: false,
  refresh: false,
  setRefresh: () => {
    set({refresh: true});
  },
  fetchData: async (
    locationFilters: LocationFilter = locationFilterDefaultValues,
    searchText: string = '',
  ) => {
    const queryParams = {
      ...buildFilterQueryParams(locationFilters),
      ...buildFarmerSearchQueryParams(searchText),
    };
    try {
      set({loading: true});
      const response = await api.get('farmers/', {
        params: queryParams,
      });
      set({data: response.data.map(transformApiFarmer)});
    } catch (error) {
      throw error;
    } finally {
      get().refresh
        ? set({loading: false, refresh: false})
        : set({loading: false});
    }
  },
}));

// useBeneficiaryStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {locationFilterDefaultValues} from '@components/FilterSheet';

// helpers, types
import {buildFilterQueryParams} from '@helpers/formHelpers';
import {formatIdAsCode, formatPhoneNumber} from '@helpers/formatters';
import {
  FarmerPreview,
  buildFarmerSearchQueryParams,
} from '@hooks/useFarmerStore';
import {Location} from '@hooks/locationHooks';
import {ApiUserType} from '@hooks/useProfileStore';
import {ApiImage, LocationFilter} from '@typedefs/common';
import {GENDER} from '@helpers/constants';

export interface ApiBeneficiary {
  beneficiary_id: number;
  profile_photo: ApiImage;
  id_front_image: ApiImage;
  id_back_image: ApiImage;
  village: Location & {
    block: Location & {
      district: Location & {
        state: Location;
      };
    };
  };
  id_hash: string;
  name: string;
  date_of_birth: string;
  phone_number: string;
  gender: (typeof GENDER)[number];
  address: string;
  guardian: string;
  added_by: ApiUserType;
  added_on: string;
  last_edited_by: ApiUserType;
  last_edited_on: string;
}

export type BeneficiaryPreview = FarmerPreview;

// Define the shape of the store
interface BeneficiaryStore {
  data: BeneficiaryPreview[];
  loading: boolean;
  refresh: boolean;
  setRefresh: () => void;
  fetchData: (filters?: LocationFilter, searchText?: string) => Promise<void>;
}

// Function to transform API response to match Beneficiary Preview interface
const transformApiBeneficiary = (
  apiResponse: ApiBeneficiary,
): BeneficiaryPreview => {
  return {
    id: apiResponse.beneficiary_id,
    name: apiResponse.name,
    photo: apiResponse.profile_photo,
    code: 'BA9854',
    village: {name: apiResponse.village.name, code: apiResponse.village.code},
    guardian: formatIdAsCode('F', parseInt(apiResponse.guardian, 10)),
    phone: formatPhoneNumber(apiResponse.phone_number),
  };
};

// Create the store
export const useBeneficiaryStore = create<BeneficiaryStore>((set, get) => ({
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
      const response = await api.get('beneficiaries/', {
        params: queryParams,
      });
      set({data: response.data.map(transformApiBeneficiary)});
    } catch (error) {
      throw error;
    } finally {
      get().refresh
        ? set({loading: false, refresh: false})
        : set({loading: false});
    }
  },
}));

// useLandStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';
import {locationFilterDefaultValues} from '@components/FilterSheet';

// helpers
import {buildFilterQueryParams} from '@helpers/formHelpers';
import {buildFarmerSearchQueryParams} from '@hooks/useFarmerStore';

// types
import {Location} from '@hooks/locationHooks';
import {ApiUserType} from '@hooks/useProfileStore';
import {ApiImage, LocationFilter} from '@typedefs/common';
import {Ownership} from '@helpers/constants';
import {formatIdAsCode} from '@helpers/formatters';

export interface ApiLand {
  id: number;
  ownership_type: Ownership;
  farmer: number;
  farmer_name: string;
  geo_trace: string;
  area: number;
  khasra_number: string;
  farm_workers: number;
  village: Location & {
    block: Location & {
      district: Location & {
        state: Location;
      };
    };
  };
  pictures: ApiImage[];
  added_by: ApiUserType;
  added_on: string;
  last_edited_by: ApiUserType;
  last_edited_on: string;
}

export interface LandPreview {
  id: number;
  ownership_type: Ownership;
  farmer: {id: number; name: string};
  picture: ApiImage;
  khasra_number: string;
  code: string;
  village: Location;
}

// Define the shape of the store
interface LandStore {
  data: LandPreview[];
  loading: boolean;
  refresh: boolean;
  setRefresh: () => void;
  fetchData: (filters?: LocationFilter, searchText?: string) => Promise<void>;
}

// Function to transform API response to match Land Preview interface
export const transformApiLand = (apiResponse: ApiLand): LandPreview => {
  let {
    id,
    farmer,
    pictures,
    village,
    ownership_type,
    khasra_number,
    farmer_name,
  } = apiResponse;
  return {
    id,
    farmer: {id: farmer, name: farmer_name},
    picture: pictures[0] ?? null,
    code: formatIdAsCode('L', id),
    village: {name: village.name, code: village.code},
    ownership_type,
    khasra_number,
  };
};

// Create the store
export const useLandStore = create<LandStore>((set, get) => ({
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
      const response = await api.get('land-parcels/', {
        params: queryParams,
      });
      set({data: response.data.map(transformApiLand)});
    } catch (error) {
      throw error;
    } finally {
      get().refresh
        ? set({loading: false, refresh: false})
        : set({loading: false});
    }
  },
}));

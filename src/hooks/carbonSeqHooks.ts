import {create} from 'zustand';
import {api} from '@api/axios';

// helpers, types, constants
import {formatIdAsCode} from '@helpers/formatters';
import {buildFilterQueryParams} from '@helpers/formHelpers';
import {buildFarmerSearchQueryParams} from '@hooks/useFarmerStore';
import {ApiLand, LandPreview, transformApiLand} from '@hooks/useLandStore';
import {ApiImage, LocationFilter} from '@typedefs/common';
import {locationFilterDefaultValues} from '@components/FilterSheet';

// constants
export const MODELS = [
  'MODEL_1_1',
  'MODEL_1_2',
  'MODEL_2_1',
  'MODEL_2_2',
  'MODEL_3',
  'MODEL_4',
] as const;

export const ACTIVITY_KEYS = [
  'total_pits_target',
  'total_pits_dug',
  'total_pits_fertilized',
  'total_pits_planted',
] as const;

// types
export type Model = (typeof MODELS)[number];
export type ActivityKey = (typeof ACTIVITY_KEYS)[number];

type ProgressItemActivity = {
  [key in ActivityKey]: number;
};

export interface ProgressItem extends ProgressItemActivity {
  id: number;
  carbon_sequestration: number;
  model: Model;
}

export interface ApiParticipant {
  id: number;
  land_parcel: ApiLand;
  carbon_waiver_document: ApiImage;
  agreement_document_type: ApiImage;
  gram_panchayat_resolution: ApiImage;
  progress: ProgressItem[];
  total_pits_target: number;
  total_pits_dug: number;
  total_pits_fertilized: number;
  total_pits_planted: number;
}

export interface ParticipantPreview {
  id: number;
  total_pits_target: number;
  total_pits_dug: number;
  total_pits_fertilized: number;
  total_pits_planted: number;
  land: LandPreview;
}

// Define the shape of the store
interface ParticipantStore {
  data: ParticipantPreview[];
  loading: boolean;
  refresh: boolean;
  setRefresh: () => void;
  fetchData: (filters?: LocationFilter, searchText?: string) => Promise<void>;
}

// Function to transform API response to match Participant Preview interface
const transformApiParticipant = (
  apiResponse: ApiParticipant,
): ParticipantPreview => {
  return {
    id: apiResponse.id,
    total_pits_target: apiResponse.total_pits_target,
    total_pits_dug: apiResponse.total_pits_dug,
    total_pits_fertilized: apiResponse.total_pits_fertilized,
    total_pits_planted: apiResponse.total_pits_planted,
    land: transformApiLand(apiResponse.land_parcel),
  };
};

// Create the store
export const useParticipantStore = create<ParticipantStore>((set, get) => ({
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
      const response = await api.get('projects/1/', {
        params: queryParams,
      });
      set({data: response.data.map(transformApiParticipant)});
    } catch (error) {
      throw error;
    } finally {
      get().refresh
        ? set({loading: false, refresh: false})
        : set({loading: false});
    }
  },
}));

type ModelWiseActivityValue = {
  [key in Model]: number;
};

export interface ActivityTableRow extends ModelWiseActivityValue {
  id: number;
  landCode: string;
  farmerName: string;
  total: number;
}

const toActivityTableRow = (
  apiResponse: ApiParticipant,
  activity: ActivityKey,
): ActivityTableRow => {
  const {id, land_parcel, progress} = apiResponse;
  const {id: landId, farmer_name: farmerName} = land_parcel;

  const row: ActivityTableRow = {
    id,
    landCode: formatIdAsCode('L', landId),
    farmerName,
    total: 0,
    ...(Object.fromEntries(MODELS.map(model => [model, 0])) as Record<
      Model,
      number
    >),
  };

  progress.forEach(progressItem => {
    const activityValue = progressItem[activity];
    const model = progressItem.model;
    row[model] = activityValue;
    row.total += activityValue;
  });

  return row;
};

export interface ActivityStore {
  data: ActivityTableRow[];
  loading: boolean;
  refresh: boolean;
  setRefresh: () => void;
  fetchData: (filters?: LocationFilter) => Promise<void>;
}

function createActivityStore(activity: ActivityKey) {
  return create<ActivityStore>((set, get) => ({
    data: [],
    loading: false,
    refresh: false,
    setRefresh: () => {
      set({refresh: true});
    },
    fetchData: async (
      locationFilters: LocationFilter = locationFilterDefaultValues,
    ) => {
      const queryParams = {
        ...buildFilterQueryParams(locationFilters),
      };
      try {
        set({loading: true});
        const response = await api.get('projects/1/', {
          params: queryParams,
        });
        set({
          data: response.data.map((entry: ApiParticipant) =>
            toActivityTableRow(entry, activity),
          ),
        });
      } catch (error) {
        throw error;
      } finally {
        get().refresh
          ? set({loading: false, refresh: false})
          : set({loading: false});
      }
    },
  }));
}

export const useTargetStore = createActivityStore('total_pits_target');
export const useDugStore = createActivityStore('total_pits_dug');
export const useFertilizedStore = createActivityStore('total_pits_fertilized');
export const usePlantedStore = createActivityStore('total_pits_planted');

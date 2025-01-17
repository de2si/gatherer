import {create} from 'zustand';
import {api} from '@api/axios';

export interface Location {
  code: number;
  name: string;
}

interface LocationStore {
  data: {[code: number]: Location[]};
  loading: boolean;
  fetchData: (codes: number[]) => Promise<void>;
  getItemsByCodes: (codes: number[]) => Location[];
  getFilteredCodes: (parentCodes: number[], childCodes: number[]) => number[];
}

interface StateStore {
  data: Location[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

function createLocationStore(baseWord: string, parentBaseWord: string) {
  return create<LocationStore>((set, get) => ({
    data: {},
    loading: false,
    fetchData: async (codes: number[]) => {
      if (codes && codes.length > 0) {
        try {
          set({loading: true});
          const existingData = get().data;

          const missingCodes = codes.filter(
            code => !(code in existingData) || existingData[code].length === 0,
          );

          const updates: {[code: number]: Location[]} = {};

          await Promise.all(
            missingCodes.map(async code => {
              const response = await api.get(
                `${parentBaseWord}-directory/${code}/${baseWord}-directory/`,
              );
              updates[code] = response.data[`${baseWord}Directory`].map(
                (item: Location) => ({
                  code: item.code,
                  name: `${item.code} - ${item.name}`,
                }),
              );
            }),
          );

          set({
            data: {
              ...existingData,
              ...updates,
            },
          });
        } catch (error) {
          throw error;
        } finally {
          set({loading: false});
        }
      }
    },
    getItemsByCodes: (codes: number[]) => {
      const data = get().data;
      return codes.flatMap(code => data[code] || []);
    },
    getFilteredCodes: (parentCodes: number[], childCodes: number[]) => {
      const data = get().data;
      return parentCodes
        .map(parentCode => data[parentCode])
        .filter(Boolean) // Remove undefined values
        .flatMap(childList =>
          childList
            .filter(childItem => childCodes.includes(childItem.code))
            .map(childItem => childItem.code),
        );
    },
  }));
}

export const useStateStore = create<StateStore>(set => ({
  data: [],
  loading: false,
  fetchData: async () => {
    try {
      set({loading: true});
      const response = await api.get('states-directory/');
      set({
        data: response.data.statesDirectory.map((item: Location) => ({
          code: item.code,
          name: `${item.code} - ${item.name}`,
        })),
      });
    } catch (error) {
      throw error;
    } finally {
      set({loading: false});
    }
  },
}));

export const useDistrictStore = createLocationStore('districts', 'states');
export const useBlockStore = createLocationStore('blocks', 'districts');
export const useVillageStore = createLocationStore('villages', 'blocks');

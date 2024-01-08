import {create} from 'zustand';
import {api} from '@api/axios';

interface Location {
  code: number;
  name: string;
}

interface LocationStore {
  data: {[code: number]: Location[]};
  loading: boolean;
  fetchData: (codes: number[]) => Promise<void>;
  getItemsByCodes: (codes: number[]) => Location[];
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
      try {
        set({loading: true});

        if (codes && codes.length > 0) {
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
              updates[code] = response.data[`${baseWord}Directory`];
            }),
          );

          set({
            data: {
              ...existingData,
              ...updates,
            },
          });
        }
      } catch (error) {
        console.error(`Error fetching ${baseWord}:`, error);
      } finally {
        set({loading: false});
      }
    },
    getItemsByCodes: (codes: number[]) => {
      const data = get().data;
      return codes.flatMap(code => data[code] || []);
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
      const fetchedStates = response.data.statesDirectory;
      set({data: fetchedStates});
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      set({loading: false});
    }
  },
}));

export const useDistrictStore = createLocationStore('districts', 'states');
export const useBlockStore = createLocationStore('blocks', 'districts');
export const useVillageStore = createLocationStore('villages', 'blocks');

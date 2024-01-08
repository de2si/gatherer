import {create} from 'zustand';
import {api} from '@api/axios';

interface State {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Block {
  code: number;
  name: string;
}

interface Village {
  code: number;
  name: string;
}

interface StateStore {
  stateData: State[];
  loadingState: boolean;
  fetchStateData: () => Promise<void>;
}

interface DistrictStore {
  districtData: {[stateCode: number]: District[]};
  loadingDistrict: boolean;
  fetchDistrictData: (stateCodes: number[] | undefined) => Promise<void>;
  getDistrictsByStateCodes: (stateCodes: number[]) => District[];
}

interface BlockStore {
  blockData: {[districtCode: number]: Block[]};
  loadingBlock: boolean;
  fetchBlockData: (districtCodes: number[] | undefined) => Promise<void>;
  getBlocksByDistrictCodes: (districtCodes: number[]) => Block[];
}

interface VillageStore {
  villageData: {[blockCode: number]: Village[]};
  loadingVillage: boolean;
  fetchVillageData: (blockCodes: number[] | undefined) => Promise<void>;
  getVillagesByBlockCodes: (blockCodes: number[]) => Village[];
}

export const useStateStore = create<StateStore>(set => ({
  stateData: [],
  loadingState: false,
  fetchStateData: async () => {
    try {
      set({loadingState: true});
      const response = await api.get('states-directory/');
      const fetchedStates = response.data.statesDirectory;
      set({stateData: fetchedStates});
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      set({loadingState: false});
    }
  },
}));

export const useDistrictStore = create<DistrictStore>((set, get) => ({
  districtData: {},
  loadingDistrict: false,
  fetchDistrictData: async (stateCodes: number[] | undefined) => {
    try {
      set({loadingDistrict: true});

      if (stateCodes && stateCodes.length > 0) {
        const existingDistrictData = get().districtData;

        const missingStateCodes = stateCodes.filter(
          stateCode =>
            !(stateCode in existingDistrictData) ||
            existingDistrictData[stateCode].length === 0,
        );

        const updates: {[stateCode: number]: District[]} = {};

        await Promise.all(
          missingStateCodes.map(async stateCode => {
            const response = await api.get(
              `states-directory/${stateCode}/districts-directory/`,
            );
            updates[stateCode] = response.data.districtsDirectory;
          }),
        );

        set({
          districtData: {
            ...existingDistrictData,
            ...updates,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      set({loadingDistrict: false});
    }
  },
  getDistrictsByStateCodes: (stateCodes: number[]) => {
    const districtData = get().districtData;
    return stateCodes.flatMap(stateCode => districtData[stateCode] || []);
  },
}));

export const useBlockStore = create<BlockStore>((set, get) => ({
  blockData: {},
  loadingBlock: false,
  fetchBlockData: async (districtCodes: number[] | undefined) => {
    try {
      set({loadingBlock: true});

      if (districtCodes && districtCodes.length > 0) {
        const existingBlockData = get().blockData;

        const missingDistrictCodes = districtCodes.filter(
          districtCode =>
            !(districtCode in existingBlockData) ||
            existingBlockData[districtCode].length === 0,
        );

        const updates: {[districtCode: number]: Block[]} = {};

        await Promise.all(
          missingDistrictCodes.map(async districtCode => {
            const response = await api.get(
              `districts-directory/${districtCode}/blocks-directory/`,
            );
            updates[districtCode] = response.data.blocksDirectory;
          }),
        );

        set({
          blockData: {
            ...existingBlockData,
            ...updates,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      set({loadingBlock: false});
    }
  },
  getBlocksByDistrictCodes: (districtCodes: number[]) => {
    const blockData = get().blockData;
    return districtCodes.flatMap(districtCode => blockData[districtCode] || []);
  },
}));

export const useVillageStore = create<VillageStore>((set, get) => ({
  villageData: {},
  loadingVillage: false,
  fetchVillageData: async (blockCodes: number[] | undefined) => {
    try {
      set({loadingVillage: true});

      if (blockCodes && blockCodes.length > 0) {
        const existingVillageData = get().villageData;

        const missingBlockCodes = blockCodes.filter(
          blockCode =>
            !(blockCode in existingVillageData) ||
            existingVillageData[blockCode].length === 0,
        );

        const updates: {[blockCode: number]: Village[]} = {};

        await Promise.all(
          missingBlockCodes.map(async blockCode => {
            const response = await api.get(
              `blocks-directory/${blockCode}/villages-directory/`,
            );
            updates[blockCode] = response.data.villagesDirectory;
          }),
        );

        set({
          villageData: {
            ...existingVillageData,
            ...updates,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    } finally {
      set({loadingVillage: false});
    }
  },
  getVillagesByBlockCodes: (blockCodes: number[]) => {
    const villageData = get().villageData;
    return blockCodes.flatMap(blockCode => villageData[blockCode] || []);
  },
}));

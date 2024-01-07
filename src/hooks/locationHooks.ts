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
interface StateStore {
  stateData: State[];
  loadingState: boolean;
  fetchStateData: () => Promise<void>;
}

interface DistrictStore {
  districtData: District[];
  loadingDistrict: boolean;
  fetchDistrictData: (stateCodes: number[] | undefined) => Promise<void>;
}

interface BlockStore {
  blockData: Block[];
  loadingBlock: boolean;
  fetchBlockData: (districtCodes: number[] | undefined) => Promise<void>;
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

export const useDistrictStore = create<DistrictStore>(set => ({
  districtData: [],
  loadingDistrict: false,
  fetchDistrictData: async (stateCodes: number[] | undefined) => {
    try {
      set({loadingDistrict: true});
      if (stateCodes && stateCodes.length > 0) {
        const promises = stateCodes.map(async stateCode => {
          const response = await api.get(
            `states-directory/${stateCode}/districts-directory/`,
          );
          return response.data.districtsDirectory;
        });

        const districtDataList = await Promise.all(promises);
        const mergedDistrictData = districtDataList.flat(); // Flatten the array

        set({districtData: mergedDistrictData});
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      set({loadingDistrict: false});
    }
  },
}));

export const useBlockStore = create<BlockStore>(set => ({
  blockData: [],
  loadingBlock: false,
  fetchBlockData: async (districtCodes: number[] | undefined) => {
    try {
      set({loadingBlock: true});
      if (districtCodes && districtCodes.length > 0) {
        const promises = districtCodes.map(async districtCode => {
          const response = await api.get(
            `districts-directory/${districtCode}/blocks-directory/`,
          );
          return response.data.blocksDirectory;
        });

        const blockDataList = await Promise.all(promises);
        const mergedBlockData = blockDataList.flat(); // Flatten the array

        set({blockData: mergedBlockData});
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      set({loadingBlock: false});
    }
  },
}));

// useProjectStore.ts

import {create} from 'zustand';
import {api} from '@api/axios';

export interface Project {
  id: number;
  name: string;
  is_active: boolean;
}

// Define the shape of the store
interface ProjectStore {
  data: Project[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

// Create the store
export const useProjectStore = create<ProjectStore>(set => ({
  data: [],
  loading: false,
  fetchData: async () => {
    try {
      set({loading: true});
      const response = await api.get('projects/');
      set({
        data: response.data.projects,
      });
    } catch (error) {
      throw error;
    } finally {
      set({loading: false});
    }
  },
}));

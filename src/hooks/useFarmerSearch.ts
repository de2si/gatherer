// useFarmerSearch.ts

import {api} from '@api/axios';
import {useCallback, useEffect, useState} from 'react';

// helpers
import {getErrorMessage} from '@helpers/formHelpers';

// hooks
import {
  FarmerPreview,
  buildFarmerSearchQueryParams,
  transformApiFarmer,
} from '@hooks/useFarmerStore';
import {useAuthStore} from '@hooks/useAuthStore';
import useSnackbar from '@hooks/useSnackbar';

// Type Definitions
interface UseFarmerSearchResult {
  loading: boolean;
  data: FarmerPreview[];
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  snackbarVisible: boolean;
  snackbarMessage: string;
  dismissSnackbar: () => void;
}

// Create the hook for farmer search
export const useFarmerSearch = (): UseFarmerSearchResult => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<FarmerPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const withAuth = useAuthStore(store => store.withAuth);
  const {snackbarVisible, snackbarMessage, showSnackbar, dismissSnackbar} =
    useSnackbar('Farmer search error');

  const fetchData = useCallback(
    async (text: string = searchText) => {
      try {
        setLoading(true);
        if (text) {
          await withAuth(async () => {
            try {
              const response = await api.get('farmers/', {
                params: buildFarmerSearchQueryParams(text),
              });
              setData(response.data.map(transformApiFarmer));
            } catch (error) {
              throw error;
            }
          });
        } else {
          setData([]);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        showSnackbar(
          typeof errorMessage === 'string'
            ? errorMessage
            : errorMessage[0] ?? 'Error in searching farmers',
        );
      } finally {
        setLoading(false);
      }
    },
    [searchText, withAuth, showSnackbar],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    data,
    setSearchText,
    snackbarVisible,
    snackbarMessage,
    dismissSnackbar,
  };
};

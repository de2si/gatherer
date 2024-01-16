import {useCallback, useState} from 'react';

const useSnackbar = (initialMessage = 'Error') => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(initialMessage);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  return {
    snackbarVisible,
    snackbarMessage,
    showSnackbar,
    dismissSnackbar,
  };
};

export default useSnackbar;

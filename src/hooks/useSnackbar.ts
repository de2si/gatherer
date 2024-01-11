import {useState} from 'react';

const useSnackbar = (initialMessage = 'Error') => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(initialMessage);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const dismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return {
    snackbarVisible,
    snackbarMessage,
    showSnackbar,
    dismissSnackbar,
  };
};

export default useSnackbar;

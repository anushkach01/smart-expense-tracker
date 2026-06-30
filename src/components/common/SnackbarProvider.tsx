import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore } from '../../zustand/notificationStore';

const SnackbarProvider: React.FC = () => {
  const { snackbar, hideSnackbar } = useNotificationStore();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarProvider;
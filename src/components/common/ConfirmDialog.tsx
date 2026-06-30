import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningAmber sx={{ color: '#F59E0B', fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{ borderRadius: 2, flex: 1 }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ borderRadius: 2, flex: 1 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
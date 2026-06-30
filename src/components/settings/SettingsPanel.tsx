import React from 'react';
import {
  Card,
  Box,
  Typography,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  DarkMode,
  Notifications,
  Email,
  PhoneAndroid,
} from '@mui/icons-material';
import { useThemeStore } from '../../zustand/themeStore';
import { useNotificationStore } from '../../zustand/notificationStore';

const SettingsPanel: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const { settings, toggleEmailNotifications, togglePushNotifications } =
    useNotificationStore();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Appearance */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Appearance
        </Typography>
        <List disablePadding>
          <ListItem disablePadding sx={{ py: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: mode === 'dark' ? '#1E293B' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <DarkMode sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }} />
            </Box>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Dark Mode
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Enable dark mode for the application
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Card>

      {/* Notifications */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Notifications
        </Typography>
        <List disablePadding>
          {/* Email Notifications */}
          <ListItem disablePadding sx={{ py: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Email sx={{ color: '#3B82F6' }} />
            </Box>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Email Notifications
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Receive email notifications
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.emailNotifications}
                onChange={toggleEmailNotifications}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ my: 0.5 }} />

          {/* Push Notifications */}
          <ListItem disablePadding sx={{ py: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <PhoneAndroid sx={{ color: '#10B981' }} />
            </Box>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Push Notifications
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Receive push notifications
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={settings.pushNotifications}
                onChange={togglePushNotifications}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Card>

      {/* Preferences */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Preferences
        </Typography>
        <List disablePadding>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Currency
                </Typography>
              }
            />
          </ListItem>
          <TextField
            select
            fullWidth
            defaultValue="INR"
            size="small"
            sx={{ mt: 0.5 }}
          >
            <MenuItem value="INR">₹ INR — Indian Rupee</MenuItem>
            <MenuItem value="USD">$ USD — US Dollar</MenuItem>
            <MenuItem value="EUR">€ EUR — Euro</MenuItem>
            <MenuItem value="GBP">£ GBP — British Pound</MenuItem>
          </TextField>
        </List>
      </Card>
    </Box>
  );
};

export default SettingsPanel;
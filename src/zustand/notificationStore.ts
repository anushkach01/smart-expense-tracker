import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface SnackbarNotification {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
}

interface NotificationStore {
  settings: NotificationSettings;
  snackbar: SnackbarNotification;
  toggleEmailNotifications: () => void;
  togglePushNotifications: () => void;
  showSnackbar: (
    message: string,
    severity?: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  hideSnackbar: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      settings: {
        emailNotifications: true,
        pushNotifications: false,
      },
      snackbar: {
        id: '',
        message: '',
        severity: 'success',
        open: false,
      },
      toggleEmailNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            emailNotifications: !state.settings.emailNotifications,
          },
        })),
      togglePushNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            pushNotifications: !state.settings.pushNotifications,
          },
        })),
      showSnackbar: (message, severity = 'success') =>
        set({
          snackbar: {
            id: `snack-${Date.now()}`,
            message,
            severity,
            open: true,
          },
        }),
      hideSnackbar: () =>
        set((state) => ({
          snackbar: { ...state.snackbar, open: false },
        })),
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
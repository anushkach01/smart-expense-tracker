import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useThemeStore } from './zustand/themeStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import BudgetsPage from './pages/BudgetsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

const App: React.FC = () => {
  const mode = useThemeStore((state) => state.mode);
  const isDarkMode = mode === 'dark';

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#2563EB',
            light: '#3B82F6',
            dark: '#1D4ED8',
          },
          secondary: {
            main: '#10B981',
          },
          background: {
            default: isDarkMode ? '#0F172A' : '#F1F5F9',
            paper: isDarkMode ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: isDarkMode ? '#F1F5F9' : '#1E293B',
            secondary: isDarkMode ? '#94A3B8' : '#64748B',
          },
          error: {
            main: '#EF4444',
          },
          success: {
            main: '#10B981',
          },
          warning: {
            main: '#F59E0B',
          },
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 20px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow:
                  isDarkMode
                    ? '0 1px 3px rgba(0,0,0,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: 'none',
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="expenses/add" element={<AddExpensePage />} />
          <Route path="expenses/edit/:id" element={<EditExpensePage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
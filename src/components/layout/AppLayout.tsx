import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useSidebarStore } from '../../zustand/sidebarStore';
import SnackbarProvider from '../common/SnackbarProvider';

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isOpen, drawerWidth, closeMobileSidebar } = useSidebarStore();

  useEffect(() => {
    if (isMobile) {
      closeMobileSidebar();
    }
  }, [isMobile, closeMobileSidebar]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: {
            md: `calc(100% - ${isOpen ? drawerWidth : 0}px)`,
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
        }}
      >
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: '64px',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Global Snackbar */}
      <SnackbarProvider />
    </Box>
  );
};

export default AppLayout;
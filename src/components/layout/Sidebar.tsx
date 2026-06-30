import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  AccountBalanceWallet,
  Person,
  Assessment,
  Settings,
  TrendingUp,
} from '@mui/icons-material';
import { useSidebarStore } from '../../zustand/sidebarStore';
import useAppSelector from '../../hooks/useAppSelector';
import { selectUser } from '../../features/auth/authSlice';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Expenses', path: '/expenses', icon: <Receipt /> },
  { label: 'Budgets', path: '/budgets', icon: <AccountBalanceWallet /> },
  { label: 'Profile', path: '/profile', icon: <Person /> },
  { label: 'Reports', path: '/reports', icon: <Assessment /> },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, isMobileOpen, drawerWidth, closeMobileSidebar } =
    useSidebarStore();
  const user = useAppSelector(selectUser);

  const handleNavClick = useCallback(
    (path: string) => {
      navigate(path);
      if (isMobile) closeMobileSidebar();
    },
    [navigate, isMobile, closeMobileSidebar]
  );

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '1rem',
          }}
        >
          Smart Expense
        </Typography>
      </Box>

      <Divider />

      {/* Nav Items */}
      <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'white' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
              noWrap
              color="text.primary"
            >
              {user?.name || 'John Doe'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || 'john@example.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isMobileOpen}
          onClose={closeMobileSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop Drawer
        <Drawer
          variant="persistent"
          open={isOpen}
          sx={{
            width: isOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'fixed',
              height: '100vh',
              top: 0,
              left: 0,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
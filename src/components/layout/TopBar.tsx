import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  KeyboardArrowDown,
  Logout,
  Person,
  Settings,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useSidebarStore } from '../../zustand/sidebarStore';
import { useThemeStore } from '../../zustand/themeStore';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { logoutUser, selectUser } from '../../features/auth/authSlice';

const TopBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { toggleSidebar, toggleMobileSidebar, isOpen, drawerWidth } =
    useSidebarStore();
  const { mode, toggleTheme } = useThemeStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(async () => {
    handleMenuClose();
    await dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate, handleMenuClose]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  }, [isMobile, toggleSidebar, toggleMobileSidebar]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer - 1,
        width: {
          md: isOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        },
        ml: {
          md: isOpen ? `${drawerWidth}px` : 0,
        },
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: '64px !important' }}>
        {/* Menu Toggle */}
        <IconButton
          onClick={handleToggleSidebar}
          sx={{ color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            flex: 1,
            maxWidth: 400,
          }}
        >
          <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search anything..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: 'text.primary',
              '& input::placeholder': { color: 'text.secondary' },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
          <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            p: 0.5,
            borderRadius: 2,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{ width: 34, height: 34 }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
              {user?.name || 'John Doe'}
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ color: 'text.secondary', fontSize: 18 }} />
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: { mt: 1, minWidth: 180, borderRadius: 2 },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}
          >
            <Person sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/settings');
            }}
          >
            <Settings sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1.5, fontSize: 20, color: 'error.main' }} />
            <Typography variant="body2" color="error.main">
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
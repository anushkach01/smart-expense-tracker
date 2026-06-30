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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
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
  Circle,
} from '@mui/icons-material';

import { useSidebarStore } from '../../zustand/sidebarStore';
import { useThemeStore } from '../../zustand/themeStore';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  logoutUser,
  selectUser,
} from '../../features/auth/authSlice';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const TopBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const {
    toggleSidebar,
    toggleMobileSidebar,
    isOpen,
    drawerWidth,
  } = useSidebarStore();

  const { mode, toggleTheme } = useThemeStore();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const [searchValue, setSearchValue] = useState('');

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([
    {
      id: 1,
      title: 'Expense Added',
      description: 'Food expense of ₹450 added successfully.',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Budget Alert',
      description: 'Food budget has reached 90% of the limit.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Monthly Report',
      description: 'Your June expense report is now available.',
      time: 'Yesterday',
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

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
  }, [
    isMobile,
    toggleSidebar,
    toggleMobileSidebar,
  ]);

  return (    <AppBar
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
        {/* Sidebar Toggle */}
        <IconButton
          onClick={handleToggleSidebar}
          sx={{ color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            flex: 1,
            maxWidth: 420,
          }}
        >
          <Search
            sx={{
              color: 'text.secondary',
              mr: 1,
              fontSize: 20,
            }}
          />

          <InputBase
            placeholder="Search expenses..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.9rem',
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme */}
        <Tooltip
          title={
            mode === 'light'
              ? 'Switch to Dark Mode'
              : 'Switch to Light Mode'
          }
        >
          <IconButton
            onClick={toggleTheme}
            sx={{ color: 'text.secondary' }}
          >
            {mode === 'light' ? (
              <DarkMode />
            ) : (
              <LightMode />
            )}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationOpen}
            sx={{ color: 'text.secondary' }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
            >
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                width: 360,
                mt: 1,
                borderRadius: 3,
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Notifications
            </Typography>

            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="text.secondary"
              >
                You're all caught up 🎉
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    alignItems: 'flex-start',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemAvatar>
                    {notification.unread ? (
                      <Circle
                        color="primary"
                        sx={{ fontSize: 10 }}
                      />
                    ) : (
                      <Circle
                        color="disabled"
                        sx={{ fontSize: 10 }}
                      />
                    )}
                  </ListItemAvatar>

                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {notification.description}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.disabled"
                        >
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Menu>

        {/* User */}
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            p: 0.5,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{
              width: 36,
              height: 36,
            }}
          />

          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
            >
              {user?.name || 'John Doe'}
            </Typography>
          </Box>

          <KeyboardArrowDown
            sx={{
              fontSize: 18,
              color: 'text.secondary',
            }}
          />
        </Box>        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 260,
                borderRadius: 3,
              },
            },
          }}
        >
          {/* User Info */}
          <Box sx={{ px: 2, py: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{
                  width: 48,
                  height: 48,
                }}
              />

              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                >
                  {user?.name || 'John Doe'}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {user?.email || 'john@example.com'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}
          >
            <Person
              sx={{
                mr: 1.5,
                fontSize: 20,
              }}
            />

            Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/settings');
            }}
          >
            <Settings
              sx={{
                mr: 1.5,
                fontSize: 20,
              }}
            />

            Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: 'error.main',
            }}
          >
            <Logout
              sx={{
                mr: 1.5,
              }}
            />

            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
import React, { useEffect } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  updateProfile,
  fetchProfile,
  selectProfile,
} from '../../features/profile/profileSlice';
import { useNotificationStore } from '../../zustand/notificationStore';
import { profileService } from '../../services/profileService';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

const ProfileForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const { showSnackbar } = useNotificationStore();
  const [avatar, setAvatar] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
      });
      setAvatar(profile.avatar || '');
    }
  }, [profile, reset]);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await profileService.uploadAvatar(file);
      setAvatar(base64);
      showSnackbar('Avatar updated', 'success');
    } catch {
      showSnackbar('Failed to upload avatar', 'error');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    try {
      await dispatch(
        updateProfile({
          ...profile,
          ...data,
          avatar,
        })
      );
      showSnackbar('Profile updated successfully', 'success');
    } catch {
      showSnackbar('Failed to update profile', 'error');
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Profile Information
      </Typography>

      {/* Avatar Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatar}
            alt={profile?.name}
            sx={{
              width: 100,
              height: 100,
              fontSize: '2rem',
              bgcolor: 'primary.main',
            }}
          >
            {profile?.name?.charAt(0) || 'U'}
          </Avatar>
          <label htmlFor="avatar-upload">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <IconButton
              component="span"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <PhotoCamera sx={{ fontSize: 16 }} />
            </IconButton>
          </label>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1.5 }}>
          {profile?.name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.email || ''}
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
          {/* Full Name */}
          <Box>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>

          {/* Email */}
          <Box>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>

          {/* Phone */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Controller
              name="phone"
              control={control}
              rules={{ required: 'Phone is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            {/* Location */}
            <Controller
              name="location"
              control={control}
              rules={{ required: 'Location is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
          </Box>

          {/* Submit */}
          <Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !isDirty}
              sx={{ py: 1.5, mt: 1 }}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileForm;
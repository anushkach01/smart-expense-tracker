import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Profile"
        subtitle="View and update your profile"
      />
      <ProfileForm />
    </Box>
  );
};

export default ProfilePage;
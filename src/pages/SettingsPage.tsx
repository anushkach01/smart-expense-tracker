import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import SettingsPanel from '../components/settings/SettingsPanel';

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
      />
      <SettingsPanel />
    </Box>
  );
};

export default SettingsPage;
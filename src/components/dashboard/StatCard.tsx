import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(
  ({ title, value, change, changeLabel, icon, iconBgColor }) => {
    const isPositive = change >= 0;

    return (
      <Card sx={{ p: 2.5, height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 1, fontWeight: 700 }}
              color="text.primary"
            >
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                color={isPositive ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 600 }}
              >
                {isPositive ? '+' : ''}
                {change}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {changeLabel}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
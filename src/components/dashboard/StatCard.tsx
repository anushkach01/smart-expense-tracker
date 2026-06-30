import React from 'react';
import { Box, Card, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = React.memo(
  ({
    title,
    value,
    change,
    changeLabel,
    icon,
    iconBgColor,
    onClick,
  }) => {
    const isPositive = change >= 0;

    return (
      <Card
        onClick={onClick}
        elevation={0}
        sx={{
          p: 2.5,
          height: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.25s ease',

          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Chip
                size="small"
                icon={
                  isPositive ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )
                }
                label={`${isPositive ? '+' : ''}${change}%`}
                color={isPositive ? 'success' : 'error'}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {changeLabel}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
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
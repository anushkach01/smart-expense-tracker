import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 0.5 }}>
            {breadcrumbs.map((crumb, index) =>
              crumb.path ? (
                <Link
                  key={index}
                  component="button"
                  variant="caption"
                  onClick={() => navigate(crumb.path!)}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography
                  key={index}
                  variant="caption"
                  color="text.secondary"
                >
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import useAppSelector from '../../hooks/useAppSelector';
import { selectExpenses } from '../../features/expenses/expenseSlice';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatShortDate } from '../../utils/formatDate';

const RecentTransactions: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const expenses = useAppSelector(selectExpenses);

  const recentExpenses = useMemo(
    () => [...expenses].slice(0, 5),
    [expenses]
  );

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Transactions
        </Typography>
        <Button
          size="small"
          onClick={() => navigate('/expenses')}
          sx={{ fontWeight: 600, fontSize: '0.8rem' }}
        >
          View All
        </Button>
      </Box>

      <List disablePadding>
        {recentExpenses.map((expense, index) => {
          const config = getCategoryConfig(expense.category);
          const Icon = config.Icon;

          return (
            <React.Fragment key={expense.id}>
              <ListItem disablePadding sx={{ py: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: config.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color: config.color }} />
                  </Box>

                  {/* Title & Category */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                      color="text.primary"
                      noWrap
                    >
                      {expense.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {expense.category}
                    </Typography>
                  </Box>

                  {/* Amount & Date */}
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                      color="error.main"
                    >
                      -{formatCurrency(expense.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatShortDate(expense.date)}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              {index < recentExpenses.length - 1 && (
                <Divider sx={{ opacity: 0.5 }} />
              )}
            </React.Fragment>
          );
        })}

        {recentExpenses.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No transactions yet
            </Typography>
          </Box>
        )}
      </List>
    </Card>
  );
});

RecentTransactions.displayName = 'RecentTransactions';

export default RecentTransactions;
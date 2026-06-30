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
  Chip,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

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

  const getDisplayDate = (date: string) => {
    const today = new Date();
    const expenseDate = new Date(date);

    const todayString = today.toDateString();
    const expenseString = expenseDate.toDateString();

    if (todayString === expenseString) {
      return 'Today';
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (expenseString === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return formatShortDate(date);
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Recent Transactions
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Last 5 expenses
          </Typography>
        </Box>

        <Button
          endIcon={<ArrowForward />}
          size="small"
          onClick={() => navigate('/expenses')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          View All
        </Button>
      </Box>

      <List disablePadding>        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense, index) => {
            const config = getCategoryConfig(expense.category);
            const Icon = config.Icon;

            return (
              <React.Fragment key={expense.id}>
                <ListItem
                  disablePadding
                  sx={{
                    py: 1.5,
                    px: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: 2,
                    }}
                  >
                    {/* Category Icon */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        bgcolor: config.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 22,
                          color: config.color,
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                      >
                        {expense.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {expense.category}
                      </Typography>
                    </Box>

                    {/* Amount */}
                    <Box
                      sx={{
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      <Chip
                        label={`-${formatCurrency(expense.amount)}`}
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {getDisplayDate(expense.date)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>

                {index < recentExpenses.length - 1 && (
                  <Divider
                    sx={{
                      ml: 7,
                      opacity: 0.4,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1 }}
            >
              🧾
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight={600}
            >
              No Transactions Yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 2,
              }}
            >
              Start tracking your expenses to
              see them here.
            </Typography>

            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/expenses')}
            >
              Add Expense
            </Button>
          </Box>
        )}
      </List>
    </Card>
  );
});

RecentTransactions.displayName = 'RecentTransactions';

export default RecentTransactions;
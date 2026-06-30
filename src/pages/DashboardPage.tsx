import React, { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  AccountBalanceWallet,
  Receipt,
  Savings,
  Category,
} from '@mui/icons-material';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  fetchExpenses,
  selectExpenses,
  selectExpenseLoading,
} from '../features/expenses/expenseSlice';
import {
  fetchBudgets,
  selectBudgets,
} from '../features/budgets/budgetSlice';
import { selectUser } from '../features/auth/authSlice';
import StatCard from '../components/dashboard/StatCard';
import SpendingChart from '../components/dashboard/SpendingChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { calculateDashboardStats } from '../utils/calculateStats';
import { formatCurrency } from '../utils/formatCurrency';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const expenses = useAppSelector(selectExpenses);
  const budgets = useAppSelector(selectBudgets);
  const loading = useAppSelector(selectExpenseLoading);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchBudgets());
  }, [dispatch]);

  const stats = useMemo(
    () => calculateDashboardStats(expenses, budgets),
    [expenses, budgets]
  );

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }} color="text.primary">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.name?.split(' ')[0] || 'John'}! 👋
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {currentDate}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}
      >
        <Box>
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            change={stats.expenseChange}
            changeLabel="from last month"
            iconBgColor="#DBEAFE"
            icon={<Receipt sx={{ color: '#3B82F6', fontSize: 24 }} />}
          />
        </Box>
        <Box>
          <StatCard
            title="Monthly Budget"
            value={formatCurrency(stats.monthlyBudget)}
            change={stats.budgetChange}
            changeLabel="from last month"
            iconBgColor="#EDE9FE"
            icon={
              <AccountBalanceWallet sx={{ color: '#8B5CF6', fontSize: 24 }} />
            }
          />
        </Box>
        <Box>
          <StatCard
            title="Savings"
            value={formatCurrency(stats.savings)}
            change={stats.savingsChange}
            changeLabel="from last month"
            iconBgColor="#D1FAE5"
            icon={<Savings sx={{ color: '#10B981', fontSize: 24 }} />}
          />
        </Box>
        <Box>
          <StatCard
            title="Categories"
            value={String(stats.totalCategories)}
            change={2}
            changeLabel="from last month"
            iconBgColor="#FEF3C7"
            icon={<Category sx={{ color: '#F59E0B', fontSize: 24 }} />}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <SpendingChart />
        </Box>
        <Box>
          <RecentTransactions />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
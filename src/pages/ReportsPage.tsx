import React, { useEffect, useMemo } from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  fetchExpenses,
  selectExpenses,
  selectExpenseLoading,
} from '../features/expenses/expenseSlice';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { getCategoryConfig } from '../utils/categoryConfig';

const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);
  const loading = useAppSelector(selectExpenseLoading);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      const month = new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        year: '2-digit',
      }).format(new Date(e.date));
      totals[month] = (totals[month] || 0) + e.amount;
    });
    return Object.entries(totals).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [expenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Insights into your spending" />

      <Card sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Total Spent
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {formatCurrency(totalSpent)}
        </Typography>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        <Card sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Spending by Category
          </Typography>
          <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: 8, border: 'none' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Monthly Trend
          </Typography>
          <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: 8, border: 'none' }}
                />
                <Bar dataKey="amount" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box>

      <Card sx={{ p: 2.5, mt: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Category Breakdown
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {categoryData.map((item) => {
            const config = getCategoryConfig(item.category);
            const pct = totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100) : 0;
            return (
              <Box
                key={item.category}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: config.color,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {pct}%
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(item.amount)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {categoryData.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No expense data yet
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ReportsPage;

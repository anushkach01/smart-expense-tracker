import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';

import { fetchExpenses, selectExpenseLoading } from '../features/expenses/expenseSlice';

import PageHeader from '../components/common/PageHeader';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectExpenseLoading);
  const expenses = useAppSelector(
    (state) => state.expenses.expenses
  );

  useEffect(() => {
    if (expenses.length === 0) {
      dispatch(fetchExpenses());
    }
  }, [dispatch, expenses.length]);

  const handleAddExpense = useCallback(() => {
    navigate('/expenses/add');
  }, [navigate]);

  if (loading && expenses.length === 0) {
    return (
      <LoadingSpinner message="Loading expenses..." />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage your expenses"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddExpense}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              fontWeight: 600,
            }}
          >
            Add Expense
          </Button>
        }
      />

      <ExpenseFilters />

      <ExpenseTable />
    </Box>
  );
};

export default ExpensesPage;
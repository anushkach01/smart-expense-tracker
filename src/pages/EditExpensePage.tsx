import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  fetchExpenses,
  selectExpenses,
  type Expense,
} from '../features/expenses/expenseSlice';
import PageHeader from '../components/common/PageHeader';
import ExpenseForm from '../components/expenses/ExpenseForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);

  useEffect(() => {
    if (expenses.length === 0) {
      dispatch(fetchExpenses());
    }
  }, [dispatch, expenses.length]);

  const expense = expenses.find((e: Expense) => e.id === id);

  if (expenses.length === 0) {
    return <LoadingSpinner message="Loading expense..." />;
  }

  if (!expense) {
    navigate('/expenses');
    return null;
  }

  return (
    <Box>
      <PageHeader
        title="Edit Expense"
        subtitle="Update expense details"
        breadcrumbs={[
          { label: 'Expenses', path: '/expenses' },
          { label: 'Edit Expense' },
        ]}
      />
      <ExpenseForm expense={expense} isEdit />
    </Box>
  );
};

export default EditExpensePage;
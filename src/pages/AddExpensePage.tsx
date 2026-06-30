import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import ExpenseForm from '../components/expenses/ExpenseForm';

const AddExpensePage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Add Expense"
        subtitle="Add a new expense"
        breadcrumbs={[
          { label: 'Expenses', path: '/expenses' },
          { label: 'Add Expense' },
        ]}
      />
      <ExpenseForm />
    </Box>
  );
};

export default AddExpensePage;
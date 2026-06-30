import React, { useEffect, useCallback, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  fetchBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  selectBudgets,
  selectBudgetLoading,
  Budget,
} from '../features/budgets/budgetSlice';
import PageHeader from '../components/common/PageHeader';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotificationStore } from '../zustand/notificationStore';

const BudgetsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector(selectBudgets);
  const loading = useAppSelector(selectBudgetLoading);
  const { showSnackbar } = useNotificationStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    setEditBudget(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((budget: Budget) => {
    setEditBudget(budget);
    setFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormOpen(false);
    setEditBudget(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: Omit<Budget, 'id'>) => {
      if (editBudget) {
        await dispatch(updateBudget({ ...data, id: editBudget.id }));
        showSnackbar('Budget updated successfully', 'success');
      } else {
        await dispatch(addBudget(data));
        showSnackbar('Budget added successfully', 'success');
      }
      handleFormClose();
    },
    [dispatch, editBudget, showSnackbar, handleFormClose]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return;
    await dispatch(deleteBudget(deleteId));
    setDeleteId(null);
    showSnackbar('Budget deleted successfully', 'success');
  }, [deleteId, dispatch, showSnackbar]);

  if (loading && budgets.length === 0) {
    return <LoadingSpinner message="Loading budgets..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Budgets"
        subtitle="Track and manage your budgets"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            sx={{ borderRadius: 2 }}
          >
            Add Budget
          </Button>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        {budgets.map((budget: Budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </Box>

      <BudgetForm
        open={formOpen}
        budget={editBudget}
        isEdit={!!editBudget}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default BudgetsPage;
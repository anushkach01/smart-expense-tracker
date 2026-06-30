import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Card,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  addExpense,
  updateExpense,
  Expense,
} from '../../features/expenses/expenseSlice';
import { CATEGORIES } from '../../utils/categoryConfig';
import { formatInputDate } from '../../utils/formatDate';
import { useNotificationStore } from '../../zustand/notificationStore';

interface ExpenseFormData {
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface ExpenseFormProps {
  expense?: Expense;
  isEdit?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useNotificationStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      title: '',
      category: '',
      amount: 0,
      date: formatInputDate(new Date().toISOString()),
      description: '',
    },
  });

  useEffect(() => {
    if (expense && isEdit) {
      reset({
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        date: formatInputDate(expense.date),
        description: expense.description,
      });
    }
  }, [expense, isEdit, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEdit && expense) {
        await dispatch(
          updateExpense({
            ...expense,
            ...data,
            amount: Number(data.amount),
          })
        );
        showSnackbar('Expense updated successfully', 'success');
      } else {
        await dispatch(
          addExpense({
            ...data,
            amount: Number(data.amount),
          })
        );
        showSnackbar('Expense added successfully', 'success');
      }
      navigate('/expenses');
    } catch {
      showSnackbar('Something went wrong', 'error');
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {isEdit ? 'Edit Expense' : 'Add New Expense'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Title */}
        <Box>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                placeholder="Enter title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Box>

        {/* Amount & Category */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          {/* Amount */}
          <Box>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  placeholder="Enter amount"
                  type="number"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Typography
                          sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}
                        >
                          ₹
                        </Typography>
                      ),
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Category */}
          <Box>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Category"
                  fullWidth
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="" disabled>
                    Select category
                  </MenuItem>
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Box>

        {/* Date */}
        <Box>
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                fullWidth
                error={!!errors.date}
                helperText={errors.date?.message}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            )}
          />
        </Box>

        {/* Description */}
        <Box>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description (Optional)"
                placeholder="Enter description"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/expenses')}
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 140 }}
          >
            {isSubmitting
              ? 'Saving...'
              : isEdit
              ? 'Update Expense'
              : 'Save Expense'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ExpenseForm;
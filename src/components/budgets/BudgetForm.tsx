import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { Budget } from '../../features/budgets/budgetSlice';
import { CATEGORIES } from '../../utils/categoryConfig';

interface BudgetFormData {
  name: string;
  category: string;
  limit: number;
  spent: number;
}

interface BudgetFormProps {
  open: boolean;
  budget?: Budget | null;
  isEdit?: boolean;
  onSubmit: (data: Omit<Budget, 'id'>) => void;
  onClose: () => void;
}

const iconMap: Record<string, string> = {
  Food: 'restaurant',
  Travel: 'flight',
  Shopping: 'shopping_bag',
  Bills: 'receipt',
  Entertainment: 'movie',
  Others: 'more_horiz',
};

const BudgetForm: React.FC<BudgetFormProps> = ({
  open,
  budget,
  isEdit = false,
  onSubmit,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: {
      name: '',
      category: '',
      limit: 0,
      spent: 0,
    },
  });

  useEffect(() => {
    if (budget && isEdit) {
      reset({
        name: budget.name,
        category: budget.category,
        limit: budget.limit,
        spent: budget.spent,
      });
    } else {
      reset({
        name: '',
        category: '',
        limit: 0,
        spent: 0,
      });
    }
  }, [budget, isEdit, reset, open]);

  const handleFormSubmit = async (data: BudgetFormData) => {
    onSubmit({
      name: data.name,
      category: data.category,
      limit: Number(data.limit),
      spent: Number(data.spent),
      icon: iconMap[data.category] || 'more_horiz',
      userId: '',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEdit ? 'Edit Budget' : 'Add New Budget'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update your budget details' : 'Create a new budget'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Name */}
          <Box>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Budget name is required' }}
                render={({ field }: { field: ControllerRenderProps<BudgetFormData, 'name'> }) => (
                  <TextField
                    {...field}
                    label="Budget Name"
                    placeholder="e.g. Food Budget"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
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
                render={({ field }: { field: ControllerRenderProps<BudgetFormData, 'category'> }) => (
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

          {/* Amount Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {/* Allocated Amount */}
            <Box>
              <Controller
                name="limit"
                control={control}
                rules={{
                  required: 'Allocated amount is required',
                  min: { value: 1, message: 'Must be greater than 0' },
                }}
                render={({ field }: { field: ControllerRenderProps<BudgetFormData, 'limit'> }) => (
                  <TextField
                    {...field}
                    label="Allocated Amount"
                    type="number"
                    fullWidth
                    error={!!errors.limit}
                    helperText={errors.limit?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography
                            sx={{
                              mr: 0.5,
                              color: 'text.secondary',
                              fontSize: '0.9rem',
                            }}
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

            {/* Spent Amount */}
            <Box>
              <Controller
                name="spent"
                control={control}
                rules={{
                  required: 'Spent amount is required',
                  min: { value: 0, message: 'Cannot be negative' },
                }}
                render={({ field }: { field: ControllerRenderProps<BudgetFormData, 'spent'> }) => (
                  <TextField
                    {...field}
                    label="Spent Amount"
                    type="number"
                    fullWidth
                    error={!!errors.spent}
                    helperText={errors.spent?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography
                            sx={{
                              mr: 0.5,
                              color: 'text.secondary',
                              fontSize: '0.9rem',
                            }}
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
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Budget' : 'Add Budget'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm;
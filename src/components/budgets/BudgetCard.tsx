import React, { useCallback } from 'react';
import {
  Card,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  Restaurant,
  Flight,
  ShoppingBag,
  Receipt,
  Movie,
  MoreHoriz,
} from '@mui/icons-material';
import { Budget } from '../../features/budgets/budgetSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateBudgetProgress } from '../../utils/calculateStats';
import { getCategoryConfig } from '../../utils/categoryConfig';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  restaurant: <Restaurant />,
  flight: <Flight />,
  shopping_bag: <ShoppingBag />,
  receipt: <Receipt />,
  movie: <Movie />,
  more_horiz: <MoreHoriz />,
};

const BudgetCard: React.FC<BudgetCardProps> = React.memo(
  ({ budget, onEdit, onDelete }) => {
    const { percentage, isOverBudget } = calculateBudgetProgress(budget);
    const config = getCategoryConfig(budget.category);

    const progressColor = isOverBudget
      ? 'error'
      : percentage >= 80
      ? 'warning'
      : 'success';

    const handleEdit = useCallback(() => {
      onEdit(budget);
    }, [budget, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(budget.id);
    }, [budget.id, onDelete]);

    return (
      <Card sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          {/* Left: Icon + Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: config.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: config.color,
              }}
            >
              {budget.icon && iconMap[budget.icon] ? iconMap[budget.icon] : <MoreHoriz />}
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }} color="text.primary">
                {budget.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {budget.category}
              </Typography>
            </Box>
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{ color: 'primary.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Budget Amount */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Spent
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
            {formatCurrency(budget.spent)} /
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
            >
              {formatCurrency(budget.limit)}
            </Typography>
          </Typography>
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={progressColor}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'action.hover',
            mb: 1,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />

        {/* Percentage + Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="caption"
            color={isOverBudget ? 'error.main' : 'text.secondary'}
            sx={{ fontWeight: 600 }}
          >
            {percentage}% used
          </Typography>
          {isOverBudget ? (
            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
              Over budget!
            </Typography>
          ) : (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
              {formatCurrency(budget.limit - budget.spent)} left
            </Typography>
          )}
        </Box>
      </Card>
    );
  }
);

BudgetCard.displayName = 'BudgetCard';

export default BudgetCard;
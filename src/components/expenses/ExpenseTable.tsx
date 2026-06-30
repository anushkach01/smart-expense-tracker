import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Paper,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  deleteExpense,
  selectFilteredExpenses,
  type Expense,
} from '../../features/expenses/expenseSlice';
import { getCategoryConfig } from '../../utils/categoryConfig';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import ConfirmDialog from '../common/ConfirmDialog';
import { useNotificationStore } from '../../zustand/notificationStore';

const ExpenseTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectFilteredExpenses);
  const { showSnackbar } = useNotificationStore();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const paginatedExpenses = useMemo(
    () => expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [expenses, page, rowsPerPage]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/expenses/edit/${id}`);
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await dispatch(deleteExpense(deleteId));
    setDeleteLoading(false);
    setDeleteId(null);
    showSnackbar('Expense deleted successfully', 'success');
  }, [deleteId, dispatch, showSnackbar]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteId(null);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    []
  );

  return (
    <>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.map((expense: Expense) => {
                const config = getCategoryConfig(expense.category);
                return (
                  <TableRow
                    key={expense.id}
                    hover
                    sx={{ '&:last-child td': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {expense.title}
                      </Typography>
                      {expense.description && (
                        <Typography variant="caption" color="text.secondary">
                          {expense.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.category}
                        size="small"
                        sx={{
                          bgcolor: config.bgColor,
                          color: config.color,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                        color="error.main"
                      >
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(expense.date)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(expense.id)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(expense.id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { bgcolor: '#FEF2F2' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginatedExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No expenses found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 7, 10, 25]}
          component="div"
          count={expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />
    </>
  );
};

export default ExpenseTable;
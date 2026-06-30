import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Expense {
  id: string;
  title?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  userId?: string;
}

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterCategory: string;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
  searchQuery: '',
  filterCategory: 'All',
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { default: expenses } = await import('../../mock/expenses.json');
      return expenses as Expense[];
    } catch {
      return rejectWithValue('Failed to fetch expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/add',
  async (expense: Omit<Expense, 'id'>, { rejectWithValue }) => {
    try {
      const newExpense: Expense = {
        ...expense,
        id: `exp-${Date.now()}`,
      };
      return newExpense;
    } catch {
      return rejectWithValue('Failed to add expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async (expense: Expense, { rejectWithValue }) => {
    try {
      return expense;
    } catch {
      return rejectWithValue('Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return id;
    } catch {
      return rejectWithValue('Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterCategory(state, action: PayloadAction<string>) {
      state.filterCategory = action.payload;
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.filterCategory = 'All';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setFilterCategory, clearFilters } =
  expenseSlice.actions;

export const selectExpenses = (state: RootState) => state.expenses.expenses;
export const selectExpenseLoading = (state: RootState) => state.expenses.loading;
export const selectExpenseError = (state: RootState) => state.expenses.error;
export const selectSearchQuery = (state: RootState) => state.expenses.searchQuery;
export const selectFilterCategory = (state: RootState) => state.expenses.filterCategory;
export const selectFilteredExpenses = (state: RootState) => {
  const { expenses, searchQuery, filterCategory } = state.expenses;
  return expenses.filter((e) => {
    const matchesSearch = e.title?.toLowerCase()
    .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
};

export default expenseSlice.reducer;
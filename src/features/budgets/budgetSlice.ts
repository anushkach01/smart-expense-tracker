import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  userId: string;
  name?: string;
  icon?: string;
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { default: budgets } = await import('../../mock/budgets.json');
      return (budgets as unknown as Array<{ id: string; name: string; category: string; allocated: number; spent: number; icon: string }>).map(b => ({
        ...b,
        limit: b.allocated,
        userId: 'user-1',
      })) as Budget[];
    } catch {
      return rejectWithValue('Failed to fetch budgets');
    }
  }
);

export const addBudget = createAsyncThunk(
  'budgets/add',
  async (budget: Omit<Budget, 'id'>, { rejectWithValue }) => {
    try {
      return { ...budget, id: `bud-${Date.now()}` };
    } catch {
      return rejectWithValue('Failed to add budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async (budget: Budget, { rejectWithValue }) => {
    try {
      return budget;
    } catch {
      return rejectWithValue('Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return id;
    } catch {
      return rejectWithValue('Failed to delete budget');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.budgets[index] = action.payload;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      });
  },
});

export const selectBudgets = (state: RootState) => state.budgets.budgets;
export const selectBudgetLoading = (state: RootState) => state.budgets.loading;
export default budgetSlice.reducer;
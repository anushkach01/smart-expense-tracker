import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import budgetReducer from '../features/budgets/budgetSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    budgets: budgetReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
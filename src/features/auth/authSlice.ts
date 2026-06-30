import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  rememberMe: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { default: users } = await import('../../mock/users.json');
      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );
      if (!user) {
        return rejectWithValue('Invalid email or password');
      }
      const token = `mock-token-${user.id}-${Date.now()}`;
      if (credentials.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    } catch {
      return rejectWithValue('Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setRememberMe(state, action: PayloadAction<boolean>) {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, setRememberMe } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

export default authSlice.reducer;
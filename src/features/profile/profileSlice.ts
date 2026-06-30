import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return rejectWithValue('No user found');
      return user as Profile;
    } catch {
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profile: Profile, { rejectWithValue }) => {
    try {
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch {
      return rejectWithValue('Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export default profileSlice.reducer;
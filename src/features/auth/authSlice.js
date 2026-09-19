import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login as loginRequest } from '../../services/authService.js';
import { getStoredToken, setStoredToken } from '../../services/apiClient.js';

const initialState = {
  token: getStoredToken(),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const { token } = await loginRequest(username, password);
    return token;
  } catch (err) {
    return rejectWithValue(err.message || 'No fue posible iniciar sesión');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      setStoredToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
        setStoredToken(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;

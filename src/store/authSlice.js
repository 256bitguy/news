import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi.js';
import { getToken, setToken, clearToken } from '../utils/tokenStorage.js';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user, accessToken } = await authApi.adminLogin(email, password);
      setToken(accessToken);
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || err.message
      );
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    if (!getToken()) {
      // no token stored — don't bother hitting the server, just report
      // "no session" so the UI resolves immediately on page load
      return rejectWithValue(null);
    }
    try {
      return await authApi.getCurrentUser();
    } catch (err) {
      clearToken(); // stored token is stale/invalid — drop it
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutAdmin = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch {
    // best-effort — clear the local token regardless of server response
  }
  clearToken();
  return null;
});

const initialState = {
  user: null, // { _id, fullName, email, role, ... }
  status: 'idle', // idle | checking | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
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
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      })
      .addCase(checkSession.pending, (state) => {
        state.status = 'checking';
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
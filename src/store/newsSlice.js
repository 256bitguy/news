import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/newsApi.js';

const todayStr = () => new Date().toISOString().slice(0, 10);

export const loadNewsByDate = createAsyncThunk(
  'news/loadByDate',
  async (date, { rejectWithValue }) => {
    try {
      return { date, items: await api.getNewsByDate(date) };
    } catch (err) {
      if (err.response?.status === 404) return { date, items: [] };
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const loadImportantNews = createAsyncThunk(
  'news/loadImportant',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getImportantNews();
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const searchNews = createAsyncThunk(
  'news/search',
  async (title, { rejectWithValue }) => {
    try {
      return await api.searchNewsByTitle(title);
    } catch (err) {
      if (err.response?.status === 404) return [];
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const submitNews = createAsyncThunk(
  'news/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.createNews(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const editNews = createAsyncThunk(
  'news/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await api.updateNews(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const removeNews = createAsyncThunk(
  'news/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteNews(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const toggleImportant = createAsyncThunk(
  'news/toggleImportant',
  async ({ id, isImportant }, { rejectWithValue }) => {
    try {
      return await api.updateNews(id, { isImportant: !isImportant });
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  selectedDate: todayStr(),
  byDate: {}, // { [date]: NewsItem[] }
  important: [],
  searchResults: [],
  searchTerm: '',
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,
  createStatus: 'idle',
  createError: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    clearCreateStatus(state) {
      state.createStatus = 'idle';
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNewsByDate.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(loadNewsByDate.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.byDate[action.payload.date] = action.payload.items;
      })
      .addCase(loadNewsByDate.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload;
      })
      .addCase(loadImportantNews.fulfilled, (state, action) => {
        state.important = action.payload;
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(submitNews.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(submitNews.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const item = action.payload;
        const list = state.byDate[item.date] || [];
        state.byDate[item.date] = [...list, item];
      })
      .addCase(submitNews.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload;
      })
      .addCase(editNews.fulfilled, (state, action) => {
        const item = action.payload;
        const list = state.byDate[item.date];
        if (list) {
          state.byDate[item.date] = list.map((n) =>
            n._id === item._id ? item : n
          );
        }
        state.important = state.important.map((n) =>
          n._id === item._id ? item : n
        );
      })
      .addCase(toggleImportant.fulfilled, (state, action) => {
        const item = action.payload;
        const list = state.byDate[item.date];
        if (list) {
          state.byDate[item.date] = list.map((n) =>
            n._id === item._id ? item : n
          );
        }
      })
      .addCase(removeNews.fulfilled, (state, action) => {
        const id = action.payload;
        Object.keys(state.byDate).forEach((date) => {
          state.byDate[date] = state.byDate[date].filter((n) => n._id !== id);
        });
        state.important = state.important.filter((n) => n._id !== id);
      });
  },
});

export const { setSelectedDate, setSearchTerm, clearCreateStatus } =
  newsSlice.actions;

export default newsSlice.reducer;

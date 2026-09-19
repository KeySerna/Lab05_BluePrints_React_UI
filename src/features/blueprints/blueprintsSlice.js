import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import blueprintsService from '../../services/blueprintsService.js';

const initialState = {
  byAuthor: {}, // { [author]: {name, points}[] }
  current: null, // { author, name, points } | null
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  openStatus: 'idle',
  openError: null,
  createStatus: 'idle',
  createError: null,
};

export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  async (author, { rejectWithValue }) => {
    try {
      const plans = await blueprintsService.getByAuthor(author);
      return { author, plans };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al consultar los planos del autor');
    }
  }
);

export const openBlueprint = createAsyncThunk(
  'blueprints/openBlueprint',
  async ({ author, name }, { rejectWithValue }) => {
    try {
      const plan = await blueprintsService.getByAuthorAndName(author, name);
      return { author, ...plan };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al abrir el plano');
    }
  }
);

export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async ({ author, blueprint }, { rejectWithValue }) => {
    try {
      const created = await blueprintsService.create(author, blueprint);
      return { author, ...created };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al crear el plano');
    }
  }
);

const blueprintsSlice = createSlice({
  name: 'blueprints',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchByAuthor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchByAuthor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.byAuthor[action.payload.author] = action.payload.plans;
      })
      .addCase(fetchByAuthor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(openBlueprint.pending, (state) => {
        state.openStatus = 'loading';
        state.openError = null;
      })
      .addCase(openBlueprint.fulfilled, (state, action) => {
        state.openStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(openBlueprint.rejected, (state, action) => {
        state.openStatus = 'failed';
        state.openError = action.payload ?? action.error.message;
      })
      .addCase(createBlueprint.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createBlueprint.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        const { author, ...plan } = action.payload;
        state.byAuthor[author] = [...(state.byAuthor[author] || []), plan];
      })
      .addCase(createBlueprint.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload ?? action.error.message;
      });
  },
});

export const { clearCurrent } = blueprintsSlice.actions;

// Selectores
export const selectPlansByAuthor = (author) => (state) => state.blueprints.byAuthor[author] || [];
export const selectCurrentBlueprint = (state) => state.blueprints.current;
export const selectFetchStatus = (state) => state.blueprints.status;
export const selectFetchError = (state) => state.blueprints.error;
export const selectCreateStatus = (state) => state.blueprints.createStatus;
export const selectCreateError = (state) => state.blueprints.createError;

// Selector memoizado: top-5 de blueprints por cantidad de puntos, entre
// todos los autores consultados hasta el momento.
export const selectTop5ByPoints = (state) => {
  const all = Object.entries(state.blueprints.byAuthor).flatMap(([author, plans]) =>
    plans.map((p) => ({ author, ...p, pointCount: p.points.length }))
  );
  return [...all].sort((a, b) => b.pointCount - a.pointCount).slice(0, 5);
};

export default blueprintsSlice.reducer;

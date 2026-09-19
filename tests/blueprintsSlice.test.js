import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import blueprintsReducer, {
  fetchByAuthor,
  openBlueprint,
  selectPlansByAuthor,
} from '../src/features/blueprints/blueprintsSlice.js';

function makeStore() {
  return configureStore({ reducer: { blueprints: blueprintsReducer } });
}

describe('blueprintsSlice reducers (puros)', () => {
  it('has the expected initial state', () => {
    const state = blueprintsReducer(undefined, { type: '@@INIT' });
    expect(state.status).toBe('idle');
    expect(state.byAuthor).toEqual({});
    expect(state.current).toBeNull();
  });

  it('sets status to loading on fetchByAuthor.pending', () => {
    const state = blueprintsReducer(undefined, { type: fetchByAuthor.pending.type });
    expect(state.status).toBe('loading');
  });

  it('stores the plans on fetchByAuthor.fulfilled', () => {
    const payload = { author: 'jmiranda', plans: [{ name: 'plano-a', points: [{ x: 0, y: 0 }] }] };
    const state = blueprintsReducer(undefined, { type: fetchByAuthor.fulfilled.type, payload });
    expect(state.status).toBe('succeeded');
    expect(state.byAuthor.jmiranda).toEqual(payload.plans);
  });

  it('records the error on fetchByAuthor.rejected', () => {
    const state = blueprintsReducer(undefined, {
      type: fetchByAuthor.rejected.type,
      payload: 'boom',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('boom');
  });

  it('sets the current blueprint on openBlueprint.fulfilled', () => {
    const payload = { author: 'jmiranda', name: 'plano-a', points: [{ x: 1, y: 1 }] };
    const state = blueprintsReducer(undefined, { type: openBlueprint.fulfilled.type, payload });
    expect(state.current).toEqual(payload);
  });
});

describe('blueprintsSlice thunks (dispatch con store real)', () => {
  it('dispatches fetchByAuthor and updates state with results from the mock service', async () => {
    const store = makeStore();

    await store.dispatch(fetchByAuthor('jmiranda'));

    const state = store.getState();
    const plans = selectPlansByAuthor('jmiranda')(state);
    expect(state.blueprints.status).toBe('succeeded');
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toHaveProperty('points');
  });
});

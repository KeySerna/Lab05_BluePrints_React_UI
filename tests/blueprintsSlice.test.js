import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import blueprintsReducer, {
  createBlueprint,
  deleteBlueprint,
  fetchByAuthor,
  openBlueprint,
  selectPlansByAuthor,
  updateBlueprint,
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

  it('creates, updates and deletes a blueprint end-to-end against the mock service', async () => {
    const store = makeStore();
    const author = 'test-author';
    const name = 'test-plan';

    // create
    await store.dispatch(createBlueprint({ author, blueprint: { name, points: [{ x: 1, y: 1 }] } }));
    let plans = selectPlansByAuthor(author)(store.getState());
    expect(plans.find((p) => p.name === name)).toBeTruthy();

    // update (optimistic + confirmado por el servidor)
    const newPoints = [{ x: 5, y: 5 }, { x: 9, y: 9 }];
    await store.dispatch(updateBlueprint({ author, name, points: newPoints }));
    plans = selectPlansByAuthor(author)(store.getState());
    expect(plans.find((p) => p.name === name).points).toEqual(newPoints);

    // delete
    await store.dispatch(deleteBlueprint({ author, name }));
    plans = selectPlansByAuthor(author)(store.getState());
    expect(plans.find((p) => p.name === name)).toBeUndefined();
  });

  it('optimistically updates and then reverts when the server rejects it', async () => {
    const store = makeStore();
    const author = 'jmiranda';
    // "fake-plan" existe en el estado local (simulando datos ya cargados)
    // pero NO en el servicio mock, así que el update será rechazado.
    const original = { name: 'fake-plan', points: [{ x: 1, y: 1 }] };
    store.dispatch({ type: fetchByAuthor.fulfilled.type, payload: { author, plans: [original] } });

    const newPoints = [{ x: 9, y: 9 }];
    await store.dispatch(updateBlueprint({ author, name: 'fake-plan', points: newPoints }));

    const after = selectPlansByAuthor(author)(store.getState()).find((p) => p.name === 'fake-plan');
    expect(after).toEqual(original); // revertido al valor original
    expect(store.getState().blueprints.updateStatus).toBe('failed');
  });
});

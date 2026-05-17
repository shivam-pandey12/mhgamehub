// @ts-check

/**
 * @template T
 * @param {T} initialState
 * @param {(state: T, action: { type: string; payload?: any }) => T} reducer
 */
export function createStore(initialState, reducer) {
  let state = initialState;
  const listeners = new Set();

  return {
    /**
     * @returns {T}
     */
    getState() {
      return state;
    },
    /**
     * @param {(state: T) => void} listener
     * @returns {() => void}
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /**
     * @param {{ type: string; payload?: any }} action
     */
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((listener) => listener(state));
      return action;
    },
  };
}

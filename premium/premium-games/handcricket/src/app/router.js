// @ts-check

import { ACTIONS } from "../state/actions.js";

/**
 * @param {ReturnType<import("../state/store.js").createStore>} store
 * @param {Record<string, (state: import("../types/models").AppState) => string>} registry
 */
export function wireRouter(store, registry) {
  let syncing = false;

  const normalize = (hash) => {
    const route = hash.replace(/^#\/?/, "") || "home";
    return registry[route] ? route : "home";
  };

  window.addEventListener("hashchange", () => {
    if (syncing) {
      return;
    }

    store.dispatch({ type: ACTIONS.NAVIGATE, payload: normalize(window.location.hash) });
  });

  store.subscribe((state) => {
    const nextHash = `#/${state.route}`;
    if (window.location.hash === nextHash) {
      return;
    }

    syncing = true;
    window.location.hash = nextHash;
    window.setTimeout(() => {
      syncing = false;
    }, 0);
  });

  store.dispatch({ type: ACTIONS.NAVIGATE, payload: normalize(window.location.hash) });
}

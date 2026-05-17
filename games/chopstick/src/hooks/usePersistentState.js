import { useEffect, useState } from "react";

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      return;
    }
  }, [key, state]);

  return [state, setState];
}

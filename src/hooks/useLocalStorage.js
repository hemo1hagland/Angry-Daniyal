import { useState, useEffect, useCallback } from "react";

// Enkel hook som synker en state-verdi mot localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const lagret = window.localStorage.getItem(key);
      return lagret !== null ? JSON.parse(lagret) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorer (f.eks. full storage eller privat modus)
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}

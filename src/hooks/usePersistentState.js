import { useEffect, useState } from "react";

export default function usePersistentState(key, fallbackValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? fallbackValue : JSON.parse(stored);
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // A private browser window may reject storage; gameplay still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}

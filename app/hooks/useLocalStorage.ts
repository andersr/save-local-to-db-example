import { useEffect, useState } from "react";

import { useIsMounted } from "./useIsMounted";

export function useLocalStorage(key: string, initialValue: any) {
  const isMounted = useIsMounted();

  useEffect(() => {
    const value = window?.localStorage.getItem(key);
    setState(value ? JSON.parse(value) : initialValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState(() => {
    try {
      if (!isMounted) {
        return initialValue;
      }
      const value = window?.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.error(error);
    }
  });

  const setValue = (value: any) => {
    try {
      if (!isMounted) {
        return;
      }
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setValue];
}

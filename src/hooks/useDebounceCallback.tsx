import { useCallback, useRef } from "react";


export default function useDebounceCallback<T>(func: (...args: any[]) => T, delay: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  return useCallback(
    (...args: any[]) => {
      const later = () => {
        clearTimeout(timerRef.current);
        func(...args);
      };

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(later, delay);
    },
    [func, delay]
  );
}



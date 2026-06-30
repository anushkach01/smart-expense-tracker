import { useState, useEffect, useRef } from 'react';

function useThrottle<T>(value: T, limit: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = limit - (now - lastUpdated.current);

    if (remaining <= 0) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

export default useThrottle;
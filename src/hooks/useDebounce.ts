import { useEffect, useState } from 'react';

export const DEFAULT_DEBOUNCE_DELAY = 300;

// Debounce a value for a certain delay,
// Usefull for autocompletes request for example.
function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_DELAY): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default useDebounce;

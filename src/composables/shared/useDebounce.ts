import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the given value.
 * The returned value only updates after the specified delay
 * has passed without `value` changing.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}

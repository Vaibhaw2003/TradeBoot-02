import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

// ─── useAsync: generic async wrapper ─────────────────────────────────────────
export function useAsync(asyncFn, immediate = false) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  useEffect(() => {
    if (immediate) execute()
  }, [immediate])

  return { data, loading, error, execute }
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// ─── useLocalStorage ──────────────────────────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error(err)
    }
  }

  return [storedValue, setValue]
}

// ─── useStockSearch ───────────────────────────────────────────────────────────
export function useStockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 350)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) { setResults([]); return }
    setLoading(true)
    import('../services/stockService').then(({ stockService }) => {
      stockService.search(debouncedQuery)
        .then(data => setResults(data?.results || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    })
  }, [debouncedQuery])

  return { query, setQuery, results, loading }
}

// ─── useCopyToClipboard ───────────────────────────────────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])
  return [copied, copy]
}

// ─── useInterval ─────────────────────────────────────────────────────────────
export function useInterval(callback, delay) {
  useEffect(() => {
    if (delay == null) return
    const id = setInterval(callback, delay)
    return () => clearInterval(id)
  }, [callback, delay])
}

// ─── usePageTitle ─────────────────────────────────────────────────────────────
export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — TradeBoot AI` : 'TradeBoot AI'
    return () => { document.title = prev }
  }, [title])
}

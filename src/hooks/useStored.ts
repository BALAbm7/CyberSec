import { useCallback, useEffect, useState } from 'react'
export function useStored<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void, () => void] {
  const [v, setV] = useState<T>(() => { try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : init } catch { return init } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }, [key, v])
  const reset = useCallback(() => setV(init), [init])
  return [v, setV, reset]
}

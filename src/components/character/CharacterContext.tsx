import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
export type CharState = 'idle'|'walking'|'pointing'|'clicking'|'dragging'|'explaining'|'investigating'|'alert'|'success'|'error'
interface Ctx { state: CharState; line: string; act: (s: CharState, line?: string, ms?: number) => void; hidden: boolean; setHidden: (b: boolean) => void }
const C = createContext<Ctx | null>(null)
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CharState>('idle')
  const [line, setLine] = useState("Hi, I'm Kei. Hover the menu and I'll show you around.")
  const [hidden, setHiddenRaw] = useState(() => localStorage.getItem('cybersec.charHidden') === '1')
  const t = useRef<number>()
  const act = useCallback((s: CharState, l?: string, ms = 1800) => {
    setState(s); if (l) setLine(l)
    window.clearTimeout(t.current); t.current = window.setTimeout(() => setState('idle'), ms)
  }, [])
  const setHidden = useCallback((b: boolean) => { setHiddenRaw(b); localStorage.setItem('cybersec.charHidden', b ? '1' : '0') }, [])
  const v = useMemo(() => ({ state, line, act, hidden, setHidden }), [state, line, act, hidden, setHidden])
  return <C.Provider value={v}>{children}</C.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCharacter() { const c = useContext(C); if (!c) throw new Error('useCharacter outside provider'); return c }

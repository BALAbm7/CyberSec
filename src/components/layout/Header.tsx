import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import type { Hit } from '../../features/search'
export function Header({ onMenu }: { onMenu: () => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState(''); const [hits, setHits] = useState<Hit[]>([])
  const run = async (v: string) => { setQ(v); const m = await import('../../features/search'); setHits(m.search(v)) }
  const go = (h: Hit) => { setQ(''); setHits([]); nav(h.to) }
  return (
    <header className="flex items-center gap-3 p-3 border-b border-deep bg-bg2/80 backdrop-blur sticky top-0 z-20">
      <button className="md:hidden" aria-label="Open menu" onClick={onMenu}><Menu /></button>
      <div className="relative flex-1 max-w-md">
        <label className="flex items-center gap-2 glass px-3 py-1.5 text-sm"><Search size={14} className="text-mute" />
          <input aria-label="Search modules, scenarios, attacks, glossary, assets" placeholder="Search modules, attacks, terms…" value={q} onChange={e => run(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && hits[0]) go(hits[0]); if (e.key === 'Escape') { setQ(''); setHits([]) } }} className="bg-transparent flex-1 outline-none" /></label>
        {hits.length > 0 && <ul className="absolute left-0 right-0 mt-1 glass bg-bg2 p-1 z-30 text-sm">{hits.map(h => <li key={h.kind + h.label}><button onClick={() => go(h)} className="w-full text-left px-2 py-1 rounded hover:bg-deep">{h.label} <span className="text-xs text-mute">{h.kind}</span></button></li>)}</ul>}
        {q && !hits.length && <p className="absolute left-0 right-0 mt-1 glass bg-bg2 p-2 text-xs text-mute z-30">No results.</p>}
      </div>
      <span className="ml-auto text-xs font-mono text-accent border border-deep rounded px-2 py-1">SIMULATED DATA</span>
    </header>)
}

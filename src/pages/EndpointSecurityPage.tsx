import { useState } from 'react'
import { ENDPOINTS, ACTIONS, type Ev, type Kind } from '../data/endpointLab'
import { H, Intro, Pre, Tabs } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
const KINDS: Kind[] = ['process', 'file', 'auth', 'network', 'persistence']
export default function EndpointSecurityPage() {
  const { act } = useCharacter()
  const [os, setOs] = useState<'win' | 'lin'>('win')
  const [sel, setSel] = useState<string | null>(null)
  const [kinds, setKinds] = useState<Set<Kind>>(new Set(KINDS))
  const [isolated, setIsolated] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState('')
  const ep = ENDPOINTS.find(e => e.id === os) ?? ENDPOINTS[0]
  const ev = ep.events.find(e => e.id === sel)
  const iso = !!isolated[os]
  const shown = ep.events.filter(e => kinds.has(e.kind))
  const tree = (parent?: string, d = 0): React.ReactNode => ep.events.filter(e => e.kind === 'process' && e.parent === parent).map(e => (
    <li key={e.id} style={{ marginLeft: d * 16 }}><button onClick={() => pick(e)} className={`text-left text-xs font-mono hover:text-accent ${e.sus ? 'text-crit' : ''} ${sel === e.id ? 'underline' : ''}`}>{d ? '└─ ' : ''}{e.text}</button><ul>{tree(e.id, d + 1)}</ul></li>))
  const pick = (e: Ev) => { setSel(e.id); act(e.sus ? 'alert' : 'explaining', e.sus ? 'This one looks suspicious. See why.' : 'Normal on its own, but check the context.', 2500) }
  const run = (id: string) => {
    const a = ACTIONS.find(x => x.id === id); if (!a) return
    setMsg(a.result)
    if (id === 'isolate') { setIsolated(s => ({ ...s, [os]: true })); act('success', "Let's isolate the compromised endpoint. Done (simulated).", 3000) } else act('explaining', a.label, 2000)
  }
  const toggle = (k: Kind) => setKinds(p => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n.size ? n : new Set(KINDS) })
  return (
    <section>
      <Intro title="Endpoint Security Lab">Investigate simulated Windows and Linux endpoint telemetry. Select an event to see why it is or is not suspicious, then try safe containment options. Everything is synthetic.</Intro>
      <div className="mt-4"><Tabs<'win' | 'lin'> tabs={[['win', 'Windows endpoint'], ['lin', 'Linux server']]} value={os} onChange={v => { setOs(v); setSel(null); setMsg('') }} /></div>
      <div className="mt-4 glass p-3 text-sm"><b>{ep.name}</b> · user {ep.user} · <span className={iso ? 'text-crit' : 'text-accent'}>{iso ? 'ISOLATED (simulated)' : 'Online'}</span><p className="text-xs text-mute mt-1">{ep.tools}</p></div>
      <div className="mt-4 grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="glass p-4 min-w-0">
          <H>Process tree</H><ul>{tree(undefined)}</ul>
          <H>Events</H>
          <div className="flex flex-wrap gap-1.5 mb-2">{KINDS.map(k => <button key={k} aria-pressed={kinds.has(k)} onClick={() => toggle(k)} className={`text-xs px-2 py-0.5 rounded border ${kinds.has(k) ? 'border-accent text-accent' : 'border-deep text-mute'}`}>{k}</button>)}</div>
          <ul className="space-y-1">{shown.map(e => <li key={e.id}><button onClick={() => pick(e)} className={`w-full text-left text-sm p-1.5 rounded border ${sel === e.id ? 'border-accent' : 'border-transparent hover:border-deep'}`}>
            <span className="font-mono text-xs text-mute">{e.time}</span> <span className="text-[10px] uppercase text-info">{e.kind}</span> {e.text}{iso && e.kind === 'network' && <span className="text-xs text-warn"> (would now be blocked)</span>}</button></li>)}</ul>
        </div>
        <aside className="space-y-4">
          <div className="glass p-4" aria-live="polite"><h2 className="text-sm font-semibold">Event details</h2>
            {ev ? <div><p className={`mt-1 text-xs font-semibold ${ev.sus ? 'text-crit' : 'text-accent'}`}>{ev.sus ? 'Suspicious' : 'Likely benign on its own'}</p><p className="mt-1 text-sm text-mute">{ev.why}</p><div className="mt-2"><Pre>{ev.raw}</Pre></div></div> : <p className="mt-1 text-sm text-mute">Select an event.</p>}</div>
          <div className="glass p-4"><h2 className="text-sm font-semibold">Containment (simulated)</h2>
            <div className="mt-2 flex flex-col gap-1.5">{ACTIONS.map(a => <button key={a.id} onClick={() => run(a.id)} className="text-left text-sm border border-deep rounded px-2 py-1 hover:border-accent">{a.label}</button>)}</div>
            {msg && <p className="mt-2 text-xs text-mute" aria-live="polite">{msg}</p>}
            {iso && <button onClick={() => { setIsolated(s => ({ ...s, [os]: false })); setMsg('Host released.') }} className="mt-2 text-xs border border-deep rounded px-2 py-1">Release host</button>}
            <p className="mt-2 text-[11px] text-mute">No real device or tool is affected.</p></div>
        </aside>
      </div>
    </section>)
}

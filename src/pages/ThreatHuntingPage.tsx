import { useMemo, useState } from 'react'
import { DATASETS, HUNT_NOTE, type Row } from '../data/huntLab'
import { H, Intro, Pre, Tabs } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
type Q = 'kql' | 'aql' | 'sql'
interface TL { ds: string; r: Row }
export default function ThreatHuntingPage() {
  const { act } = useCharacter()
  const [dsId, setDs] = useState(DATASETS[0].id); const [fi, setFi] = useState(-1)
  const [hypo, setHypo] = useState(''); const [pivot, setPivot] = useState(''); const [tl, setTl] = useState<TL[]>([]); const [notes, setNotes] = useState(''); const [q, setQ] = useState<Q>('kql')
  const ds = DATASETS.find(d => d.id === dsId) ?? DATASETS[0]
  const f = fi >= 0 ? ds.filters[fi] : null
  const rows = ds.rows.filter(r => !f || r[f.field].toLowerCase().includes(f.contains.toLowerCase()))
  const related = useMemo(() => pivot ? DATASETS.flatMap(d => d.rows.filter(r => [r.host, r.user, r.ip].includes(pivot)).map(r => ({ ds: d.name, r }))) : [], [pivot])
  const add = (x: TL) => setTl(t => (t.some(y => y.ds === x.ds && y.r === x.r) ? t : [...t, x].sort((a, b) => a.r.t.localeCompare(b.r.t))))
  const summary = `Hypothesis: ${hypo || '(not set)'}\nEvents on timeline: ${tl.length}${tl.length ? '\n' + tl.map(x => `${x.r.t} [${x.ds}] ${x.r.host || x.r.user || x.r.ip}: ${x.r.event} ${x.r.detail}`).join('\n') : ''}\nFindings: ${notes || '(none recorded)'}`
  const Cell = ({ v }: { v: string }) => v ? <button onClick={() => { setPivot(v); act('investigating', `Pivoting on ${v}.`, 2000) }} className="text-info hover:underline">{v}</button> : <span className="text-mute">-</span>
  const qt = q === 'kql' ? ds.kql : q === 'sql' ? ds.sql : ds.aql
  return (
    <section>
      <Intro title="Threat Hunting Lab">Form a hypothesis, filter synthetic datasets, pivot on a host, user, or IP across all of them, build a timeline, and write a summary. Data is bundled sample data; no SIEM is contacted.</Intro>
      <div className="mt-4 grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="glass p-4 min-w-0">
          <label className="text-xs font-mono uppercase text-accent" htmlFor="hy">Hypothesis</label>
          <input id="hy" value={hypo} onChange={e => setHypo(e.target.value)} placeholder="e.g. A user device is beaconing to a newly seen destination" className="mt-1 w-full bg-bg2 border border-deep rounded px-3 py-1.5 text-sm" />
          <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Datasets">{DATASETS.map(d => <button key={d.id} role="tab" aria-selected={d.id === dsId} onClick={() => { setDs(d.id); setFi(-1); setQ('kql') }} className={`text-xs px-2 py-1 rounded border ${d.id === dsId ? 'border-accent text-accent bg-deep' : 'border-deep text-mute'}`}>{d.name}</button>)}</div>
          <div className="mt-2 flex gap-1.5 text-xs items-center">Filter: <button onClick={() => setFi(-1)} aria-pressed={fi === -1} className={`px-2 py-0.5 rounded border ${fi === -1 ? 'border-accent text-accent' : 'border-deep text-mute'}`}>All</button>{ds.filters.map((x, i) => <button key={x.label} onClick={() => setFi(i)} aria-pressed={fi === i} className={`px-2 py-0.5 rounded border ${fi === i ? 'border-accent text-accent' : 'border-deep text-mute'}`}>{x.label}</button>)}</div>
          <div className="mt-2 overflow-x-auto"><table className="w-full text-xs"><thead className="text-left text-mute"><tr><th>Time</th><th>Host</th><th>User</th><th>IP</th><th>Event</th><th>Detail</th><th></th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-deep align-top"><td className="py-1 pr-2 font-mono">{r.t}</td><td className="pr-2"><Cell v={r.host} /></td><td className="pr-2"><Cell v={r.user} /></td><td className="pr-2"><Cell v={r.ip} /></td><td className="pr-2">{r.event}</td><td className="pr-2 text-mute">{r.detail}</td><td><button onClick={() => add({ ds: ds.name, r })} className="text-accent" aria-label="Add to timeline">+</button></td></tr>)}
              {!rows.length && <tr><td colSpan={7} className="py-2 text-mute">No matching events.</td></tr>}</tbody></table></div>
          {pivot && <div className="mt-3"><H>Pivot: {pivot} across all datasets <button onClick={() => setPivot('')} className="ml-2 text-xs text-mute">clear</button></H>
            <ul className="text-xs space-y-1">{related.map((x, i) => <li key={i}><span className="font-mono">{x.r.t}</span> <span className="text-info">[{x.ds}]</span> {x.r.event}: <span className="text-mute">{x.r.detail}</span> <button onClick={() => add(x)} className="text-accent">add</button></li>)}</ul></div>}
          <H>Example queries (illustrative)</H>
          <Tabs<Q> tabs={[['kql', 'KQL'], ['aql', 'AQL'], ['sql', 'SQL-like']]} value={q} onChange={setQ} />
          <div className="mt-2">{qt ? <Pre>{qt}</Pre> : <p className="text-xs text-mute">No AQL example for this dataset.</p>}</div>
          <p className="mt-2 text-xs text-warn">{HUNT_NOTE}</p>
        </div>
        <aside className="space-y-4">
          <div className="glass p-4"><h2 className="text-sm font-semibold">Timeline ({tl.length})</h2>
            <ul className="mt-1 text-xs space-y-1">{tl.map((x, i) => <li key={i}><span className="font-mono">{x.r.t}</span> [{x.ds}] {x.r.event}</li>)}</ul>{!!tl.length && <button onClick={() => setTl([])} className="mt-2 text-xs border border-deep rounded px-2 py-0.5">Clear</button>}</div>
          <div className="glass p-4"><label htmlFor="nt" className="text-sm font-semibold">Findings</label><textarea id="nt" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 w-full bg-bg2 border border-deep rounded p-2 text-xs" /><H>Investigation summary</H><Pre>{summary}</Pre></div>
        </aside>
      </div>
    </section>)
}

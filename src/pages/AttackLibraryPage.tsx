import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ATTACKS, type Tag } from '../data/attackLibrary'
import { H, Intro } from '../components/ui/Primitives'
const TAGS: Tag[] = ['Endpoint', 'Email', 'Identity', 'Windows', 'Linux', 'Network', 'Cloud', 'OT', 'Web application', 'Container/K8s', 'Data protection', 'Incident response']
export default function AttackLibraryPage() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? ''); const [tag, setTag] = useState<Tag | 'All'>('All'); const [sel, setSel] = useState<string | null>(null)
  const list = ATTACKS.filter(a => (tag === 'All' || a.tags.includes(tag)) && (a.name + a.desc + a.mitre).toLowerCase().includes(q.toLowerCase()))
  const a = ATTACKS.find(x => x.id === sel) ?? list[0]
  return (
    <section>
      <Intro title="Attack Library">Searchable entries describing attacks and how to detect, prevent, and remediate them. Concepts only; no operational instructions. ATT&CK references are unverified; check attack.mitre.org.</Intro>
      <div className="mt-4 flex flex-wrap gap-2 items-center"><input aria-label="Search attacks" value={q} onChange={e => setQ(e.target.value)} placeholder="Search attacks…" className="bg-bg2 border border-deep rounded px-3 py-1.5 text-sm w-64" />
        {(['All', ...TAGS] as const).map(t => <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)} className={`text-xs px-2 py-1 rounded border ${tag === t ? 'border-accent text-accent bg-deep' : 'border-deep text-mute'}`}>{t}</button>)}</div>
      <div className="mt-4 grid lg:grid-cols-[300px_1fr] gap-4">
        <ul className="space-y-2">{list.map(x => <li key={x.id}><button onClick={() => setSel(x.id)} aria-pressed={x.id === a?.id} className={`w-full text-left glass p-2 text-sm ${x.id === a?.id ? 'border-accent' : ''}`}>{x.name}<span className="block text-[11px] text-mute">{x.level} · {x.tags.join(', ')}</span></button></li>)}{!list.length && <li className="text-sm text-mute">No entries match.</li>}</ul>
        {a ? <article className="glass p-4 min-w-0"><h2 className="text-xl font-semibold">{a.name}</h2><p className="text-xs text-mute">{a.level} · {a.tags.join(', ')} · ATT&CK: {a.mitre}</p><p className="mt-2 text-sm">{a.desc}</p>
          {([['Attacker objective', a.objective], ['Affected environment', a.env], ['Required conditions', a.conditions], ['Example telemetry', a.telemetry], ['Detection approach', a.detect], ['Remediation', a.fix]] as const).map(([k, v]) => <div key={k}><H>{k}</H><p className="text-sm text-mute">{v}</p></div>)}
          <H>Typical sequence</H><ol className="list-decimal pl-5 text-sm text-mute">{a.sequence.map(s => <li key={s}>{s}</li>)}</ol>
          <H>Defensive controls</H><ul className="list-disc pl-5 text-sm text-mute">{a.controls.map(s => <li key={s}>{s}</li>)}</ul>
          <H>Related modules</H><div className="flex flex-wrap gap-2">{a.related.map(([l, p]) => <Link key={p} to={p} className="text-xs border border-deep rounded px-2 py-0.5 hover:border-accent">{l}</Link>)}</div></article> : null}
      </div>
    </section>)
}

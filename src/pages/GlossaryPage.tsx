import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GLOSSARY, PATHS } from '../data/glossary'
import { useStored } from '../hooks/useStored'
import { Intro, Tabs } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
type Tab = 'glossary' | 'paths'
const INIT: Record<string, boolean> = {}
export default function GlossaryPage() {
  const { act } = useCharacter(); const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>('glossary'); const [q, setQ] = useState(params.get('q') ?? '')
  const [done, setDone, reset] = useStored<Record<string, boolean>>('cybersec.progress', INIT)
  const terms = GLOSSARY.filter(t => (t.term + t.def).toLowerCase().includes(q.toLowerCase()))
  const tick = (k: string) => { setDone(d => ({ ...d, [k]: !d[k] })); act('success', 'Progress saved in this browser.', 1800) }
  return (
    <section>
      <Intro title="Glossary & Learning Paths">Search key terms, or follow a learning path. Progress is saved locally in your browser only.</Intro>
      <div className="mt-4"><Tabs<Tab> tabs={[['glossary', 'Glossary'], ['paths', 'Learning paths']]} value={tab} onChange={setTab} /></div>
      {tab === 'glossary' ? <div className="mt-4"><input aria-label="Search glossary" value={q} onChange={e => setQ(e.target.value)} placeholder="Search terms…" className="bg-bg2 border border-deep rounded px-3 py-1.5 text-sm w-64" />
        <dl className="mt-3 grid md:grid-cols-2 gap-3">{terms.map(t => <div key={t.term} className="glass p-3"><dt className="font-semibold text-accent text-sm">{t.term}</dt><dd className="text-sm text-mute mt-1">{t.def}</dd></div>)}</dl>{!terms.length && <p className="mt-3 text-sm text-mute">No terms match.</p>}</div> : (
        <div className="mt-4 space-y-4">{PATHS.map(p => { const n = p.modules.filter((_, i) => done[`${p.id}:${i}`]).length
          return <article key={p.id} className="glass p-4"><div className="flex items-baseline justify-between gap-2"><h2 className="font-semibold">{p.name}</h2><span className="text-xs text-mute">{n}/{p.modules.length} done</span></div>
            <div className="mt-1 h-1.5 bg-bg2 rounded" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={p.modules.length} aria-label={`${p.name} progress`}><div className="h-full bg-accent rounded" style={{ width: `${(n / p.modules.length) * 100}%` }} /></div>
            <p className="mt-1 text-xs text-mute">Prerequisites: {p.prereq}</p>
            <ol className="mt-2 space-y-2">{p.modules.map((m, i) => <li key={m.title + i}><label className="flex gap-2 text-sm"><input type="checkbox" checked={!!done[`${p.id}:${i}`]} onChange={() => tick(`${p.id}:${i}`)} className="mt-1 accent-[#39FF88]" /><span><Link to={m.path} className="text-accent underline">{i + 1}. {m.title}</Link><span className="block text-xs text-mute">Exercise: {m.exercise}</span></span></label></li>)}</ol></article> })}
          <button onClick={() => { reset(); act('alert', 'Progress reset.', 2000) }} className="text-xs border border-deep rounded px-3 py-1 text-mute hover:text-ink">Reset progress</button></div>)}
    </section>)
}

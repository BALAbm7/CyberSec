import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SCENARIOS, TACTICS, CONTROLS } from '../data/attackScenarios'
const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <details className="border-t border-deep py-2" open={t === 'Objective and environment'}><summary className="cursor-pointer text-sm font-semibold text-accent">{t}</summary><div className="mt-2 text-sm text-mute">{children}</div></details>)
const Ul = ({ items }: { items: string[] }) => <ul className="list-disc pl-5 space-y-0.5">{items.map(i => <li key={i}>{i}</li>)}</ul>
export default function RedTeamPage() {
  const [tab, setTab] = useState<'scenarios' | 'tactics'>('scenarios')
  const [sid, setSid] = useState(SCENARIOS[0].id)
  const s = SCENARIOS.find(x => x.id === sid) ?? SCENARIOS[0]
  const ctl = (id: string) => CONTROLS.find(c => c.id === id)?.name ?? id
  const prevent = [...new Set(s.stages.flatMap(g => g.preventedBy))]
  const tabBtn = (k: typeof tab, l: string) => <button role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`text-sm px-3 py-1 rounded border ${tab === k ? 'border-accent text-accent bg-deep' : 'border-deep text-mute'}`}>{l}</button>
  return (
    <section>
      <h1 className="text-3xl font-bold">Red Team</h1>
      <p className="text-mute mt-1 text-sm max-w-3xl">Adversary behavior explained for defenders, organized by ATT&CK tactic. All scenarios use fictional systems and synthetic logs; nothing here is an attack tool.</p>
      <p className="mt-2 text-xs text-warn border border-deep rounded p-2 max-w-3xl">Mapping note: technique IDs are ATT&CK Enterprise IDs written from my knowledge and not yet checked against a pinned ATT&CK version. Scenario groupings are illustrative. Verify at attack.mitre.org before publishing.</p>
      <div className="mt-4 flex gap-2" role="tablist">{tabBtn('scenarios', 'Scenarios (4)')}{tabBtn('tactics', 'Tactics A-K (11)')}</div>
      {tab === 'scenarios' ? (
        <div className="mt-4 grid lg:grid-cols-[260px_1fr] gap-4">
          <ul className="space-y-2">{SCENARIOS.map(x => <li key={x.id}><button onClick={() => setSid(x.id)} className={`w-full text-left glass p-3 text-sm ${x.id === sid ? 'border-accent' : ''}`}>{x.name}<span className="block text-xs text-mute">{x.difficulty} · {x.stages.length} stages</span></button></li>)}</ul>
          <article className="glass p-4">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="text-xs text-mute mt-1">Difficulty: {s.difficulty} · Prerequisites: {s.prereq}</p>
            <Link to={`/cyber-range?scenario=${s.id}`} className="inline-block mt-3 px-3 py-1.5 rounded bg-accent text-bg text-sm font-semibold">Run in the Cyber Range</Link>
            <div className="mt-3">
              <Sec t="Objective and environment"><p>{s.objective}</p><p className="mt-1">Environment: {s.environment}</p></Sec>
              <Sec t="Preconditions"><Ul items={s.preconditions} /></Sec>
              <Sec t="Attack progression and ATT&CK mapping"><ol className="space-y-2">{s.stages.map((g, i) => <li key={g.id}>{i + 1}. <b className="text-ink">{g.title}</b> ({g.tactic}, <span className="font-mono">{g.tid}</span> {g.tname}): {g.desc}</li>)}</ol></Sec>
              <Sec t="Observable telemetry (synthetic)">{s.stages.map(g => <pre key={g.id} className="text-[11px] font-mono bg-bg2 border border-deep rounded p-2 mb-1 whitespace-pre-wrap break-words">{g.log}</pre>)}</Sec>
              <Sec t="Detection opportunities"><Ul items={s.stages.map(g => g.detection)} /></Sec>
              <Sec t="Preventive controls"><Ul items={prevent.map(ctl)} /></Sec>
              <Sec t="Investigation steps"><Ul items={s.investigation} /></Sec>
              <Sec t="Containment and remediation"><Ul items={s.containment} /></Sec>
              <Sec t="Lessons learned"><Ul items={s.lessons} /></Sec>
            </div>
          </article>
        </div>) : (
        <div className="mt-4 grid md:grid-cols-2 gap-3">{TACTICS.map(t => (
          <details key={t.key} className="glass p-3"><summary className="cursor-pointer font-semibold">{t.key}. {t.name} <span className="font-mono text-xs text-mute">{t.tid}</span></summary>
            <p className="mt-2 text-sm text-mute">{t.summary}</p>
            <h4 className="mt-2 text-xs font-mono uppercase text-accent">Techniques</h4><ul className="text-sm text-mute">{t.techniques.map(([id, nm]) => <li key={id + nm}><span className="font-mono text-xs">{id}</span> {nm}</li>)}</ul>
            <h4 className="mt-2 text-xs font-mono uppercase text-accent">Telemetry</h4><Ul items={t.telemetry} />
            <h4 className="mt-2 text-xs font-mono uppercase text-accent">Defend</h4><Ul items={t.defend} /></details>))}</div>)}
      <p className="mt-4 text-xs text-mute">Coverage: tactics A-K have concept cards; four have full interactive scenarios. More scenarios are planned.</p>
    </section>)
}

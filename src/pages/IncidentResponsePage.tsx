import { Link } from 'react-router-dom'
import { PHASES, INCIDENT, PREP, SEVERITY, CONTAIN, ERAD, RECOVER, RECS, ROOT_CAUSE, type Opt } from '../data/incident'
import { useStored } from '../hooks/useStored'
import { useCharacter } from '../components/character/CharacterContext'
interface S { phase: number; sev: string; contain: string; erad: string[]; recover: string[]; recs: string[] }
const INIT: S = { phase: 0, sev: '', contain: '', erad: [], recover: [], recs: [] }
function Multi({ opts, val, set, locked }: { opts: Opt[]; val: string[]; set: (v: string[]) => void; locked?: boolean }) {
  return <ul className="space-y-2">{opts.map(o => { const on = val.includes(o.id); return <li key={o.id}><label className="flex gap-2 text-sm"><input type="checkbox" checked={on} onChange={() => set(on ? val.filter(x => x !== o.id) : [...val, o.id])} className="mt-1 accent-[#39FF88]" />
    <span>{o.label}{on && <span className={`block text-xs ${o.ok ? 'text-accent' : 'text-warn'}`}>{o.ok ? '✓ ' : '! '}{o.note}</span>}</span></label></li> })}{locked}</ul>
}
const score = (opts: Opt[], val: string[]) => Math.max(0, val.filter(v => opts.find(o => o.id === v)?.ok).length - val.filter(v => !opts.find(o => o.id === v)?.ok).length)
export default function IncidentResponsePage() {
  const { act } = useCharacter()
  const [s, setS, reset] = useStored<S>('cybersec.ir', INIT)
  const up = (p: Partial<S>) => setS(x => ({ ...x, ...p }))
  const ct = CONTAIN.find(c => c.id === s.contain)
  const canNext = s.phase === 1 ? !!s.sev : s.phase === 2 ? !!s.contain : s.phase === 3 ? s.erad.length > 0 : s.phase === 4 ? s.recover.length > 0 : true
  const go = (n: number) => { up({ phase: n }); act(n === 2 ? 'alert' : n === 5 ? 'success' : 'explaining', n === 2 ? "Let's isolate the compromised endpoint." : n === 5 ? 'Time for lessons learned.' : `Phase: ${PHASES[n]}`, 2500) }
  const sevPts = SEVERITY.find(o => o.id === s.sev)?.id === 'Critical' ? 2 : s.sev === 'High' ? 1 : 0
  const total = 2 + 2 + 5 + 4
  const pts = sevPts + (s.contain === 'b' ? 2 : s.contain === 'c' ? 1 : 0) + Math.min(5, score(ERAD, s.erad)) + Math.min(4, score(RECOVER, s.recover))
  return (
    <section>
      <h1 className="text-3xl font-bold">Incident Response</h1>
      <p className="text-mute mt-1 text-sm max-w-3xl">Walk a fictional incident through the six-phase lifecycle (preparation through lessons learned) and see the consequences of your choices. All actions are simulated.</p>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Phases">{PHASES.map((p, i) => <button key={p} onClick={() => go(i)} aria-current={s.phase === i} className={`text-xs px-2 py-1 rounded border ${s.phase === i ? 'border-accent text-accent bg-deep' : 'border-deep text-mute hover:text-ink'}`}>{i + 1}. {p}</button>)}</nav>
      <div className="mt-4 grid lg:grid-cols-[1fr_300px] gap-4">
        <article className="glass p-4" aria-live="polite">
          <h2 className="text-xl font-semibold">{PHASES[s.phase]}</h2>
          {s.phase === 0 && <div><p className="mt-2 text-sm text-mute">Preparation happens before any incident. These are the conditions at Aegis Dynamics when this one began.</p>
            <ul className="mt-3 space-y-2 text-sm">{PREP.map(p => <li key={p.item}><span className={p.had ? 'text-accent' : 'text-warn'}>{p.had ? '✓' : '✗'}</span> {p.item}<span className="block text-xs text-mute">{p.note}</span></li>)}</ul></div>}
          {s.phase === 1 && <div><p className="mt-2 text-sm"><b>{INCIDENT.id}</b>: {INCIDENT.title}</p><p className="text-sm text-mute">Initial alert: {INCIDENT.alert}</p>
            <ol className="mt-3 text-sm space-y-0.5">{INCIDENT.timeline.map(([t, e]) => <li key={t}><span className="font-mono text-xs text-mute">{t}</span> {e}</li>)}</ol>
            <p className="mt-3 text-xs font-mono uppercase text-accent">Affected assets (scope so far)</p><ul className="list-disc pl-5 text-sm text-mute">{INCIDENT.assets.map(a => <li key={a}>{a}</li>)}</ul>
            <p className="mt-3 text-xs font-mono uppercase text-accent">Assess severity</p>
            <ul className="mt-1 space-y-2">{SEVERITY.map(o => <li key={o.id}><label className="flex gap-2 text-sm"><input type="radio" name="sev" checked={s.sev === o.id} onChange={() => up({ sev: o.id })} className="mt-1 accent-[#39FF88]" /><span>{o.label}{s.sev === o.id && <span className={`block text-xs ${o.ok ? 'text-accent' : 'text-warn'}`}>{o.note}</span>}</span></label></li>)}</ul></div>}
          {s.phase === 2 && <div><p className="mt-2 text-sm text-mute">Choose a containment strategy. Every option has a business cost and leaves some risk.</p>
            <ul className="mt-3 space-y-2">{CONTAIN.map(o => <li key={o.id}><label className="flex gap-2 text-sm"><input type="radio" name="contain" checked={s.contain === o.id} onChange={() => { up({ contain: o.id }); act(o.id === 'b' ? 'success' : 'alert', o.id === 'b' ? 'Good balance of stopping the attacker and limiting disruption.' : 'Think about what the attacker can still reach.', 3000) }} className="mt-1 accent-[#39FF88]" /><span>{o.label}{s.contain === o.id && <span className={`block text-xs ${o.ok ? 'text-accent' : 'text-warn'}`}>{o.note}</span>}</span></label></li>)}</ul></div>}
          {s.phase === 3 && <div><p className="mt-2 text-sm text-mute">Select the eradication steps you would take. Selecting a step shows feedback.</p><div className="mt-3"><Multi opts={ERAD} val={s.erad} set={v => up({ erad: v })} /></div></div>}
          {s.phase === 4 && <div><p className="mt-2 text-sm text-mute">Select the recovery and validation steps you would take.</p><div className="mt-3"><Multi opts={RECOVER} val={s.recover} set={v => up({ recover: v })} /></div></div>}
          {s.phase === 5 && <div><p className="mt-2 text-sm"><b>Root cause:</b> {ROOT_CAUSE}</p>
            <p className="mt-3 text-xs font-mono uppercase text-accent">Choose post-incident recommendations</p>
            <ul className="mt-1 space-y-1">{RECS.map(r => <li key={r.id}><label className="text-sm"><input type="checkbox" checked={s.recs.includes(r.id)} onChange={() => up({ recs: s.recs.includes(r.id) ? s.recs.filter(x => x !== r.id) : [...s.recs, r.id] })} className="mr-2 accent-[#39FF88]" />{r.label}</label></li>)}</ul>
            <p className="mt-4 text-sm border border-deep rounded p-3">Decision score: <b className="text-accent">{pts}/{total}</b>. Higher scores mean fewer wasted steps and less residual risk, but real incidents have no single right answer.</p>
            <Link to="/cyber-range?scenario=phish-to-dc" className="inline-block mt-3 text-sm text-accent underline">Replay this attack in the Cyber Range with your recommended controls</Link></div>}
          <div className="mt-5 flex gap-2">
            <button onClick={() => go(Math.max(0, s.phase - 1))} disabled={s.phase === 0} className="px-3 py-1.5 rounded border border-deep text-sm disabled:opacity-40">Back</button>
            <button onClick={() => go(Math.min(5, s.phase + 1))} disabled={s.phase === 5 || !canNext} className="px-3 py-1.5 rounded bg-accent text-bg text-sm font-semibold disabled:opacity-40">Next phase</button>
            <button onClick={() => reset()} className="ml-auto px-3 py-1.5 rounded border border-deep text-xs text-mute">Restart</button></div>
          {!canNext && s.phase < 5 && <p className="mt-2 text-xs text-mute">Make a choice to continue.</p>}
        </article>
        <aside className="glass p-4 self-start">
          <h2 className="text-xs font-mono uppercase text-accent">Incident status (simulated)</h2>
          <p className="mt-2 text-sm">Severity: {s.sev || 'not assessed'}</p>
          {ct ? <div className="mt-2 text-sm"><p className="text-xs text-mute">Containment impact on the business: {['none', 'low', 'high', 'severe'][ct.impact]}</p><p className="text-xs text-mute">Residual attacker risk: {['none', 'low', 'medium', 'high'][ct.risk]}</p>
            <p className="mt-2 text-xs font-mono uppercase text-accent">Isolated or disabled</p>{ct.assets.length ? <ul className="list-disc pl-4 text-xs text-mute">{ct.assets.map(a => <li key={a}>{a}</li>)}</ul> : <p className="text-xs text-mute">Nothing contained yet.</p>}</div> : <p className="mt-2 text-xs text-mute">No containment chosen yet.</p>}
        </aside>
      </div>
    </section>)
}

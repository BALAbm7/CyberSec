import { useState } from 'react'
import { CASES, PLANNED_CASES, type Case, type Sev } from '../data/alerts'
import { ASSETS, LINKS } from '../data/architecture'
import { useStored } from '../hooks/useStored'
import { useCharacter } from '../components/character/CharacterContext'
interface CS { notes: string; reviewed: string[]; verdict: '' | 'true' | 'false'; action: string; done: boolean }
const EMPTY: CS = { notes: '', reviewed: [], verdict: '', action: '', done: false }
const INIT: Record<string, CS> = {}
const SEV: Record<Sev, string> = { Critical: 'text-crit border-crit', High: 'text-warn border-warn', Medium: 'text-info border-info', Low: 'text-mute border-mute' }
const name = (id: string) => ASSETS.find(a => a.id === id)?.label ?? id
export default function BlueTeamPage() {
  const { act } = useCharacter()
  const [store, setStore, reset] = useStored<Record<string, CS>>('cybersec.blue', INIT)
  const [sel, setSel] = useState(CASES[0].id)
  const [open, setOpen] = useState<string | null>(null)
  const c = CASES.find(x => x.id === sel) as Case
  const st = store[sel] ?? EMPTY
  const patch = (p: Partial<CS>) => setStore(s => ({ ...s, [sel]: { ...(s[sel] ?? EMPTY), ...p } }))
  const chosen = c.actions.find(a => a.id === st.action)
  const good = st.done && st.verdict === c.truth && !!chosen?.ok
  const keyIds = c.evidence.filter(e => e.key).map(e => e.id)
  const keySeen = keyIds.filter(id => st.reviewed.includes(id)).length
  const isolated = [...new Set(CASES.filter(x => { const s = store[x.id]; return s?.done && x.actions.find(a => a.id === s.action)?.isolates }).map(x => x.asset))]
  const pick = (id: string) => { setSel(id); setOpen(null); act('investigating', "Let's investigate this alert.", 2500) }
  const view = (id: string) => { setOpen(o => (o === id ? null : id)); if (!st.reviewed.includes(id)) patch({ reviewed: [...st.reviewed, id] }); act('explaining', 'Check whether this evidence supports the alert.', 2500) }
  const complete = () => {
    patch({ done: true })
    const ok = st.verdict === c.truth && !!chosen?.ok
    act(ok ? 'success' : 'error', ok ? 'Well handled. Case resolved.' : 'Not quite. Read the feedback and try again.', 3500)
  }
  const status = (id: string) => { const s = store[id]; if (!s) return 'New'; if (s.done) { const k = CASES.find(x => x.id === id) as Case; return s.verdict === k.truth && k.actions.find(a => a.id === s.action)?.ok ? 'Resolved ✓' : 'Review ✗' } return s.notes || s.reviewed.length ? 'In progress' : 'New' }
  return (
    <section>
      <h1 className="text-3xl font-bold">Blue Team: SOC Console</h1>
      <p className="text-mute mt-1 text-sm max-w-3xl">Triage simulated alerts, inspect evidence, record notes, pick a verdict and a containment action, then complete the case. All events are synthetic and no real system changes.</p>
      <div className="mt-4 grid lg:grid-cols-[280px_1fr_280px] gap-4">
        <div>
          <h2 className="text-xs font-mono uppercase text-accent mb-2">Alert queue</h2>
          <ul className="space-y-2">{CASES.map(x => <li key={x.id}><button onClick={() => pick(x.id)} aria-pressed={x.id === sel} className={`w-full text-left glass p-2 text-sm ${x.id === sel ? 'border-accent' : ''}`}>
            <span className={`text-[10px] font-mono border rounded px-1 ${SEV[x.sev]}`}>{x.sev}</span> <span className="text-[10px] text-mute">{x.time} · {status(x.id)}</span><span className="block mt-1">{x.title}</span></button></li>)}</ul>
          <details className="mt-3 text-xs text-mute"><summary className="cursor-pointer">Planned cases (4)</summary><ul className="list-disc pl-4 mt-1">{PLANNED_CASES.map(p => <li key={p}>{p}</li>)}</ul></details>
          <button onClick={() => { reset(); setOpen(null); act('alert', 'Progress cleared.', 2000) }} className="mt-3 text-xs border border-deep rounded px-2 py-1 text-mute hover:text-ink">Reset all cases</button>
        </div>
        <article className="glass p-4 min-w-0">
          <h2 className="text-xl font-semibold">{c.title}</h2>
          <p className="mt-1 text-sm text-mute">{c.summary}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {([['Severity', c.sev], ['Time', c.time], ['Asset', name(c.asset)], ['User', c.user], ['Source', c.src], ['Destination', c.dst]] as const).map(([k, v]) => <div key={k}><dt className="inline text-mute">{k}: </dt><dd className="inline">{v}</dd></div>)}
          </dl>
          <p className="mt-2 text-xs text-mute">ATT&CK (illustrative, verify at attack.mitre.org): {c.mitre.map(([i, n]) => `${i} ${n}`).join(' · ')}</p>
          <h3 className="mt-4 text-xs font-mono uppercase text-accent">Event timeline</h3>
          <ol className="mt-1 text-sm space-y-0.5">{c.timeline.map(([t, e]) => <li key={t + e}><span className="font-mono text-xs text-mute">{t}</span> {e}</li>)}</ol>
          <h3 className="mt-4 text-xs font-mono uppercase text-accent">Evidence ({st.reviewed.length}/{c.evidence.length} reviewed)</h3>
          <ul className="mt-1 space-y-1">{c.evidence.map(e => <li key={e.id}>
            <button onClick={() => view(e.id)} aria-expanded={open === e.id} className="text-sm text-left hover:text-accent">{open === e.id ? '▾' : '▸'} {e.label}{st.done && <span className="text-xs text-mute"> ({e.key ? 'relevant' : 'not relevant'})</span>}</button>
            {open === e.id && <pre className="mt-1 text-[11px] font-mono bg-bg2 border border-deep rounded p-2 whitespace-pre-wrap break-words">{e.body}</pre>}</li>)}</ul>
          <h3 className="mt-4 text-xs font-mono uppercase text-accent">Recommended next steps</h3>
          <ul className="list-disc pl-5 text-sm text-mute">{c.steps.map(s => <li key={s}>{s}</li>)}</ul>
          <label className="block mt-4 text-xs font-mono uppercase text-accent" htmlFor="notes">Investigation notes</label>
          <textarea id="notes" value={st.notes} disabled={st.done} onChange={e => patch({ notes: e.target.value })} rows={3} placeholder="What did you find?" className="mt-1 w-full bg-bg2 border border-deep rounded p-2 text-sm" />
          <fieldset className="mt-3" disabled={st.done}><legend className="text-xs font-mono uppercase text-accent">Verdict</legend>
            {(['true', 'false'] as const).map(v => <label key={v} className="mr-4 text-sm"><input type="radio" name="verdict" checked={st.verdict === v} onChange={() => patch({ verdict: v })} className="accent-[#39FF88]" /> {v === 'true' ? 'True positive' : 'False positive'}</label>)}</fieldset>
          <fieldset className="mt-3 space-y-1" disabled={st.done}><legend className="text-xs font-mono uppercase text-accent">Resolution action (simulated)</legend>
            {c.actions.map(a => <label key={a.id} className="flex gap-2 text-sm"><input type="radio" name="action" checked={st.action === a.id} onChange={() => patch({ action: a.id })} className="mt-1 accent-[#39FF88]" />{a.label}</label>)}</fieldset>
          {!st.done ? <button onClick={complete} disabled={!st.verdict || !st.action || !st.reviewed.length} className="mt-4 px-3 py-1.5 rounded bg-accent text-bg text-sm font-semibold disabled:opacity-40">Complete case</button> : (
            <div className="mt-4 border border-deep rounded p-3 text-sm" aria-live="polite">
              <p className={good ? 'text-accent font-semibold' : 'text-crit font-semibold'}>{good ? 'Resolved correctly' : 'Needs review'}</p>
              <ul className="mt-1 list-disc pl-5 text-mute"><li>Verdict: {st.verdict === c.truth ? 'correct' : `incorrect (this was a ${c.truth === 'true' ? 'true' : 'false'} positive)`}</li><li>Action: {chosen?.result}</li><li>Key evidence reviewed: {keySeen}/{keyIds.length}</li><li>Lesson: {c.lesson}</li></ul>
              <button onClick={() => patch({ done: false })} className="mt-2 text-xs border border-deep rounded px-2 py-1">Reopen case</button></div>)}
        </article>
        <aside className="glass p-4 self-start">
          <h2 className="text-xs font-mono uppercase text-accent">Simulated asset status</h2>
          {!isolated.length ? <p className="mt-2 text-sm text-mute">All assets online. Containment actions that isolate a host will appear here.</p> : isolated.map(id => (
            <div key={id} className="mt-2 text-sm"><p><b>{name(id)}</b> <span className="text-crit text-xs">ISOLATED (simulated)</span></p>
              <p className="text-xs text-mute mt-1">Blocked paths:</p>
              <ul className="text-xs text-mute list-disc pl-4">{LINKS.filter(l => l.kind !== 'telemetry' && (l.source === id || l.target === id)).map(l => <li key={l.id}>{name(l.source)} → {name(l.target)}</li>)}</ul>
              <p className="text-xs text-mute mt-1">Security tooling can still reach the host for investigation.</p></div>))}
          <p className="mt-4 text-[11px] text-mute">This panel is a model. No real endpoint or security tool is touched.</p>
        </aside>
      </div>
    </section>)
}

import { useState } from 'react'
import { CONTROL_CATALOG, GROUPS, type Group } from '../data/securityControls'
import { SCENARIOS, type ControlId } from '../data/attackScenarios'
import { runScenario, summarize } from '../features/attack-simulations/engine'
import { H, Intro } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
export default function SecurityControlsPage() {
  const { act } = useCharacter()
  const [g, setG] = useState<Group | 'All'>('All'); const [on, setOn] = useState<Set<ControlId>>(new Set())
  const list = CONTROL_CATALOG.filter(c => g === 'All' || c.group === g)
  const toggle = (id: ControlId) => setOn(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); act('explaining', 'Compare the before and after columns.', 2000); return n })
  return (
    <section>
      <Intro title="Security Controls & Hardening">A catalog of controls grouped by area. Tick "simulate" on any control that the Cyber Range can model, and the comparison table shows how each attack scenario changes.</Intro>
      <div className="mt-4 flex flex-wrap gap-1.5">{(['All', ...GROUPS] as const).map(x => <button key={x} aria-pressed={g === x} onClick={() => setG(x)} className={`text-xs px-2 py-1 rounded border ${g === x ? 'border-accent text-accent bg-deep' : 'border-deep text-mute'}`}>{x}</button>)}</div>
      <div className="mt-4 grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="grid md:grid-cols-2 gap-3 content-start">{list.map(c => <details key={c.id} className="glass p-3"><summary className="cursor-pointer text-sm font-semibold">{c.name} <span className="text-[10px] text-mute font-normal">({c.group})</span></summary>
          <dl className="mt-2 text-xs space-y-1 text-mute">{([['Objective', c.objective], ['Threats addressed', c.threats], ['Implementation', c.how], ['Telemetry', c.telemetry], ['Validation', c.validate], ['Operational notes', c.ops]] as const).map(([k, v]) => <div key={k}><dt className="inline text-ink">{k}: </dt><dd className="inline">{v}</dd></div>)}</dl>
          {c.engine ? <label className="mt-2 flex gap-2 text-xs text-accent"><input type="checkbox" checked={on.has(c.engine)} onChange={() => toggle(c.engine as ControlId)} className="accent-[#39FF88]" />Simulate this control</label> : <p className="mt-2 text-[11px] text-mute">Not modelled in the simulation yet.</p>}</details>)}</div>
        <aside className="glass p-4 self-start"><h2 className="text-sm font-semibold">Before and after</h2>
          <table className="mt-2 w-full text-xs"><thead className="text-left text-mute"><tr><th>Scenario</th><th>Before</th><th>After</th></tr></thead><tbody>{SCENARIOS.map(s => { const b = summarize(runScenario(s, new Set())), a = summarize(runScenario(s, on)); return <tr key={s.id} className="border-t border-deep"><td className="py-1 pr-2">{s.name}</td><td className="text-crit">{b.reached}/{b.total}</td><td className={a.reached < b.reached ? 'text-accent' : 'text-crit'}>{a.reached}/{a.total}</td></tr> })}</tbody></table>
          <p className="mt-2 text-[11px] text-mute">Stages the attacker reaches. A control reduces particular risks; it does not guarantee complete protection.</p><H>Selected</H><p className="text-xs text-mute">{on.size ? [...on].join(', ') : 'None'}</p></aside>
      </div>
    </section>)
}

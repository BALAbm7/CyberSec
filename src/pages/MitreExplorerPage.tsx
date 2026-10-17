import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TACTICS, SCENARIOS, CONTROLS } from '../data/attackScenarios'
import { TECH } from '../data/mitreDetail'
import { ASSETS } from '../data/architecture'
import { H, Intro } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
export default function MitreExplorerPage() {
  const { act } = useCharacter()
  const [ti, setTi] = useState(0); const [tech, setTech] = useState<string>(TACTICS[0].techniques[0][0])
  const tac = TACTICS[ti]; const tName = tac.techniques.find(t => t[0] === tech)?.[1] ?? ''
  const d = TECH[tech]
  const rel = SCENARIOS.filter(s => s.stages.some(g => g.tid === tech))
  return (
    <section>
      <Intro title="MITRE ATT&CK Explorer">An ATT&CK-inspired view of tactics and techniques, linked to the fictional Aegis Dynamics environment.</Intro>
      <p className="mt-2 text-xs text-warn border border-deep rounded p-2 max-w-3xl">Framework version: not pinned. Technique IDs were written from memory and have not been validated against the official site. Verify at attack.mitre.org. MITRE ATT&CK® is a registered trademark of The MITRE Corporation; this is an educational summary, not a reproduction of the knowledge base.</p>
      <div className="mt-4 grid lg:grid-cols-[220px_260px_1fr] gap-4">
        <ul className="space-y-1" aria-label="Tactics">{TACTICS.map((t, i) => <li key={t.key}><button onClick={() => { setTi(i); setTech(t.techniques[0][0]) }} aria-pressed={i === ti} className={`w-full text-left glass p-2 text-sm ${i === ti ? 'border-accent' : ''}`}>{t.name}<span className="block font-mono text-[10px] text-mute">{t.tid}</span></button></li>)}</ul>
        <ul className="space-y-1" aria-label="Techniques">{tac.techniques.map(([id, n]) => <li key={id + n}><button onClick={() => { setTech(id); act('explaining', `${id}: ${n}`, 2000) }} aria-pressed={id === tech} className={`w-full text-left glass p-2 text-sm ${id === tech ? 'border-accent' : ''}`}><span className="font-mono text-xs text-accent">{id}</span> {n}</button></li>)}</ul>
        <article className="glass p-4 min-w-0"><h2 className="font-semibold"><span className="font-mono text-accent">{tech}</span> {tName}</h2><p className="text-xs text-mute">Tactic: {tac.name} ({tac.tid})</p>
          {d ? <div>
            <p className="mt-2 text-sm">{d.desc}</p>
            <H>Affected environments</H><p className="text-sm text-mute">{d.envs.join(', ')}</p>
            <H>Potential telemetry</H><ul className="list-disc pl-5 text-sm text-mute">{d.telemetry.map(t => <li key={t}>{t}</li>)}</ul>
            <H>Detection opportunity</H><p className="text-sm text-mute">{d.detect}</p>
            <H>Preventive controls</H><ul className="list-disc pl-5 text-sm text-mute">{d.controls.map(c => <li key={c}>{CONTROLS.find(x => x.id === c)?.name}</li>)}</ul>
            <H>Relevant Aegis assets</H><div className="flex flex-wrap gap-1.5">{d.assets.map(a => <Link key={a} to="/architecture" className="text-xs border border-deep rounded px-2 py-0.5 hover:border-accent">{ASSETS.find(x => x.id === a)?.label}</Link>)}</div>
          </div> : <div><p className="mt-2 text-sm text-mute">A detailed view for this technique is planned. Tactic-level guidance:</p><H>Telemetry</H><ul className="list-disc pl-5 text-sm text-mute">{tac.telemetry.map(t => <li key={t}>{t}</li>)}</ul><H>Defend</H><ul className="list-disc pl-5 text-sm text-mute">{tac.defend.map(t => <li key={t}>{t}</li>)}</ul></div>}
          <H>Related scenarios</H>{rel.length ? <ul className="text-sm">{rel.map(s => <li key={s.id}><Link className="text-accent underline" to={`/cyber-range?scenario=${s.id}`}>{s.name}</Link></li>)}</ul> : <p className="text-sm text-mute">None yet.</p>}
        </article>
      </div>
    </section>)
}

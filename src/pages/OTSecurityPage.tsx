import { useState } from 'react'
import { OT_CONCEPTS, PURDUE, OT_NOTE } from '../data/otLab'
import { Concepts, H, Intro } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
export default function OTSecurityPage() {
  const { act } = useCharacter()
  const [lvl, setLvl] = useState(2)
  const [seg, setSeg] = useState(false); const [mon, setMon] = useState(false)
  const out = seg ? { t: 'Blocked at the OT DMZ boundary and logged. The controller never sees the request.', c: 'text-accent' } : mon ? { t: 'The request is not stopped here, but passive monitoring flags a new source sending a write command, so operations can respond.', c: 'text-warn' } : { t: 'No boundary rule and no monitoring: nothing blocks it and nobody is alerted.', c: 'text-crit' }
  const set = (f: () => void) => { f(); act('explaining', 'Boundaries and visibility both matter in OT.', 2500) }
  return (
    <section>
      <Intro title="OT / ICS Security Lab">How industrial environments differ from IT, the Purdue Model, and why segmentation and passive monitoring matter. Simulation only.</Intro>
      <p className="mt-2 text-xs text-warn border border-deep rounded p-2 max-w-3xl">{OT_NOTE}</p>
      <H>Concepts</H><Concepts items={OT_CONCEPTS} />
      <H>Purdue Model (fictional plant)</H>
      <div className="grid md:grid-cols-[1fr_300px] gap-4">
        <ul className="space-y-1.5">{PURDUE.map((p, i) => <li key={p.lvl}><button onClick={() => setLvl(i)} aria-pressed={i === lvl} className={`w-full text-left glass p-2 text-sm ${i === lvl ? 'border-accent' : ''} ${p.lvl === 'Level 3.5' ? 'border-warn' : ''}`}><b>{p.lvl}</b> {p.name}</button></li>)}</ul>
        <div className="glass p-4 self-start"><h3 className="font-semibold">{PURDUE[lvl].lvl}: {PURDUE[lvl].name}</h3><p className="mt-1 text-sm text-mute">Assets: {PURDUE[lvl].assets}</p><p className="mt-1 text-sm">{PURDUE[lvl].note}</p>
          <p className="mt-2 text-xs text-mute">Direct, unrestricted IT-to-control connectivity is dangerous: an IT compromise could reach safety-relevant devices. Traffic should pass through the OT DMZ.</p></div>
      </div>
      <H>Simulation: unknown host contacts a controller</H>
      <div className="glass p-4"><p className="text-sm">An unknown device (10.30.9.9) sends a write command to PLC-01 (simulated, no real protocol traffic).</p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <label><input type="checkbox" checked={seg} onChange={() => set(() => setSeg(v => !v))} className="mr-2 accent-[#39FF88]" />Segmentation and allowlist</label>
          <label><input type="checkbox" checked={mon} onChange={() => set(() => setMon(v => !v))} className="mr-2 accent-[#39FF88]" />Passive OT monitoring</label></div>
        <p className={`mt-3 text-sm ${out.c}`} aria-live="polite">{out.t}</p></div>
    </section>)
}

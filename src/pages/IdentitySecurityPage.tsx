import { useState } from 'react'
import { AD_CONCEPTS, CTLS, RISK_STEPS, DETECTIONS, type Ctl } from '../data/identityLab'
import { Concepts, H, Intro } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
export default function IdentitySecurityPage() {
  const { act } = useCharacter()
  const [on, setOn] = useState<Set<Ctl>>(new Set())
  const toggle = (c: Ctl) => setOn(p => { const n = new Set(p); const had = n.has(c); if (had) n.delete(c); else n.add(c)
    const blocked = RISK_STEPS.some(s => s.blockedBy && n.has(s.blockedBy)); act(blocked ? 'success' : 'alert', blocked ? 'That control breaks the path to the domain controller.' : 'With no controls, one foothold reaches the domain controller.', 3000); return n })
  let stopped = false
  const rows = RISK_STEPS.map(s => { const blocked = !stopped && !!s.blockedBy && on.has(s.blockedBy); const status = stopped ? 'unreached' : blocked ? 'blocked' : 'reached'; if (blocked) stopped = true; return { ...s, status } })
  return (
    <section>
      <Intro title="Identity & Active Directory">How centralized authentication works, and how a workstation compromise can grow into domain compromise when privileges and service accounts are weak. Not every enterprise uses this exact design.</Intro>
      <H>Core concepts</H><Concepts items={AD_CONCEPTS} />
      <H>Interactive: path to domain compromise (simulated)</H>
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <ol className="glass p-4 space-y-3" aria-live="polite">{rows.map((r, i) => <li key={r.title} className="flex gap-3 text-sm">
          <span className={`mt-0.5 text-xs font-mono ${r.status === 'reached' ? 'text-crit' : r.status === 'blocked' ? 'text-accent' : 'text-mute'}`}>{r.status === 'reached' ? '● reached' : r.status === 'blocked' ? '■ blocked' : '○ not reached'}</span>
          <span><b>{i + 1}. {r.title}</b><span className="block text-xs text-mute">{r.text}</span></span></li>)}</ol>
        <div className="glass p-4 self-start"><h2 className="text-sm font-semibold">Apply controls</h2>
          <ul className="mt-2 space-y-2">{CTLS.map(c => <li key={c.id}><label className="flex gap-2 text-sm"><input type="checkbox" checked={on.has(c.id)} onChange={() => toggle(c.id)} className="mt-1 accent-[#39FF88]" /><span>{c.name}<span className="block text-xs text-mute">{c.what}</span></span></label></li>)}</ul>
          <p className="mt-3 text-xs text-mute">{rows.some(r => r.status === 'blocked') ? 'The chain is stopped. A control reduces particular risks; it does not guarantee protection.' : 'No control applied: all five steps are reached.'}</p></div>
      </div>
      <H>Detection opportunities</H>
      <div className="glass p-4 overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs text-mute"><tr><th className="pr-3">Event</th><th className="pr-3">What it shows</th><th>How to use it</th></tr></thead>
        <tbody>{DETECTIONS.map(d => <tr key={d.ev} className="border-t border-deep align-top"><td className="py-1 pr-3 font-mono text-xs">{d.ev}</td><td className="pr-3">{d.what}</td><td className="text-mute">{d.note}</td></tr>)}</tbody></table></div>
    </section>)
}

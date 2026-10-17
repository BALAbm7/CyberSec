import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { NET_CONCEPTS, RULES, FLOWS, type RuleId } from '../data/networkLab'
import { Concepts, H, Intro, Pre } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
export default function NetworkSecurityPage() {
  const { act } = useCharacter(); const reduce = useReducedMotion()
  const [on, setOn] = useState<Set<RuleId>>(new Set())
  const [sel, setSel] = useState(FLOWS[1].id)
  const blocked = (f: (typeof FLOWS)[number]) => !!f.always || (!!f.rule && on.has(f.rule))
  const f = FLOWS.find(x => x.id === sel) ?? FLOWS[0]
  const b = blocked(f)
  const toggle = (r: RuleId) => setOn(p => { const n = new Set(p); if (n.has(r)) n.delete(r); else n.add(r); act('explaining', 'Rules change which flows get through.', 2000); return n })
  return (
    <section>
      <Intro title="Network Security Lab">Core network concepts and a simulated packet-flow view. Toggle firewall rules and watch fictional connections get allowed or blocked. No real traffic is captured or scanned.</Intro>
      <H>Concepts</H><Concepts items={NET_CONCEPTS} />
      <H>Packet-flow simulation</H>
      <div className="grid lg:grid-cols-[260px_1fr_280px] gap-4">
        <ul className="space-y-2">{FLOWS.map(x => <li key={x.id}><button onClick={() => { setSel(x.id); act(x.sus ? 'alert' : 'idle', x.sus ? 'This connection deserves a closer look.' : 'Expected traffic.', 2000) }} aria-pressed={x.id === sel} className={`w-full text-left glass p-2 text-sm ${x.id === sel ? 'border-accent' : ''}`}>{x.name}<span className={`block text-xs ${blocked(x) ? 'text-accent' : x.sus ? 'text-crit' : 'text-mute'}`}>{blocked(x) ? 'Blocked' : 'Allowed'} · {x.proto}/{x.port}</span></button></li>)}</ul>
        <div className="glass p-4 min-w-0">
          <svg viewBox="0 0 400 70" className="w-full" role="img" aria-label={`${f.src} to ${f.dst}, ${b ? 'blocked at the firewall' : 'allowed'}`}>
            <line x1="40" y1="35" x2="360" y2="35" stroke="#123C2B" strokeWidth="2" />
            {[[40, 'Source'], [200, 'Firewall'], [360, 'Destination']].map(([x, l]) => <g key={String(l)}><circle cx={Number(x)} cy="35" r="12" fill="#102019" stroke={l === 'Firewall' ? '#FFB547' : '#39FF88'} strokeWidth="2" /><text x={Number(x)} y="64" textAnchor="middle" fontSize="9" fill="#9DB5A5">{String(l)}</text></g>)}
            <motion.circle key={f.id + b} r="5" cy="35" fill={b ? '#FF4D5A' : '#39FF88'} initial={{ cx: 40 }} animate={{ cx: reduce ? (b ? 200 : 360) : b ? [40, 200] : [40, 360] }} transition={reduce ? { duration: 0 } : { duration: 2, repeat: Infinity, repeatDelay: 0.5 }} />
            {b && <text x="200" y="14" textAnchor="middle" fontSize="10" fill="#FF4D5A">BLOCKED</text>}
          </svg>
          <h3 className="font-semibold">{f.name}</h3>
          <dl className="mt-2 grid grid-cols-2 gap-1 text-xs">{([['Source', f.src], ['Destination', f.dst], ['Protocol / port', `${f.proto}/${f.port}`], ['Zone', f.zone], ['Policy', f.policy], ['Risk', f.risk]] as const).map(([k, v]) => <div key={k}><dt className="text-mute inline">{k}: </dt><dd className="inline">{v}</dd></div>)}</dl>
          <p className="mt-2 text-sm text-mute"><b className="text-ink">Expected:</b> {f.expected}</p>
          <div className="mt-2"><Pre>{b ? `deny ${f.log}` : f.log}</Pre></div>
        </div>
        <div className="glass p-4 self-start"><h3 className="text-sm font-semibold">Firewall and filtering rules</h3>
          <ul className="mt-2 space-y-2">{RULES.map(r => <li key={r.id}><label className="flex gap-2 text-sm"><input type="checkbox" checked={on.has(r.id)} onChange={() => toggle(r.id)} className="mt-1 accent-[#39FF88]" /><span>{r.name}<span className="block text-xs text-mute">{r.what}</span></span></label></li>)}</ul>
          <p className="mt-3 text-xs text-mute">Rules reduce specific paths. Blocked attempts should still be logged and investigated.</p></div>
      </div>
    </section>)
}

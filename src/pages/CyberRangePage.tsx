import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ReactFlow, Background, Controls, MarkerType, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ASSETS, LINKS, ZONE_INFO } from '../data/architecture'
import { SCENARIOS, CONTROLS, type ControlId } from '../data/attackScenarios'
import { runScenario, summarize } from '../features/attack-simulations/engine'
import { ArchNodeView, ZoneView, type ArchNode } from '../features/architecture/ArchNodes'
import { byId, handles } from '../features/architecture/helpers'
import { useCharacter } from '../components/character/CharacterContext'
const nodeTypes = { arch: ArchNodeView, zone: ZoneView }
const RED = '#FF4D5A'
export default function CyberRangePage() {
  const { act } = useCharacter()
  const [params, setParams] = useSearchParams()
  const scenario = SCENARIOS.find(s => s.id === params.get('scenario')) ?? SCENARIOS[0]
  const [step, setStep] = useState(0)
  const [on, setOn] = useState<Set<ControlId>>(new Set())
  const results = useMemo(() => runScenario(scenario, on), [scenario, on])
  const base = useMemo(() => summarize(runScenario(scenario, new Set())), [scenario])
  const cur = summarize(results)
  const n = scenario.stages.length
  const shown = scenario.stages.slice(0, step)
  const idx = step - 1
  const stage = idx >= 0 ? scenario.stages[idx] : null
  const res = idx >= 0 ? results[idx] : null
  const nodes = useMemo<ArchNode[]>(() => {
    const touched = new Set<string>(), hit = new Set<string>()
    shown.forEach((st, i) => st.edges.forEach(id => { const [a, b] = id.split('>'); touched.add(a); touched.add(b); if (results[i].status === 'reached') { hit.add(a); hit.add(b) } }))
    return ASSETS.map(a => ({ id: a.id, type: 'arch' as const, position: { x: a.x, y: a.y }, draggable: false,
      data: { asset: a, color: hit.has(a.id) ? RED : ZONE_INFO[a.zone].color, selected: !!stage && stage.edges.some(e => e.split('>').includes(a.id)), weak: false, ctrlCount: null, dim: step > 0 && !touched.has(a.id) } }))
  }, [shown, results, stage, step])
  const edges = useMemo<Edge[]>(() => {
    const st = new Map<string, { i: number; status: string }>()
    shown.forEach((s, i) => s.edges.forEach(id => st.set(id, { i, status: results[i].status })))
    return LINKS.filter(l => l.kind !== 'telemetry').map(l => {
      const m = st.get(l.id); const [s, t] = handles(byId(l.source), byId(l.target))
      const color = !m ? '#9DB5A5' : m.status === 'reached' ? RED : '#FFB547'
      return { id: l.id, source: l.source, target: l.target, sourceHandle: `s-${s}`, targetHandle: `t-${t}`, animated: m?.status === 'reached',
        label: m ? `${m.i + 1}. ${m.status === 'reached' ? 'attack' : 'blocked'}` : undefined, labelStyle: { fill: '#E8F5EC', fontSize: 10 }, labelBgStyle: { fill: '#0B1712' },
        style: { stroke: color, strokeWidth: m ? 3 : 1.2, opacity: m || step === 0 ? 1 : 0.1, strokeDasharray: m?.status === 'prevented' ? '3 5' : undefined }, markerEnd: { type: MarkerType.ArrowClosed, color } }
    })
  }, [shown, results, step])
  const next = () => {
    if (step >= n) return
    const r = results[step], s = scenario.stages[step]
    act(r.status === 'reached' ? 'alert' : 'success', r.status === 'reached' ? s.say : `Stopped at "${s.title}". The attack chain ends here.`, 3500)
    setStep(step + 1)
  }
  const toggle = (c: ControlId) => setOn(p => { const q = new Set(p); if (q.has(c)) q.delete(c); else q.add(c); return q })
  const choose = (id: string) => { setParams({ scenario: id }); setStep(0); act('pointing', 'New scenario loaded. Press Next stage.') }
  const done = step >= n || (res?.status === 'prevented')
  return (
    <section>
      <h1 className="text-3xl font-bold">Cyber Range</h1>
      <p className="text-mute mt-1 text-sm max-w-3xl">Run a simulated attack against the fictional Aegis Dynamics network, then enable controls and replay it. Everything is deterministic, local, and synthetic. Nothing touches a real system.</p>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Scenarios">
        {SCENARIOS.map(s => <button key={s.id} role="tab" aria-selected={s.id === scenario.id} onClick={() => choose(s.id)}
          className={`text-xs px-2 py-1 rounded border ${s.id === scenario.id ? 'border-accent text-accent bg-deep' : 'border-deep text-mute hover:text-ink'}`}>{s.name}</button>)}
      </div>
      <p className="mt-2 text-xs text-mute">Objective: {scenario.objective} · Difficulty: {scenario.difficulty}</p>
      <div className="mt-3 grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="glass overflow-hidden h-[60vh] min-h-[400px]">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} colorMode="dark" fitView fitViewOptions={{ padding: 0.1 }} minZoom={0.2} nodesDraggable={false} nodesConnectable={false} proOptions={{ hideAttribution: true }}>
            <Background color="#123C2B" gap={32} /><Controls showInteractive={false} />
          </ReactFlow>
        </div>
        <aside className="space-y-4">
          <div className="glass p-4" aria-live="polite">
            <div className="flex gap-2 flex-wrap">
              <button onClick={next} disabled={done} className="px-3 py-1.5 rounded bg-accent text-bg text-sm font-semibold disabled:opacity-40">Next stage</button>
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-3 py-1.5 rounded border border-deep text-sm disabled:opacity-40">Back</button>
              <button onClick={() => setStep(0)} className="px-3 py-1.5 rounded border border-deep text-sm">Reset</button>
            </div>
            <p className="mt-2 text-xs text-mute">Stage {Math.min(step, n)} of {n}</p>
            {!stage || !res ? <p className="mt-3 text-sm text-mute">Press <b>Next stage</b> to begin. Try it once with no controls, then enable some and run it again.</p> : (
              <div className="mt-3">
                <h3 className="font-semibold">{stage.title}</h3>
                <p className="text-xs text-mute">{stage.tactic} · <span className="font-mono">{stage.tid}</span> {stage.tname}</p>
                <p className="mt-2 text-sm">{stage.desc}</p>
                <p className={`mt-2 text-sm font-semibold ${res.status === 'reached' ? 'text-crit' : 'text-warn'}`}>{res.status === 'reached' ? 'Attacker succeeded at this stage' : 'Blocked by a control'}</p>
                <pre className="mt-2 text-[11px] font-mono bg-bg2 border border-deep rounded p-2 whitespace-pre-wrap break-words">{res.status === 'reached' ? stage.log : stage.blockedLog}</pre>
                <p className={`mt-2 text-sm ${res.detected ? 'text-info' : 'text-mute'}`}>{res.detected ? `Alert: ${stage.detection}` : 'No alert: the telemetry or detection for this stage is not enabled.'}</p>
                {done && <p className="mt-3 text-sm border border-deep rounded p-2">{res.status === 'prevented' ? 'The chain was stopped here, so later stages never happen.' : 'The attacker completed every stage in this simulation.'}</p>}
              </div>)}
          </div>
          <div className="glass p-4">
            <h3 className="font-semibold text-sm">Controls (simulated)</h3>
            <ul className="mt-2 space-y-1.5">{CONTROLS.map(c => <li key={c.id}><label className="flex gap-2 text-sm cursor-pointer"><input type="checkbox" checked={on.has(c.id)} onChange={() => toggle(c.id)} className="mt-1 accent-[#39FF88]" /><span>{c.name}<span className="block text-xs text-mute">{c.what}</span></span></label></li>)}</ul>
            <div className="mt-3 text-xs border-t border-deep pt-2 space-y-1">
              <div>No controls: attacker reaches <b className="text-crit">{base.reached}/{base.total}</b> stages, <b>{base.detected}</b> detected</div>
              <div>Your selection: attacker reaches <b className="text-accent">{cur.reached}/{cur.total}</b> stages, <b>{cur.detected}</b> detected</div>
              <p className="text-mute">Controls reduce specific risks; they do not guarantee protection.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>)
}

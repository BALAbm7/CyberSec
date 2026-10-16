import { useMemo, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, MarkerType, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ASSETS, LINKS, ATTACK_PATH, ATTACK_STEPS, ENV_LABEL, ZONE_INFO, type Env, type EdgeKind, type Zone } from '../data/architecture'
import { ArchNodeView, ZoneView, type ArchNode, type ZoneNode } from '../features/architecture/ArchNodes'
import { AssetPanel } from '../features/architecture/AssetPanel'
import { NW, NH, byId, handles } from '../features/architecture/helpers'
import { useCharacter } from '../components/character/CharacterContext'
type Mode = 'overview' | 'attack' | 'telemetry'
const ENVS = Object.keys(ENV_LABEL) as Env[]
const ZONES = Object.keys(ZONE_INFO) as Zone[]
const STYLE: Record<EdgeKind, { color: string; dash?: string; name: string }> = {
  normal: { color: '#9DB5A5', name: 'Normal communication' }, auth: { color: '#53A7FF', name: 'Authentication' },
  admin: { color: '#FFB547', dash: '6 4', name: 'Administrative access' }, suspicious: { color: '#FF4D5A', name: 'Suspicious (simulated)' },
  blocked: { color: '#FF4D5A', dash: '2 5', name: 'Blocked' }, telemetry: { color: '#39FF88', dash: '8 4', name: 'Telemetry to SIEM' } }
const nodeTypes = { arch: ArchNodeView, zone: ZoneView }
const TELE_NODES = new Set(LINKS.filter(l => l.kind === 'telemetry').flatMap(l => [l.source, l.target]))
const ATTACK_NODES = new Set(ATTACK_PATH.flatMap(id => id.split('>')))
export default function ArchitecturePage() {
  const { act } = useCharacter()
  const [sel, setSel] = useState<string | null>(null)
  const [selEdge, setSelEdge] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('overview')
  const [envs, setEnvs] = useState<Set<Env>>(new Set(ENVS))
  const [zones, setZones] = useState(true)
  const [ctrls, setCtrls] = useState(false)
  const [weak, setWeak] = useState(true)
  const [improved, setImproved] = useState(false)
  const links = useMemo(() => LINKS.map(l => improved && l.improvedKind ? { ...l, kind: l.improvedKind, label: l.improvedLabel ?? l.label } : l), [improved])
  const connected = useMemo(() => {
    if (!sel) return null
    const s = new Set([sel])
    links.forEach(l => { if (l.kind === 'telemetry' && mode !== 'telemetry') return; if (l.source === sel) s.add(l.target); if (l.target === sel) s.add(l.source) })
    return s
  }, [sel, links, mode])
  const brokenAt = ATTACK_PATH.findIndex(id => links.find(l => l.id === id)?.kind === 'blocked')
  const nodes = useMemo(() => {
    const out: (ArchNode | ZoneNode)[] = []
    if (zones) ZONES.forEach(z => {
      const a = ASSETS.filter(x => x.zone === z); if (!a.length) return
      const x0 = Math.min(...a.map(i => i.x)) - 20, y0 = Math.min(...a.map(i => i.y)) - 34
      out.push({ id: `zone-${z}`, type: 'zone', position: { x: x0, y: y0 }, data: { label: z, color: ZONE_INFO[z].color }, style: { width: Math.max(...a.map(i => i.x)) + NW + 20 - x0, height: Math.max(...a.map(i => i.y)) + NH + 20 - y0 }, selectable: false, draggable: false, focusable: false, zIndex: -1 })
    })
    ASSETS.forEach(a => out.push({ id: a.id, type: 'arch', position: { x: a.x, y: a.y }, draggable: false,
      data: { asset: a, color: ZONE_INFO[a.zone].color, selected: sel === a.id, weak: weak && !!a.weak && !improved, ctrlCount: ctrls ? a.controls.length + (improved && a.fix ? 1 : 0) : null,
        dim: !envs.has(a.env) || (mode === 'attack' && !ATTACK_NODES.has(a.id)) || (mode === 'telemetry' && !TELE_NODES.has(a.id)) || (connected !== null && !connected.has(a.id)) } }))
    return out
  }, [zones, sel, weak, improved, ctrls, envs, mode, connected])
  const edges: Edge[] = useMemo(() => links.filter(l => l.kind !== 'telemetry' || mode === 'telemetry').map(l => {
    const st = STYLE[l.kind]; const [s, t] = handles(byId(l.source), byId(l.target))
    const onPath = mode === 'attack' && ATTACK_PATH.includes(l.id)
    const hi = selEdge === l.id || onPath || (mode === 'telemetry' && l.kind === 'telemetry') || (connected !== null && (l.source === sel || l.target === sel))
    const dim = (mode === 'attack' && !onPath) || (mode === 'telemetry' && l.kind !== 'telemetry') || (connected !== null && !hi)
    const color = onPath && l.kind !== 'blocked' ? '#FF4D5A' : st.color
    return { id: l.id, source: l.source, target: l.target, sourceHandle: `s-${s}`, targetHandle: `t-${t}`, animated: l.kind === 'suspicious' || (hi && l.kind === 'telemetry') || onPath,
      label: hi || mode !== 'overview' ? l.label : undefined, labelStyle: { fill: '#E8F5EC', fontSize: 10 }, labelBgStyle: { fill: '#0B1712' },
      style: { stroke: color, strokeWidth: hi ? 2.5 : 1.5, strokeDasharray: st.dash, opacity: dim ? 0.12 : 1 }, markerEnd: { type: MarkerType.ArrowClosed, color } }
  }), [links, mode, selEdge, connected, sel])
  const asset = sel ? byId(sel) : null
  const edge = selEdge ? links.find(l => l.id === selEdge) : null
  const setM = (m: Mode) => { setMode(m); setSel(null); setSelEdge(null)
    act(m === 'attack' ? 'pointing' : m === 'telemetry' ? 'investigating' : 'idle', m === 'attack' ? 'Watch how the attacker moves laterally.' : m === 'telemetry' ? 'Follow the telemetry into the SIEM.' : 'Select any asset to inspect it.', 2500) }
  const pick = (id: string) => { setSel(id); setSelEdge(null); act('explaining', byId(id).purpose, 3500) }
  const toggleEnv = (e: Env) => setEnvs(p => { const n = new Set(p); if (n.has(e)) n.delete(e); else n.add(e); return n.size ? n : new Set(ENVS) })
  const Btn = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) =>
    <button aria-pressed={on} onClick={onClick} className={`text-xs px-2 py-1 rounded border ${on ? 'border-accent text-accent bg-deep' : 'border-deep text-mute hover:text-ink'}`}>{children}</button>
  const weakCount = ASSETS.filter(a => a.weak && !improved).length
  const suspCount = links.filter(l => l.kind === 'suspicious').length
  return (
    <section>
      <h1 className="text-3xl font-bold">Enterprise Architecture</h1>
      <p className="text-mute mt-1 max-w-3xl text-sm">Fictional organization "Aegis Dynamics". All assets, ports, and events are simulated. Select an asset or a connection, trace a simulated attack, follow telemetry to the SIEM, then apply improvements to compare.</p>
      <div className="mt-4 flex flex-wrap gap-2 items-center" role="toolbar" aria-label="Diagram controls">
        <Btn on={mode === 'overview'} onClick={() => setM('overview')}>Overview</Btn>
        <Btn on={mode === 'attack'} onClick={() => setM('attack')}>Trace attack path</Btn>
        <Btn on={mode === 'telemetry'} onClick={() => setM('telemetry')}>Trace telemetry</Btn>
        <span className="w-px h-5 bg-deep" />
        <Btn on={zones} onClick={() => setZones(v => !v)}>Trust boundaries</Btn>
        <Btn on={ctrls} onClick={() => setCtrls(v => !v)}>Control counts</Btn>
        <Btn on={weak} onClick={() => setWeak(v => !v)}>Weak assets</Btn>
        <Btn on={improved} onClick={() => { setImproved(v => !v); act(improved ? 'alert' : 'success', improved ? 'Back to the original, weaker design.' : 'Segmentation and egress filtering break the attack path.', 3000) }}>{improved ? 'After improvements' : 'Before improvements'}</Btn>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 items-center text-xs text-mute">Filter: {ENVS.map(e => <Btn key={e} on={envs.has(e)} onClick={() => toggleEnv(e)}>{ENV_LABEL[e]}</Btn>)}</div>
      <div className="mt-3 grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="glass overflow-hidden h-[70vh] min-h-[460px]">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} colorMode="dark" fitView fitViewOptions={{ padding: 0.1 }} minZoom={0.2} maxZoom={1.8}
            nodesDraggable={false} nodesConnectable={false} proOptions={{ hideAttribution: true }}
            onNodeClick={(_, n) => { if (n.type === 'arch') pick(n.id) }} onEdgeClick={(_, e) => { setSelEdge(e.id); setSel(null) }} onPaneClick={() => { setSel(null); setSelEdge(null) }}>
            <Background color="#123C2B" gap={32} /><Controls showInteractive={false} /><MiniMap pannable zoomable className="!hidden md:!block" bgColor="#0B1712" nodeColor={n => (n.type === 'zone' ? 'transparent' : '#39FF88')} maskColor="rgba(7,17,13,0.55)" />
          </ReactFlow>
        </div>
        <aside className="glass p-4 overflow-y-auto max-h-[70vh] min-h-[200px]" aria-live="polite">
          {asset ? <AssetPanel asset={asset} links={links} improved={improved} onPick={pick} />
            : edge ? <div><h3 className="font-semibold">{byId(edge.source).label} → {byId(edge.target).label}</h3>
              <p className="text-xs mt-1" style={{ color: STYLE[edge.kind].color }}>{STYLE[edge.kind].name}: {edge.label}</p><p className="mt-3 text-sm">{edge.why}</p></div>
            : mode === 'attack' ? <div><h3 className="font-semibold">Simulated attack path</h3>
              <ol className="mt-2 text-sm space-y-1">{ATTACK_STEPS.map((s, i) => <li key={s} className={brokenAt !== -1 && i >= brokenAt ? (i === brokenAt ? 'text-crit' : 'text-mute line-through') : ''}>{i + 1}. {s}{i === brokenAt ? ' (blocked)' : ''}</li>)}</ol>
              <p className="mt-3 text-xs text-mute">{brokenAt === -1 ? 'Nothing stops the lateral step in the current design.' : 'Improvements block the lateral step, so later stages never happen.'}</p></div>
            : mode === 'telemetry' ? <div><h3 className="font-semibold">Telemetry flow</h3><p className="mt-2 text-sm text-mute">Each source forwards events to the SIEM or EDR. A raw event is just a log line; a detection is logic that matches it; an alert is what an analyst sees; an incident groups related alerts. A SIEM only detects what is logged, parsed, and covered by rules. Click a green line to see what each source contributes.</p></div>
            : <div><h3 className="font-semibold">How to use</h3><p className="mt-2 text-sm text-mute">Click an asset to inspect it and highlight its direct upstream and downstream connections. Click a line to read why it exists. Scroll to zoom and drag to pan.</p>
              <div className="mt-3 text-xs text-mute">Weak assets now: <span className="text-warn">{weakCount}</span> · Suspicious paths: <span className="text-crit">{suspCount}</span></div>
              {zones && <ul className="mt-3 text-xs text-mute space-y-1">{ZONES.map(z => <li key={z}><span style={{ color: ZONE_INFO[z].color }}>{z}:</span> {ZONE_INFO[z].text}</li>)}</ul>}</div>}
        </aside>
      </div>
      <div className="mt-3 glass p-3 flex flex-wrap gap-4 text-xs" aria-label="Legend">
        {(Object.keys(STYLE) as EdgeKind[]).map(k => <span key={k} className="flex items-center gap-2"><svg width="30" height="6"><line x1="0" y1="3" x2="30" y2="3" stroke={STYLE[k].color} strokeWidth="2" strokeDasharray={STYLE[k].dash} /></svg>{STYLE[k].name}</span>)}
        <span className="text-warn">Amber ring = weakly protected asset</span>
      </div>
      <p className="mt-2 text-xs text-mute">Educational simulation. Controls reduce specific risks; they do not guarantee protection. Cloud, mail, and identity services are examples; availability varies by vendor and licensing.</p>
    </section>)
}

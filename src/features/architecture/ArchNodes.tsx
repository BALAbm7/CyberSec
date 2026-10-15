import { Fragment } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Globe, Flame, Mail, Laptop, Monitor, KeyRound, Server, Database, Cloud, ScrollText, Cpu, Radar, AlertTriangle, type LucideIcon } from 'lucide-react'
import { ENV_LABEL, type Asset } from '../../data/architecture'
const ICONS: Record<string, LucideIcon> = { globe: Globe, flame: Flame, mail: Mail, laptop: Laptop, monitor: Monitor, key: KeyRound, server: Server, database: Database, cloud: Cloud, scroll: ScrollText, cpu: Cpu, radar: Radar }
export type ArchData = { asset: Asset; dim: boolean; weak: boolean; ctrlCount: number | null; color: string; selected: boolean; [k: string]: unknown }
export type ZoneData = { label: string; color: string; [k: string]: unknown }
export type ArchNode = Node<ArchData, 'arch'>
export type ZoneNode = Node<ZoneData, 'zone'>
const SIDES = [['l', Position.Left], ['r', Position.Right], ['t', Position.Top], ['b', Position.Bottom]] as const
export function ArchNodeView({ data }: NodeProps<ArchNode>) {
  const Icon = ICONS[data.asset.icon] ?? Server
  return (
    <div role="button" aria-label={`${data.asset.label}, ${ENV_LABEL[data.asset.env]}, zone ${data.asset.zone}${data.weak ? ', weakly protected' : ''}`}
      className={`w-[170px] rounded-lg bg-card p-2 border-2 transition-opacity ${data.dim ? 'opacity-25' : ''} ${data.selected ? 'ring-2 ring-accent' : ''} ${data.weak ? 'ring-2 ring-warn' : ''}`}
      style={{ borderColor: data.color }}>
      {SIDES.map(([k, p]) => (
        <Fragment key={k}>
          <Handle id={`s-${k}`} type="source" position={p} isConnectable={false} className="!opacity-0 !pointer-events-none" />
          <Handle id={`t-${k}`} type="target" position={p} isConnectable={false} className="!opacity-0 !pointer-events-none" />
        </Fragment>))}
      <div className="flex items-center gap-2 text-xs font-semibold"><Icon size={16} className="text-accent shrink-0" /> <span className="leading-tight">{data.asset.label}</span></div>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-mute"><span>{ENV_LABEL[data.asset.env]}</span><span>·</span><span>{data.asset.zone}</span>
        {data.weak && <AlertTriangle size={12} className="ml-auto text-warn" aria-label="Weakly protected" />}</div>
      {data.ctrlCount !== null && <div className="mt-1 text-[10px] text-accent2">{data.ctrlCount} controls</div>}
    </div>)
}
export function ZoneView({ data }: NodeProps<ZoneNode>) {
  return <div className="w-full h-full rounded-xl border border-dashed pointer-events-none" style={{ borderColor: data.color, background: `${data.color}10` }}>
    <span className="absolute top-1 left-2 text-[10px] font-mono uppercase" style={{ color: data.color }}>{data.label} zone</span></div>
}

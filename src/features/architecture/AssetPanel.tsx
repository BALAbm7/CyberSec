import { ENV_LABEL, ASSETS, ZONE_INFO, type Asset, type Link } from '../../data/architecture'
const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-3"><h4 className="text-xs font-mono uppercase text-accent">{title}</h4>
    <ul className="mt-1 list-disc pl-4 text-sm text-mute space-y-0.5">{items.map(i => <li key={i}>{i}</li>)}</ul></div>)
export function AssetPanel({ asset, links, improved, onPick }: { asset: Asset; links: Link[]; improved: boolean; onPick: (id: string) => void }) {
  const mine = links.filter(l => l.source === asset.id || l.target === asset.id)
  const name = (id: string) => ASSETS.find(a => a.id === id)?.label ?? id
  const weak = asset.weak && !improved
  return (
    <div>
      <h3 className="text-lg font-semibold">{asset.label}</h3>
      <p className="text-xs text-mute">{ENV_LABEL[asset.env]} · {asset.zone} zone</p>
      <p className="mt-2 text-sm">{asset.purpose}</p>
      <p className="mt-2 text-xs text-mute"><span className="text-ink">Trust zone:</span> {ZONE_INFO[asset.zone].text}</p>
      <p className="mt-2 text-xs text-mute"><span className="text-ink">Ports / protocols:</span> {asset.ports}</p>
      {weak && <p className="mt-3 text-sm border border-warn rounded p-2 text-warn">Weakly protected (simulated): {asset.weak}</p>}
      {asset.weak && improved && <p className="mt-3 text-sm border border-accent rounded p-2 text-accent">Improved: {asset.fix}</p>}
      <List title="Security controls" items={improved && asset.fix ? [...asset.controls, asset.fix] : asset.controls} />
      <List title="Potential threats" items={asset.threats} />
      <List title="Detection sources" items={asset.detection} />
      <List title="Hardening" items={asset.hardening} />
      <div className="mt-3"><h4 className="text-xs font-mono uppercase text-accent">Connected assets</h4>
        <ul className="mt-1 text-sm space-y-1">{mine.map(l => { const out = l.source === asset.id; const other = out ? l.target : l.source
          return <li key={l.id}><button className="text-left hover:text-accent" onClick={() => onPick(other)}>{out ? '→' : '←'} {name(other)} <span className="text-mute text-xs">({l.kind}, {l.label})</span></button></li> })}</ul></div>
    </div>)
}

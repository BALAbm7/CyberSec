import { useState } from 'react'
import { CLOUD_SHARED, AWS, AZURE, INCIDENTS, CLOUD_NOTE } from '../data/cloudLab'
import { Concepts, H, Intro, Pre, Tabs } from '../components/ui/Primitives'
type Tab = 'shared' | 'aws' | 'azure' | 'inc'
export default function CloudSecurityPage() {
  const [tab, setTab] = useState<Tab>('shared'); const [id, setId] = useState(INCIDENTS[0].id)
  const inc = INCIDENTS.find(i => i.id === id) ?? INCIDENTS[0]
  return (
    <section>
      <Intro title="Cloud Security Lab">Vendor-neutral fundamentals with AWS and Azure learning paths and five fictional cloud incidents.</Intro>
      <p className="mt-2 text-xs text-warn border border-deep rounded p-2 max-w-3xl">{CLOUD_NOTE}</p>
      <div className="mt-4"><Tabs<Tab> tabs={[['shared', 'Fundamentals'], ['aws', 'AWS path'], ['azure', 'Azure path'], ['inc', 'Incidents']]} value={tab} onChange={setTab} /></div>
      <div className="mt-4">
        {tab === 'shared' && <Concepts items={CLOUD_SHARED} />}{tab === 'aws' && <Concepts items={AWS} />}{tab === 'azure' && <Concepts items={AZURE} />}
        {tab === 'inc' && <div className="grid lg:grid-cols-[260px_1fr] gap-4">
          <ul className="space-y-2">{INCIDENTS.map(i => <li key={i.id}><button onClick={() => setId(i.id)} aria-pressed={i.id === id} className={`w-full text-left glass p-2 text-sm ${i.id === id ? 'border-accent' : ''}`}>{i.name}</button></li>)}</ul>
          <article className="glass p-4"><h2 className="font-semibold">{inc.name}</h2>
            <H>Synthetic log</H><Pre>{inc.log}</Pre>
            <H>Investigation steps</H><ol className="list-decimal pl-5 text-sm text-mute">{inc.steps.map(s => <li key={s}>{s}</li>)}</ol>
            <H>Defensive controls</H><ul className="list-disc pl-5 text-sm text-mute">{inc.controls.map(s => <li key={s}>{s}</li>)}</ul></article></div>}
      </div>
    </section>)
}

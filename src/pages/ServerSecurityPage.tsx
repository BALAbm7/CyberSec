import { useState } from 'react'
import { WIN_EVENTS, WIN_CONCEPTS, WIN_SEQ, LINUX_CONCEPTS, LINUX_LOGS, SSH_HARDEN } from '../data/serverLab'
import { Concepts, H, Intro, Tabs } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
type Tab = 'win' | 'lin'
function Reveal({ items }: { items: { head: string; say: string; sus?: boolean }[] }) {
  const { act } = useCharacter()
  const [seen, setSeen] = useState<number[]>([])
  return <ul className="space-y-2">{items.map((i, n) => <li key={i.head}>
    <button onClick={() => { setSeen(s => (s.includes(n) ? s : [...s, n])); act('investigating', 'Read each line, then the sequence.', 2000) }} className="w-full text-left text-[12px] font-mono bg-bg2 border border-deep rounded p-2 hover:border-accent break-words">{i.head}</button>
    {seen.includes(n) && <p className={`mt-1 ml-2 text-xs ${i.sus ? 'text-warn' : 'text-mute'}`}>{i.say}</p>}</li>)}</ul>
}
export default function ServerSecurityPage() {
  const [tab, setTab] = useState<Tab>('win')
  const [q, setQ] = useState('')
  const rows = WIN_EVENTS.filter(e => (e.id + e.name + e.desc).toLowerCase().includes(q.toLowerCase()))
  return (
    <section>
      <Intro title="Windows & Linux Security">Selected log events, what they mean, and how to read them in sequence. A single event rarely proves malicious activity; context and correlation do.</Intro>
      <div className="mt-4"><Tabs<Tab> tabs={[['win', 'Windows'], ['lin', 'Linux']]} value={tab} onChange={setTab} /></div>
      {tab === 'win' ? <div>
        <H>Windows event ID reference</H>
        <input aria-label="Filter events" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter events, e.g. 4624 or service" className="w-full max-w-sm bg-bg2 border border-deep rounded px-3 py-1.5 text-sm" />
        <div className="mt-2 grid md:grid-cols-2 gap-3">{rows.map(e => <article key={e.id} className="glass p-3"><h4 className="text-sm font-semibold"><span className="font-mono text-accent">{e.id}</span> {e.name} <span className="text-xs text-mute">({e.log})</span></h4>
          <p className="mt-1 text-sm text-mute">{e.desc}</p><p className="mt-1 text-xs"><span className="text-accent">Watch for:</span> {e.watch}</p><p className="text-xs text-warn">Limitation: {e.limit}</p></article>)}
          {!rows.length && <p className="text-sm text-mute">No matching events.</p>}</div>
        <H>Guided investigation (synthetic)</H><p className="text-xs text-mute mb-2">Click each line to read the analysis.</p>
        <Reveal items={WIN_SEQ.map(s => ({ head: `${s.t}  ${s.line}`, say: s.say, sus: true }))} />
        <p className="mt-2 text-xs text-mute">Together these suggest guessing, a successful admin logon from a workstation, and remote service installation. Any one alone could be benign.</p>
        <H>Concepts</H><Concepts items={WIN_CONCEPTS} />
      </div> : <div>
        <H>Concepts</H><Concepts items={LINUX_CONCEPTS} />
        <H>Log analysis (synthetic)</H><p className="text-xs text-mute mb-2">Click each line to read what it indicates.</p>
        <Reveal items={LINUX_LOGS.map(l => ({ head: l.line, say: l.say, sus: l.sus }))} />
        <H>SSH hardening (sshd_config)</H>
        <div className="glass p-3 overflow-x-auto"><table className="text-sm w-full"><tbody>{SSH_HARDEN.map(h => <tr key={h.s} className="border-t border-deep first:border-0"><td className="py-1 pr-3 font-mono text-xs text-accent whitespace-nowrap">{h.s}</td><td className="text-mute">{h.w}</td></tr>)}</tbody></table></div>
        <p className="mt-2 text-xs text-mute">Test changes from a second session before closing the first, to avoid locking yourself out.</p>
      </div>}
    </section>)
}

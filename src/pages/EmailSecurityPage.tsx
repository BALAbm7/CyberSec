import { useState } from 'react'
import { EMAIL_CONCEPTS, RAW_HEADERS, INDICATORS, VERDICTS, EMAIL_STEPS } from '../data/emailLab'
import { Concepts, H, Intro, Pre, Tabs } from '../components/ui/Primitives'
import { useCharacter } from '../components/character/CharacterContext'
type Tab = 'learn' | 'lab'
export default function EmailSecurityPage() {
  const { act } = useCharacter()
  const [tab, setTab] = useState<Tab>('lab')
  const [seen, setSeen] = useState<string[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [verdict, setVerdict] = useState('')
  const [done, setDone] = useState(false)
  const view = (id: string) => { setOpen(o => (o === id ? null : id)); if (!seen.includes(id)) setSeen([...seen, id]); act('investigating', 'Look at the evidence, not just the pass/fail results.', 2500) }
  const v = VERDICTS.find(x => x.id === verdict)
  const submit = () => { setDone(true); act(v?.ok ? 'success' : 'error', v?.ok ? 'Right call. Authentication passed, but the mail is still malicious.' : 'Look again at the domain and the attachment.', 3500) }
  const groups = [...new Set(INDICATORS.map(i => i.group))]
  return (
    <section>
      <Intro title="Email Security Lab">Learn how email authentication works, then investigate a fictional phishing message. Nothing is fetched or downloaded: URLs and attachments are described, never opened.</Intro>
      <div className="mt-4"><Tabs<Tab> tabs={[['lab', 'Investigation lab'], ['learn', 'Concepts']]} value={tab} onChange={setTab} /></div>
      {tab === 'learn' ? <div className="mt-4"><Concepts items={EMAIL_CONCEPTS} /></div> : (
        <div className="mt-4 grid lg:grid-cols-[1fr_360px] gap-4">
          <div className="glass p-4">
            <h2 className="font-semibold">Subject: Action required: unpaid invoice 8841</h2>
            <p className="text-xs text-mute">Synthetic message. Click each field to inspect it ({seen.length}/{INDICATORS.length} reviewed).</p>
            {groups.map(g => <div key={g}><H>{g}</H><ul className="space-y-1">{INDICATORS.filter(i => i.group === g).map(i => <li key={i.id}>
              <button onClick={() => view(i.id)} aria-expanded={open === i.id} className="w-full text-left text-sm hover:text-accent">{open === i.id ? '▾' : '▸'} <b>{i.label}:</b> <span className="text-mute">{i.value}</span></button>
              {open === i.id && <p className={`mt-1 ml-4 text-xs border-l-2 pl-2 ${i.sus ? 'border-crit text-warn' : 'border-info text-mute'}`}>{i.sus ? 'Suspicious. ' : 'Not suspicious by itself. '}{i.why}</p>}</li>)}</ul></div>)}
            <H>Raw headers (synthetic)</H><Pre>{RAW_HEADERS}</Pre>
          </div>
          <aside className="glass p-4 self-start">
            <h2 className="font-semibold text-sm">Your verdict</h2>
            <fieldset disabled={done} className="mt-2 space-y-1">{VERDICTS.map(x => <label key={x.id} className="flex gap-2 text-sm"><input type="radio" name="v" checked={verdict === x.id} onChange={() => setVerdict(x.id)} className="mt-1 accent-[#39FF88]" />{x.label}</label>)}</fieldset>
            {!done ? <button onClick={submit} disabled={!verdict || seen.length < 3} className="mt-3 px-3 py-1.5 rounded bg-accent text-bg text-sm font-semibold disabled:opacity-40">Submit verdict</button> : (
              <div className="mt-3 text-sm" aria-live="polite">
                <p className={v?.ok ? 'text-accent font-semibold' : 'text-crit font-semibold'}>{v?.ok ? 'Correct' : 'Not quite'}</p>
                <p className="mt-1 text-mute">SPF, DKIM and DMARC all passed, but only for a lookalike domain the attacker owns. The Reply-To mismatch, new domain with a login form, macro attachment, and a user click make this malicious.</p>
                <H>Next steps</H><ul className="list-disc pl-5 text-mute">{EMAIL_STEPS.map(s => <li key={s}>{s}</li>)}</ul>
                <button onClick={() => { setDone(false); setVerdict(''); }} className="mt-3 text-xs border border-deep rounded px-2 py-1">Try again</button></div>)}
            {!done && seen.length < 3 && <p className="mt-2 text-xs text-mute">Review at least 3 fields first.</p>}
          </aside>
        </div>)}
    </section>)
}

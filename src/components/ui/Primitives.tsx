import type { ReactNode } from 'react'
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: [T, string][]; value: T; onChange: (v: T) => void }) {
  return <div role="tablist" className="flex flex-wrap gap-2">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
    className={`text-sm px-3 py-1 rounded border ${value === k ? 'border-accent text-accent bg-deep' : 'border-deep text-mute hover:text-ink'}`}>{l}</button>)}</div>
}
export const Pre = ({ children }: { children: string }) => <pre className="text-[11px] font-mono bg-bg2 border border-deep rounded p-2 whitespace-pre-wrap break-words">{children}</pre>
export const H = ({ children }: { children: ReactNode }) => <h3 className="mt-4 mb-1 text-xs font-mono uppercase text-accent">{children}</h3>
export function Concepts({ items }: { items: { t: string; b: string }[] }) {
  return <div className="grid md:grid-cols-2 gap-3">{items.map(i => <details key={i.t} className="glass p-3"><summary className="cursor-pointer text-sm font-semibold">{i.t}</summary><p className="mt-2 text-sm text-mute">{i.b}</p></details>)}</div>
}
export const Intro = ({ title, children }: { title: string; children: ReactNode }) => <><h1 className="text-3xl font-bold">{title}</h1><p className="text-mute mt-1 text-sm max-w-3xl">{children}</p></>

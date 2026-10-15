import { Menu, Search } from 'lucide-react'
export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex items-center gap-3 p-3 border-b border-deep bg-bg2/80 backdrop-blur sticky top-0 z-20">
      <button className="md:hidden" aria-label="Open menu" onClick={onMenu}><Menu /></button>
      <label className="flex items-center gap-2 glass px-3 py-1.5 flex-1 max-w-md text-sm"><Search size={14} className="text-mute" />
        <input aria-label="Search modules" placeholder="Search (planned, Phase 5)" disabled className="bg-transparent flex-1 outline-none" /></label>
      <span className="ml-auto text-xs font-mono text-accent border border-deep rounded px-2 py-1">SIMULATED DATA</span>
    </header>)
}

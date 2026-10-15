import { NavLink, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { NAV } from '../../data/nav'
import { useCharacter } from '../character/CharacterContext'
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { act } = useCharacter(); const nav = useNavigate()
  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 shrink-0 bg-bg2 border-r border-deep overflow-y-auto transition-transform ${open ? '' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center gap-2 p-4 text-accent font-semibold"><Shield /> CyberSec</div>
      <nav aria-label="Main">
        {NAV.map(n => (
          <NavLink key={n.path} to={n.path} end={n.path === '/'}
            onMouseEnter={() => act('pointing', n.blurb)} onFocus={() => act('pointing', n.blurb)}
            onClick={e => { e.preventDefault(); act('clicking', n.blurb, 1200); onClose(); window.setTimeout(() => nav(n.path), 250) }}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2 text-sm ${isActive ? 'bg-deep text-accent' : 'text-mute hover:text-ink hover:bg-card'}`}>
            <n.icon size={16} /> {n.label}
          </NavLink>))}
      </nav>
    </aside>)
}

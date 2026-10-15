import { useLocation } from 'react-router-dom'
import { NAV } from '../data/nav'
export default function ModulePage() {
  const { pathname } = useLocation(); const item = NAV.find(n => n.path === pathname)
  if (!item) return <p className="py-8">Page not found.</p>
  return (
    <section className="py-8 max-w-2xl">
      <h1 className="text-3xl font-bold flex items-center gap-3"><item.icon className="text-accent" /> {item.label}</h1>
      <p className="mt-3 text-mute">{item.blurb}</p>
      <p className="mt-6 glass p-4 text-sm"><span className="text-warn font-mono">PLANNED (Phase {item.phase}).</span> This module is not implemented yet. It will use only local, synthetic data.</p>
    </section>)
}

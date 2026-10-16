import { lazy, Suspense, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { Character } from '../components/character/Character'
import HomePage from '../pages/HomePage'
import ModulePage from '../pages/ModulePage'
import { NAV } from '../data/nav'
const pages: Record<string, LazyExoticComponent<ComponentType>> = {
  '/architecture': lazy(() => import('../pages/ArchitecturePage')), '/cyber-range': lazy(() => import('../pages/CyberRangePage')), '/red-team': lazy(() => import('../pages/RedTeamPage')),
  '/blue-team': lazy(() => import('../pages/BlueTeamPage')), '/incident-response': lazy(() => import('../pages/IncidentResponsePage')), '/email': lazy(() => import('../pages/EmailSecurityPage')),
  '/endpoint': lazy(() => import('../pages/EndpointSecurityPage')), '/identity': lazy(() => import('../pages/IdentitySecurityPage')), '/servers': lazy(() => import('../pages/ServerSecurityPage')) }
export default function App() {
  const [open, setOpen] = useState(false); const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="md:flex min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0">
        <Header onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-8 pb-40">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {Object.entries(pages).map(([p, C]) => <Route key={p} path={p} element={<Suspense fallback={<p>Loading…</p>}><C /></Suspense>} />)}
            {NAV.filter(n => n.path !== '/' && !(n.path in pages)).map(n => <Route key={n.path} path={n.path} element={<ModulePage />} />)}
            <Route path="*" element={<ModulePage />} />
          </Routes>
        </main>
      </div>
      <Character />
    </div>)
}

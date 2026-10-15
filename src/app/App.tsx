import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { Character } from '../components/character/Character'
import HomePage from '../pages/HomePage'
import ModulePage from '../pages/ModulePage'
import { NAV } from '../data/nav'
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
            {NAV.filter(n => n.path !== '/').map(n => <Route key={n.path} path={n.path} element={<ModulePage />} />)}
            <Route path="*" element={<ModulePage />} />
          </Routes>
        </main>
      </div>
      <Character />
    </div>)
}

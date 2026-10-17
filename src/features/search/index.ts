import { NAV } from '../../data/nav'
import { SCENARIOS } from '../../data/attackScenarios'
import { GLOSSARY } from '../../data/glossary'
import { ATTACKS } from '../../data/attackLibrary'
import { ASSETS } from '../../data/architecture'
export interface Hit { label: string; kind: string; to: string }
export const INDEX: Hit[] = [
  ...NAV.map(n => ({ label: n.label, kind: 'Module', to: n.path })),
  ...SCENARIOS.map(s => ({ label: s.name, kind: 'Scenario', to: `/cyber-range?scenario=${s.id}` })),
  ...ATTACKS.map(a => ({ label: a.name, kind: 'Attack', to: `/attack-library?q=${encodeURIComponent(a.name.split(' (')[0])}` })),
  ...GLOSSARY.map(g => ({ label: g.term, kind: 'Glossary', to: `/glossary?q=${encodeURIComponent(g.term)}` })),
  ...ASSETS.map(a => ({ label: a.label, kind: 'Asset', to: '/architecture' }))]
export const search = (q: string): Hit[] => { const s = q.trim().toLowerCase(); return s ? INDEX.filter(h => h.label.toLowerCase().includes(s)).slice(0, 8) : [] }

import { Link } from 'react-router-dom'
import { Radar, Network, Swords, Shield } from 'lucide-react'
import { CharacterSprite } from '../components/character/Character'
import { useCharacter } from '../components/character/CharacterContext'
const ACTIONS = [
  { to: '/cyber-range', label: 'Explore the Cyber Range', icon: Radar, line: 'Aegis Dynamics is ready to explore.' },
  { to: '/architecture', label: 'View Enterprise Architecture', icon: Network, line: 'Trust boundaries first, then telemetry.' },
  { to: '/red-team', label: 'Start a Red-Team Scenario', icon: Swords, line: 'Watch how the attacker moves laterally.' },
  { to: '/blue-team', label: 'Investigate a Blue-Team Alert', icon: Shield, line: "Let's investigate this alert." }]
export default function HomePage() {
  const { state, act } = useCharacter()
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-center py-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Understand the Attack. <span className="text-accent">Master the Defense.</span></h1>
        <p className="mt-4 text-mute max-w-xl">Explore enterprise security architecture, simulate adversary behavior, investigate security alerts, and learn how defenders protect interconnected environments.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {ACTIONS.map(a => (
            <Link key={a.to} to={a.to} onMouseEnter={() => act('pointing', a.line)} className="glass p-3 flex items-center gap-2 text-sm hover:border-accent">
              <a.icon size={16} className="text-accent" /> {a.label}</Link>))}
        </div>
      </div>
      <div className="glass p-6 flex flex-col items-center">
        <CharacterSprite state={state} size={180} />
        <p className="text-xs text-mute mt-2">Preview the character's states:</p>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {(['pointing', 'investigating', 'alert', 'success', 'error'] as const).map(s => (
            <button key={s} onClick={() => act(s, `State: ${s}`)} className="text-xs border border-deep rounded px-2 py-1 hover:text-accent">{s}</button>))}
        </div>
      </div>
    </section>)
}

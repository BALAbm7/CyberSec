import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCharacter, type CharState } from './CharacterContext'
const armRot: Record<CharState, number> = { idle: 10, walking: 25, pointing: -80, clicking: -60, dragging: -40, explaining: -30, investigating: -50, alert: -120, success: -150, error: 40 }
export function CharacterSprite({ state, size = 160 }: { state: CharState; size?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.svg role="img" aria-label={`Kei, the CyberSec guide, ${state}`} width={size} height={size * 1.5} viewBox="0 0 120 180"
      animate={reduce ? undefined : { y: state === 'success' ? [0, -10, 0] : [0, -2, 0] }}
      transition={{ duration: state === 'success' ? 0.5 : 3, repeat: Infinity }}>
      <ellipse cx="60" cy="174" rx="30" ry="4" fill="#000" opacity=".4" />
      <rect x="40" y="110" width="16" height="52" rx="6" fill="#1b1f24" /><rect x="64" y="110" width="16" height="52" rx="6" fill="#1b1f24" />
      <rect x="36" y="160" width="22" height="10" rx="5" fill="#E8F5EC" /><rect x="62" y="160" width="22" height="10" rx="5" fill="#E8F5EC" />
      <rect x="32" y="60" width="56" height="58" rx="16" fill="#123C2B" stroke="#39FF88" strokeWidth="1.5" />
      <path d="M52 62v22M68 62v22" stroke="#7CFFB2" strokeWidth="1.5" />
      <rect x="46" y="96" width="28" height="14" rx="5" fill="#0B1712" />
      <motion.g animate={{ rotate: armRot[state] }} style={{ transformOrigin: '88px 70px' }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
        <rect x="84" y="66" width="12" height="40" rx="6" fill="#123C2B" stroke="#39FF88" strokeWidth="1" /><circle cx="90" cy="108" r="6" fill="#d9a77c" />
      </motion.g>
      <rect x="24" y="68" width="12" height="40" rx="6" fill="#123C2B" stroke="#39FF88" strokeWidth="1" />
      <path d="M28 44c0-22 14-32 32-32s32 10 32 32v14H28z" fill="#123C2B" stroke="#39FF88" strokeWidth="1.5" />
      <ellipse cx="60" cy="48" rx="21" ry="20" fill="#0B1712" /><ellipse cx="60" cy="50" rx="16" ry="16" fill="#d9a77c" />
      <motion.g animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }} style={{ transformOrigin: '60px 48px' }} transition={{ duration: 4, repeat: Infinity, times: [0, .93, .96, 1] }}>
        <circle cx="53" cy="48" r="2" fill="#07110D" /><circle cx="67" cy="48" r="2" fill="#07110D" />
      </motion.g>
      <path d={state === 'error' || state === 'alert' ? 'M54 59q6-3 12 0' : 'M54 57q6 4 12 0'} stroke="#07110D" strokeWidth="1.5" fill="none" />
    </motion.svg>)
}
export function Character() {
  const { state, line, hidden, setHidden, act } = useCharacter()
  if (hidden) return <button onClick={() => { setHidden(false); act('success', 'Welcome back!') }} className="fixed bottom-4 right-4 z-30 glass px-3 py-2 text-sm text-accent">Show guide</button>
  return (
    <div className="fixed bottom-2 right-3 z-30 hidden sm:flex items-end gap-2 pointer-events-none" aria-live="polite">
      <motion.div key={line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass max-w-[220px] p-3 text-sm pointer-events-auto relative mb-24">
        <button aria-label="Hide guide" onClick={() => setHidden(true)} className="absolute -top-2 -right-2 bg-bg2 rounded-full p-1 border border-deep"><X size={12} /></button>
        {line}
      </motion.div>
      <CharacterSprite state={state} size={90} />
    </div>)
}

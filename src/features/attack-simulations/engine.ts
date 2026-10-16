import type { ControlId, Scenario } from '../../data/attackScenarios'
export interface StageResult { status: 'reached' | 'prevented' | 'not-reached'; detected: boolean }
export function runScenario(s: Scenario, on: ReadonlySet<ControlId>): StageResult[] {
  let blocked = false
  return s.stages.map(st => {
    if (blocked) return { status: 'not-reached', detected: false }
    const detected = st.detectedBy.some(c => on.has(c))
    if (st.preventedBy.some(c => on.has(c))) { blocked = true; return { status: 'prevented', detected } }
    return { status: 'reached', detected }
  })
}
export const summarize = (r: StageResult[]) => ({ reached: r.filter(x => x.status === 'reached').length, detected: r.filter(x => x.detected).length, total: r.length })

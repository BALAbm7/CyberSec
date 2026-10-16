import { ASSETS, type Asset } from '../../data/architecture'
export const NW = 170, NH = 64
export const byId = (id: string) => ASSETS.find(a => a.id === id) as Asset
export function handles(a: Asset, b: Asset): [string, string] {
  const dx = b.x - a.x, dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy) * 0.7) return dx >= 0 ? ['r', 'l'] : ['l', 'r']
  return dy >= 0 ? ['b', 't'] : ['t', 'b']
}

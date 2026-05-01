import type { ComponentData } from '@puckeditor/core'

function isComponentDataSlice(v: unknown): v is ComponentData[] {
  if (!Array.isArray(v) || v.length === 0) return false
  const first = v[0]
  if (typeof first !== 'object' || first === null) return false
  const o = first as Record<string, unknown>
  return typeof o.type === 'string' && isRecord(o.props)
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Depth-first preorder: visits each component, then nested slot arrays (deterministic sorted prop keys). */
export function walkPuckContentPreorder(
  content: ComponentData[],
  visitor: (node: ComponentData) => void,
): void {
  const visitSubtree = (node: ComponentData) => {
    visitor(node)
    const p = node.props
    if (!isRecord(p)) return
    const keys = Object.keys(p).sort()
    for (const k of keys) {
      const v = p[k]
      if (!isComponentDataSlice(v)) continue
      for (const child of v) visitSubtree(child)
    }
  }
  for (const root of content) visitSubtree(root)
}

export function shallowClonePuckContent(content: ComponentData[]): ComponentData[] {
  return JSON.parse(JSON.stringify(content)) as ComponentData[]
}

/** Accept arrays produced by Puck `Data.content`; rejects obvious garbage. */
export function parseStoredPuckContent(raw: unknown): ComponentData[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  for (const x of raw) {
    if (typeof x !== 'object' || x === null) return undefined
    const o = x as Record<string, unknown>
    if (typeof o.type !== 'string') return undefined
    if (!('props' in o) || !isRecord(o.props)) return undefined
  }
  return raw as ComponentData[]
}

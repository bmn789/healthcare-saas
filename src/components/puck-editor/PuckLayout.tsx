import type { CSSProperties, ReactNode } from 'react'

export const PUCK_LAYOUT_ROW_TYPE = 'PuckLayoutRow' as const

export type PuckLayoutRowVariant =
  | 'grid-2'
  | 'grid-3'
  | 'grid-4'
  | 'ratio-1-2'
  | 'ratio-1-3'
  | 'ratio-1-4'
  | 'ratio-2-1'
  | 'ratio-2-3'
  | 'flex-wrap'

const GRID_VARIANTS = new Set<PuckLayoutRowVariant>([
  'grid-2',
  'grid-3',
  'grid-4',
  'ratio-1-2',
  'ratio-1-3',
  'ratio-1-4',
  'ratio-2-1',
  'ratio-2-3',
])

type RatioLayoutKey = Extract<
  PuckLayoutRowVariant,
  'ratio-1-2' | 'ratio-1-3' | 'ratio-1-4' | 'ratio-2-1' | 'ratio-2-3'
>

/**
 * Literal `md:grid-cols-[...]` strings so Tailwind JIT emits every variant (template-built
 * classes are tree-shaken and reverse ratio looked “broken” at runtime).
 */
const RATIO_MD_COLS: Record<RatioLayoutKey, { fwd: string; rev: string }> = {
  'ratio-1-2': {
    fwd: 'md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
    rev: 'md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
  },
  'ratio-1-3': {
    fwd: 'md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]',
    rev: 'md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]',
  },
  'ratio-1-4': {
    fwd: 'md:grid-cols-[minmax(0,1fr)_minmax(0,4fr)]',
    rev: 'md:grid-cols-[minmax(0,4fr)_minmax(0,1fr)]',
  },
  'ratio-2-1': {
    fwd: 'md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]',
    rev: 'md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
  },
  'ratio-2-3': {
    fwd: 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]',
    rev: 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]',
  },
}

function ratioGridColsClass(
  variant: RatioLayoutKey,
  gapClass: string,
  layoutReverse: boolean,
): string {
  const { fwd, rev } = RATIO_MD_COLS[variant]
  const mdCols = layoutReverse ? rev : fwd
  return `grid min-h-0 min-w-0 w-full grid-cols-1 ${mdCols} md:grid-flow-dense md:items-stretch ${gapClass}`
}

function resolveLayoutReverse(raw: unknown): boolean {
  if (raw === true) return true
  if (typeof raw === 'string') {
    const s = raw.toLowerCase().trim()
    return s === 'yes' || s === 'true' || s === 'reverse'
  }
  return false
}

export type PuckLayoutRowGap = 'sm' | 'md' | 'lg'

/** Slot field render target from Puck (`type: "slot"`). */
export type PuckItemsSlot = ((props?: { className?: string; style?: CSSProperties }) => ReactNode) | undefined

const GAP_CLASS: Record<PuckLayoutRowGap, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

export function puckLayoutVariantAndGapClass(
  variant: PuckLayoutRowVariant,
  gap: PuckLayoutRowGap,
  layoutReverse = false,
): string {
  const g = GAP_CLASS[gap]
  const rev = layoutReverse

  switch (variant) {
    case 'grid-2':
      return `grid min-h-0 min-w-0 w-full grid-cols-1 md:grid-cols-2 md:grid-flow-dense md:items-stretch ${g}`
    case 'grid-3':
      return `grid min-h-0 min-w-0 w-full grid-cols-1 md:grid-cols-3 md:grid-flow-dense md:items-stretch ${g}`
    case 'grid-4':
      return `grid min-h-0 min-w-0 w-full grid-cols-1 md:grid-cols-4 md:grid-flow-dense md:items-stretch ${g}`
    case 'ratio-1-2':
      return ratioGridColsClass('ratio-1-2', g, rev)
    case 'ratio-1-3':
      return ratioGridColsClass('ratio-1-3', g, rev)
    case 'ratio-1-4':
      return ratioGridColsClass('ratio-1-4', g, rev)
    case 'ratio-2-1':
      return ratioGridColsClass('ratio-2-1', g, rev)
    case 'ratio-2-3':
      return ratioGridColsClass('ratio-2-3', g, rev)
    case 'flex-wrap':
    default:
      return `flex min-h-0 min-w-0 w-full flex-wrap items-stretch content-start ${g} [&>*]:min-h-0 [&>*]:max-w-full [&>*]:min-w-[min(100%,16rem)] [&>*]:flex-[1_1_16rem]`
  }
}

function editChrome(isEditing?: boolean): string {
  if (!isEditing) return ''
  return 'rounded-lg border border-dashed border-violet-300/50 bg-violet-50/20 p-1 dark:border-violet-400/35 dark:bg-violet-950/20'
}

type LayoutRowRenderProps = {
  puck?: { isEditing?: boolean }
  variant?: PuckLayoutRowVariant
  gap?: PuckLayoutRowGap
  /** When true, swaps proportional tracks (e.g. 1:2 → 2:1). */
  layoutReverse?: boolean | string
  items?: PuckItemsSlot
}

/** Shared layout row renderer; props match Puck injected fields + defaults. */
export function renderPuckLayoutRow({
  puck,
  variant,
  gap,
  layoutReverse,
  items: Items,
}: LayoutRowRenderProps) {
  const v = variant && GRID_VARIANTS.has(variant) ? variant : 'flex-wrap'
  const g: PuckLayoutRowGap = gap === 'sm' || gap === 'md' || gap === 'lg' ? gap : 'md'
  const inner = puckLayoutVariantAndGapClass(v, g, resolveLayoutReverse(layoutReverse))

  return (
    <div className={`min-h-0 min-w-0 w-full ${editChrome(puck?.isEditing)}`}>
      {Items ? <Items className={inner} /> : null}
    </div>
  )
}

export function createPuckLayoutRowBlock() {
  return {
    label: 'Responsive layout row',
    fields: {
      variant: {
        type: 'radio' as const,
        label: 'Layout',
        options: [
          { label: '2 columns', value: 'grid-2' },
          { label: '3 columns', value: 'grid-3' },
          { label: '4 columns', value: 'grid-4' },
          { label: '1 : 2', value: 'ratio-1-2' },
          { label: '1 : 3', value: 'ratio-1-3' },
          { label: '1 : 4', value: 'ratio-1-4' },
          { label: '2 : 1', value: 'ratio-2-1' },
          { label: '2 : 3', value: 'ratio-2-3' },
          { label: 'Flex wrap', value: 'flex-wrap' },
        ],
      },
      layoutReverse: {
        type: 'radio' as const,
        label: 'Reverse ratio columns (1:2 → 2:1, etc.)',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes', value: 'yes' },
        ],
      },
      gap: {
        type: 'radio' as const,
        label: 'Gap',
        options: [
          { label: 'S', value: 'sm' },
          { label: 'M', value: 'md' },
          { label: 'L', value: 'lg' },
        ],
      },
      items: {
        type: 'slot' as const
      },
    },
    defaultProps: {
      variant: 'flex-wrap',
      gap: 'md',
      layoutReverse: 'no',
      items: [],
    },
    // Puck slot props are loosely typed upstream; normalize here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PuckComponent generic slot typing
    render: renderPuckLayoutRow
  }
}

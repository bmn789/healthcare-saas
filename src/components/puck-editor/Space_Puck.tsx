export const PUCK_SPACE_TYPE = 'PuckSpace' as const

export type PuckSpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

const SPACE_PADDING: Record<PuckSpaceSize, string> = {
  xs: 'p-1 sm:p-1.5 md:p-2 lg:p-2.5',
  sm: 'p-1.5 sm:p-2 md:p-2.5 lg:p-3',
  md: 'p-2 sm:p-2.5 md:p-3 lg:p-4',
  lg: 'p-3 sm:p-4 md:p-5 lg:p-7',
  xl: 'p-4 sm:p-5 md:p-7 lg:p-9 xl:p-10',
  '2xl': 'p-5 sm:p-6 md:p-9 lg:p-11 xl:p-14',
  '3xl': 'p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-24',
}

function editChrome(isEditing?: boolean): string {
  if (!isEditing) return ''
  return 'rounded-md border border-dashed border-slate-300/60 bg-slate-100/30 dark:border-slate-600/50 dark:bg-slate-900/30'
}

type SpaceRenderProps = {
  puck?: { isEditing?: boolean }
  size?: PuckSpaceSize
}

const SIZE_ORDER: PuckSpaceSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

function spacePaddingClass(size: PuckSpaceSize | undefined): string {
  const s: PuckSpaceSize =
    size && SIZE_ORDER.includes(size as PuckSpaceSize) ? size : 'md'
  return SPACE_PADDING[s]
}

function renderPuckSpace({ puck, size }: SpaceRenderProps) {
  const padding = spacePaddingClass(size)

  return (
    <div
      role="presentation"
      aria-hidden
      className={`min-h-0 min-w-0 w-full shrink-0 ${padding} ${editChrome(puck?.isEditing)}`}
    />
  )
}

/** Puck block — visual gap via responsive padding between siblings. */
export function createPuckSpaceBlock() {
  return {
    label: 'Space',
    fields: {
      size: {
        type: 'radio' as const,
        label: 'Padding',
        options: [
          { label: 'XS', value: 'xs' },
          { label: 'S', value: 'sm' },
          { label: 'M', value: 'md' },
          { label: 'L', value: 'lg' },
          { label: 'XL', value: 'xl' },
          { label: '2XL', value: '2xl' },
          { label: '3XL', value: '3xl' },
        ],
      },
    },
    defaultProps: {
      size: 'md',
    },
    render: renderPuckSpace,
  }
}

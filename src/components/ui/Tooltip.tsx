import type { ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'

type TooltipProps = {
  content: string
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export const Tooltip = ({ content, children, side = 'top', sideOffset = 8 }: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={120} skipDelayDuration={100}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={sideOffset}
            className="radix-tooltip-content z-50 select-none rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-slate-900/30 dark:bg-slate-800"
          >
            {content}
            <RadixTooltip.Arrow
              className="fill-slate-900 dark:fill-slate-800"
              width={11}
              height={5}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

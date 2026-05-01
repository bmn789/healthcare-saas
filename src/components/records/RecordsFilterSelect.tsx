import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'

export type RecordsFilterOption = {
  value: string
  label: string
}

type RecordsFilterSelectProps = {
  value: string
  onValueChange: (value: string) => void
  options: readonly RecordsFilterOption[]
  /** Visible / accessible name when there is no sibling label */
  ariaLabel: string
  /** Tailwind classes for trigger width, e.g. min-w-[8.5rem] */
  triggerMinWidthClass?: string
  /**
   * If the user activates the already-selected option, set value to this (e.g. clear filter).
   * No-op when the current value already equals resetValue.
   */
  resetValue?: string
}

const triggerStyles =
  'inline-flex min-h-9 items-center justify-between gap-2 rounded-lg border border-violet-200/80 bg-white px-3 py-2 text-left text-sm text-slate-800 outline-none ring-violet-400/30 transition hover:bg-violet-50 focus:ring-2 data-[state=open]:ring-2 dark:border-violet-500/30 dark:bg-slate-950 dark:text-violet-100 dark:hover:bg-slate-900 dark:focus:ring-violet-400 [&>span:first-child]:min-w-0 [&>span:first-child]:truncate'

const contentStyles =
  'z-[80] max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-violet-200/70 bg-white py-1 shadow-lg shadow-violet-200/30 dark:border-violet-500/30 dark:bg-slate-950 dark:shadow-violet-950/50'

const itemStyles =
  'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-800 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-violet-50 data-[highlighted]:text-violet-900 dark:text-violet-100 dark:data-[highlighted]:bg-violet-500/15 dark:data-[highlighted]:text-violet-50'

export function RecordsFilterSelect({
  value,
  onValueChange,
  options,
  ariaLabel,
  triggerMinWidthClass = 'min-w-[8.5rem]',
  resetValue = 'all',
}: RecordsFilterSelectProps) {
  const [open, setOpen] = useState(false)

  const clearIfReselect = useCallback(
    (optVal: string, e: React.SyntheticEvent) => {
      if (optVal !== value || optVal === resetValue) return false
      e.preventDefault()
      onValueChange(resetValue)
      setOpen(false)
      return true
    },
    [onValueChange, resetValue, value],
  )

  return (
    <Select.Root value={value} onValueChange={onValueChange} open={open} onOpenChange={setOpen}>
      <Select.Trigger className={`${triggerStyles} ${triggerMinWidthClass}`} aria-label={ariaLabel}>
        <Select.Value />
        <Select.Icon aria-hidden>
          <ChevronDown size={16} className="shrink-0 text-violet-600 opacity-80 dark:text-violet-400" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={6} collisionPadding={8} className={contentStyles}>
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={itemStyles}
                onPointerUp={(e) => {
                  if (e.pointerType === 'mouse') clearIfReselect(opt.value, e)
                }}
                onClick={(e) => clearIfReselect(opt.value, e)}
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                  <Check size={14} className="text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
                </Select.ItemIndicator>
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react'

export function Modal(props: ComponentPropsWithoutRef<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />
}

export function ModalTrigger(props: ComponentPropsWithoutRef<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />
}

export type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  overlayClassName?: string
}

const overlayBase =
  'radix-modal-overlay fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-[2px] dark:bg-black/55'

const contentBase =
  'radix-modal-content fixed left-1/2 top-1/2 z-[101] w-[min(100%-2rem,32rem)] max-h-[min(85vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-violet-200/80 bg-white p-6 shadow-xl shadow-violet-900/15 outline-none ring-violet-400/35 focus-visible:ring-2 dark:border-violet-500/25 dark:bg-slate-950 dark:shadow-black/40 dark:ring-violet-500/30'

export const ModalContent = forwardRef<ComponentRef<typeof Dialog.Content>, ModalContentProps>(
  function ModalContent({ className = '', overlayClassName = '', children, ...props }, ref) {
    return (
      <Dialog.Portal>
        <Dialog.Overlay
          className={overlayClassName ? `${overlayBase} ${overlayClassName}` : overlayBase}
        />
        <Dialog.Content ref={ref} className={className ? `${contentBase} ${className}` : contentBase} {...props}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    )
  },
)

export const ModalTitle = forwardRef<ComponentRef<typeof Dialog.Title>, ComponentPropsWithoutRef<typeof Dialog.Title>>(
  function ModalTitle({ className = '', ...props }, ref) {
    const base = 'text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-violet-100'
    return <Dialog.Title ref={ref} className={className ? `${base} ${className}` : base} {...props} />
  },
)

export const ModalDescription = forwardRef<
  ComponentRef<typeof Dialog.Description>,
  ComponentPropsWithoutRef<typeof Dialog.Description>
>(function ModalDescription({ className = '', ...props }, ref) {
  const base = 'text-sm text-violet-700/85 dark:text-violet-300/80'
  return (
    <Dialog.Description ref={ref} className={className ? `${base} ${className}` : base} {...props} />
  )
})

export const ModalClose = forwardRef<ComponentRef<typeof Dialog.Close>, ComponentPropsWithoutRef<typeof Dialog.Close>>(
  function ModalClose({ className = '', children, ...props }, ref) {
    const base =
      'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-violet-600 outline-none ring-violet-400/35 transition hover:border-violet-200/80 hover:bg-violet-50 focus-visible:ring-2 dark:text-violet-300 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/15 dark:ring-violet-500/30'
    return (
      <Dialog.Close
        ref={ref}
        type="button"
        aria-label="Close dialog"
        className={className ? `${base} ${className}` : base}
        {...props}
      >
        {children ?? <X className="size-4" strokeWidth={2} aria-hidden />}
      </Dialog.Close>
    )
  },
)

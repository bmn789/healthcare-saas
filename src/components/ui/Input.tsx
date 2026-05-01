import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react'

/** Default field styles (records toolbar pattern). Icon-leading search inputs: add `className="!pl-10"`. */
const inputClassName =
  'w-full rounded-lg border border-violet-200/80 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-inner outline-none ring-violet-400/30 transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 dark:border-violet-500/30 dark:bg-slate-900 dark:text-violet-100 dark:placeholder:text-violet-500/60 dark:focus:border-violet-400'

export type InputProps = ComponentPropsWithoutRef<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={className ? `${inputClassName} ${className}` : inputClassName}
      {...props}
    />
  )
})

export type PasswordInputProps = Omit<InputProps, 'type'>

/** Password field with violet theme styling and a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false)

    return (
      <div className={className ? `relative ${className}` : 'relative'}>
        <Input
          ref={ref}
          {...props}
          type={visible ? 'text' : 'password'}
          className="!pr-10"
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none hover:bg-violet-100/80 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-400/50 dark:text-violet-400/80 dark:hover:bg-violet-500/15 dark:hover:text-violet-200"
        >
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    )
  },
)

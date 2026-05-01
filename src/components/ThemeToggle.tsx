import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export const ThemeToggle = () => {
  const resolved = useThemeStore((s) => s.resolved)
  const toggle = useThemeStore((s) => s.toggle)

  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      onClick={() => toggle()}
      className="rounded-md border border-violet-200/70 bg-white p-2 text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-slate-950 dark:text-violet-200 dark:hover:bg-violet-500/20"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

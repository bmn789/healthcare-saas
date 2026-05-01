import {
  type ReactNode,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

/** Skeleton surface used above the fold placeholders and Suspense fallbacks. */
export const ANALYTICS_CHART_SCRIM =
  'rounded-lg border border-violet-200/50 bg-white/70 shadow-sm shadow-violet-200/15 dark:border-violet-500/15 dark:bg-slate-950/80 dark:shadow-violet-900/20'

type DeferredVisibleProps = {
  /** Shown until the sentinel intersects — should reserve layout height so the observer fires on scroll. */
  placeholder: ReactNode
  /**
   * Expands when to start loading relative to the viewport (e.g. prefetch slightly below the fold).
   * Format is Intersection Observer `rootMargin`.
   */
  rootMargin?: string
  /**
   * When set, after the lazy child mounts (chunk loaded), keep showing `placeholder` until this many
   * milliseconds have passed since the viewport intersection (min loading feedback). Pair with Suspense-only children — this component wraps Suspense internally.
   */
  minRevealAfterLoadMs?: number
  children: ReactNode
}

type RevealState = {
  active: boolean
  intersectAtMs: number | null
}

function MinRevealAfterIntersect({
  intersectAtMs,
  delayMs,
  hold,
  children,
}: {
  intersectAtMs: number
  delayMs: number
  hold: ReactNode
  children: ReactNode
}) {
  const [showChart, setShowChart] = useState(false)

  useLayoutEffect(() => {
    const elapsed = Date.now() - intersectAtMs
    const wait = Math.max(0, delayMs - elapsed)
    const id = window.setTimeout(() => setShowChart(true), wait)
    return () => window.clearTimeout(id)
  }, [intersectAtMs, delayMs])

  return showChart ? children : hold
}

/**
 * Mounts children only after the sentinel enters (or nearly enters) the viewport.
 * Pair with React.lazy chart modules so unseen charts never fetch JS or Recharts subgraphs early.
 */
export function DeferredVisible({
  placeholder,
  rootMargin = '140px 0px',
  minRevealAfterLoadMs,
  children,
}: DeferredVisibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ active, intersectAtMs }, setReveal] = useState<RevealState>({
    active: false,
    intersectAtMs: null,
  })

  useEffect(() => {
    if (active) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setReveal({ active: true, intersectAtMs: Date.now() })
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReveal({ active: true, intersectAtMs: Date.now() })
          obs.disconnect()
        }
      },
      { root: null, rootMargin, threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [active, rootMargin])

  if (!active) {
    return <div ref={ref}>{placeholder}</div>
  }

  if (
    typeof minRevealAfterLoadMs === 'number' &&
    intersectAtMs != null &&
    minRevealAfterLoadMs >= 0
  ) {
    return (
      <div ref={ref}>
        <Suspense fallback={placeholder}>
          <MinRevealAfterIntersect
            intersectAtMs={intersectAtMs}
            delayMs={minRevealAfterLoadMs}
            hold={placeholder}
          >
            {children}
          </MinRevealAfterIntersect>
        </Suspense>
      </div>
    )
  }

  return <div ref={ref}>{children}</div>
}

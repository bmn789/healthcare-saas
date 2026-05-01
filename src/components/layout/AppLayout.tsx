import { useEffect, useMemo, useRef, useState, type TransitionEvent } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  Users,
  X,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle'
import { Input } from '../ui/Input'
import { Tooltip } from '../ui/Tooltip'
import { useAuthStore } from '../../store/authStore'

/**
 * Active nav (light + dark): match ViewToggle selected chip —
 * light: violet-100/80, violet-800; dark: violet-500/20, violet-200.
 */
const navActiveRailGradient =
  'bg-violet-100/80 text-violet-800 shadow-sm shadow-violet-200/40 dark:bg-violet-500/20 dark:text-violet-200 dark:shadow-sm dark:shadow-violet-950/50'

const navSubActiveGradient =
  'bg-violet-100/80 text-violet-800 shadow-sm shadow-violet-200/35 dark:bg-violet-500/20 dark:text-violet-200 dark:shadow-sm dark:shadow-violet-950/40'

const navActiveLeftBorder = 'border-l-4 border-l-violet-600 dark:border-l-violet-400'

const navSubActiveLeftBorder = 'border-l-[3px] border-l-violet-600 dark:border-l-violet-400'

const getNavItemClass =
  (sidebarCollapsed: boolean) =>
  ({ isActive }: { isActive: boolean }) =>
    `flex min-h-[2.75rem] items-center rounded-lg font-medium transition ${
      sidebarCollapsed
        ? isActive
          ? `justify-center ${navActiveLeftBorder} px-1.5`
          : 'justify-center px-2'
        : isActive
          ? `gap-3 ${navActiveLeftBorder} py-3 pl-3 pr-4 text-base`
          : 'gap-3 px-4 py-3 text-base'
    } ${isActive ? navActiveRailGradient : 'text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-300 dark:hover:bg-violet-500/15 dark:hover:text-violet-200'}`

const getNavSubItemClass =
  ({ isActive }: { isActive: boolean }) =>
    `flex min-h-[2.25rem] w-full items-center gap-2 rounded-lg py-2.5 text-[0.9375rem] font-medium transition ${
      isActive
        ? `${navSubActiveLeftBorder} pl-2.5 pr-3 ${navSubActiveGradient}`
        : 'px-3 text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-300 dark:hover:bg-violet-500/15 dark:hover:text-violet-200'
    }`

const DASHBOARD_SUB = [
  { to: '/dashboard/view', label: 'View', Icon: Home },
  { to: '/dashboard/customization', label: 'Customization', Icon: Activity },
] as const

type DashboardSubItem = (typeof DASHBOARD_SUB)[number]

/** Dashboard home and nested routes such as customization. */
function isDashboardRoute(pathname: string) {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/')
}

function navLabelMatches(query: string, label: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return label.toLowerCase().includes(q)
}

function getNavFilter(query: string) {
  const trimmed = query.trim()
  const showAll = trimmed === ''
  const dashboardParentMatch = navLabelMatches(trimmed, 'Dashboard')
  const filteredDashboardSub: DashboardSubItem[] = showAll
    ? [...DASHBOARD_SUB]
    : DASHBOARD_SUB.filter(
        (sub) => dashboardParentMatch || navLabelMatches(trimmed, sub.label),
      )
  const dashboardSectionVisible =
    showAll || dashboardParentMatch || filteredDashboardSub.length > 0
  const notificationsVisible =
    showAll ||
    navLabelMatches(trimmed, 'Notifications') ||
    navLabelMatches(trimmed, 'Notification')
  const analyticsVisible = showAll || navLabelMatches(trimmed, 'Analytics')
  const patientsVisible =
    showAll ||
    navLabelMatches(trimmed, 'Patient Details') ||
    navLabelMatches(trimmed, 'patient') ||
    navLabelMatches(trimmed, 'patients')

  return {
    showAll,
    trimmed,
    filteredDashboardSub,
    dashboardSectionVisible,
    notificationsVisible,
    analyticsVisible,
    patientsVisible,
  }
}

function DashboardCollapsibleSection({
  pathname,
  expanded,
  onToggleExpand,
  onNavigateSubLink,
  iconSize,
  subItems = DASHBOARD_SUB,
}: {
  pathname: string
  expanded: boolean
  onToggleExpand: () => void
  onNavigateSubLink?: () => void
  iconSize: number
  subItems?: readonly DashboardSubItem[]
}) {
  const active = isDashboardRoute(pathname)
  const rowClasses = active
    ? `${navActiveLeftBorder} ${navActiveRailGradient}`
    : 'text-slate-700 hover:bg-violet-50 hover:text-violet-800 dark:text-slate-300 dark:hover:bg-violet-500/15 dark:hover:text-violet-200'

  const chevronSize = Math.max(18, iconSize - 2)

  return (
    <div className="flex flex-col gap-px">
      <div
        className={`flex min-h-[2.75rem] w-full items-stretch overflow-hidden rounded-lg text-base font-medium transition ${rowClasses}`}
      >
        <NavLink
          to="/dashboard/view"
          onClick={() => onToggleExpand()}
          className={`flex min-w-0 flex-1 items-center gap-3 py-3 ${active ? 'pl-3 pr-2' : 'px-4'}`}
        >
          <LayoutDashboard size={iconSize} className="shrink-0" aria-hidden />
          <span className="truncate">Dashboard</span>
        </NavLink>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center px-2.5 hover:bg-black/[0.06] dark:hover:bg-white/10"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse Dashboard pages' : 'Expand Dashboard pages'}
          onClick={onToggleExpand}
        >
          <ChevronDown
            size={chevronSize}
            className={`shrink-0 opacity-80 transition-transform duration-200 ease-out hover:opacity-100 ${
              expanded ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden
          />
        </button>
      </div>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div
          className={`min-h-0 pt-px transition-transform duration-200 ease-out ${
            expanded ? 'translate-y-0' : '-translate-y-1'
          }`}
        >
          <div className="relative ml-5 pl-4">
            <span
              className="pointer-events-none absolute bottom-2 left-[3px] top-2 w-px rounded-full bg-violet-200/90 dark:bg-violet-500/30"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute left-0 top-2 h-2 w-2 rounded-full border border-violet-300 bg-white dark:border-violet-500/50 dark:bg-slate-900"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-2 left-0 h-2 w-2 rounded-full border border-violet-300 bg-white dark:border-violet-500/50 dark:bg-slate-900"
              aria-hidden
            />
            <div className="flex min-h-0 flex-col gap-1 pt-1.5">
              {subItems.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => getNavSubItemClass({ isActive })}
                  onClick={onNavigateSubLink}
                >
                  <Icon size={16} className="shrink-0 opacity-70" aria-hidden />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function userInitials(email: string | null | undefined, displayName: string | null | undefined) {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
    }
    return parts[0]!.slice(0, 2).toUpperCase()
  }
  if (email) {
    const local = email.split('@')[0] ?? email
    return local.slice(0, 2).toUpperCase()
  }
  return '?'
}

type MobileDrawerState = { visible: boolean; open: boolean }

export const AppLayout = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const dashboardSectionActive = isDashboardRoute(pathname)

  const [dashboardExpanded, setDashboardExpanded] = useState(dashboardSectionActive)
  const [navSearch, setNavSearch] = useState('')

  const navFilter = useMemo(() => getNavFilter(navSearch), [navSearch])

  /*
   Expand dashboard on dashboard routes; collapse when leaving unless the user is
   filtering navigation (keep submenu open when a sub-route matches search).
   */
  useEffect(() => {
    if (dashboardSectionActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional route → UI sync
      setDashboardExpanded(true)
    } else if (!navSearch.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional route → UI sync
      setDashboardExpanded(false)
    }
  }, [dashboardSectionActive, navSearch])

  useEffect(() => {
    if (!navFilter.trimmed) return
    if (
      navFilter.dashboardSectionVisible &&
      navFilter.filteredDashboardSub.length > 0
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- search surfaced dashboard subs
      setDashboardExpanded(true)
    }
  }, [
    navFilter.trimmed,
    navFilter.dashboardSectionVisible,
    navFilter.filteredDashboardSub.length,
  ])
  const [mobileDrawer, setMobileDrawer] = useState<MobileDrawerState>({
    visible: false,
    open: false,
  })
  const mobileDrawerClosingRef = useRef(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const resetMobileDrawer = () => {
    mobileDrawerClosingRef.current = false
    setMobileDrawer({ visible: false, open: false })
  }

  const closeMobileDrawer = () => {
    mobileDrawerClosingRef.current = true
    setMobileDrawer((d) => (d.visible && d.open ? { visible: true, open: false } : d))
  }

  const toggleMobileDrawer = () => {
    setMobileDrawer((d) => {
      if (d.visible && d.open) {
        mobileDrawerClosingRef.current = true
        return { visible: true, open: false }
      }
      if (!d.visible) {
        mobileDrawerClosingRef.current = false
        return { visible: true, open: false }
      }
      return d
    })
  }

  const onMobileDrawerTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
    if (mobileDrawer.open) return

    if (mobileDrawerClosingRef.current) {
      mobileDrawerClosingRef.current = false
      setMobileDrawer({ visible: false, open: false })
    }
  }

  useEffect(() => {
    if (mobileDrawer.visible && !mobileDrawer.open && !mobileDrawerClosingRef.current) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setMobileDrawer((d) => (d.visible && !d.open ? { ...d, open: true } : d)),
        ),
      )
      return () => cancelAnimationFrame(id)
    }
  }, [mobileDrawer.visible, mobileDrawer.open])

  const handleLogout = async () => {
    await logout()
    resetMobileDrawer()
    navigate('/login')
  }

  const closeMobileMenu = () => closeMobileDrawer()

  /*
   Radix DropdownMenu.Item + Slot does not reliably merge NavLink's function `className`.
   Use pathname-based strings and data-[highlighted] for roving-focus styles.
  */
  const profileDropdownNavClass = (routeActive: boolean) =>
    `relative flex w-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-lg py-2 text-left text-sm no-underline outline-none transition-colors focus-visible:outline-none ${
      routeActive
        ? `px-3 font-medium ${navActiveRailGradient}`
        : 'px-3 text-slate-700 hover:bg-violet-50 hover:text-violet-800 data-[highlighted]:bg-violet-50 data-[highlighted]:text-violet-800 dark:text-slate-200 dark:hover:bg-violet-500/15 dark:hover:text-violet-200 dark:data-[highlighted]:bg-violet-500/15 dark:data-[highlighted]:text-violet-200'
    }`

  const profileDashboardRouteActive = isDashboardRoute(pathname)
  const profileAnalyticsRouteActive =
    pathname === '/analytics' || pathname.startsWith('/analytics/')
  const profilePatientsRouteActive =
    pathname === '/patients' || pathname.startsWith('/patients/')
  const profileNotificationsRouteActive =
    pathname === '/notifications' || pathname.startsWith('/notifications/')

  const noNavMatches =
    !navFilter.showAll &&
    !navFilter.dashboardSectionVisible &&
    !navFilter.notificationsVisible &&
    !navFilter.analyticsVisible &&
    !navFilter.patientsVisible

  /*
   Tailwind literals (JIT): row py-4; slab = viewport minus header (~4.625rem + py-4).
   Main: minimum slab height so short pages fill the screen.
   Sidebar: fixed slab + sticky + self-start — does not stretch with tall main / no empty stretched rail.
  */
  const shellMinH =
    'min-h-[calc(100svh-6.625rem-env(safe-area-inset-bottom,0px))]'
  const asideSlabH =
    'md:h-[calc(100svh-5.625rem-env(safe-area-inset-bottom,0px))]'

  return (
    <div className="flex min-h-svh flex-col bg-transparent">
      <header className="sticky top-0 z-40 shrink-0 border-b border-violet-200/60 bg-white/80 backdrop-blur-md dark:border-violet-500/20 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-none items-center justify-between px-4 py-3 2xl:max-w-[1600px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMobileDrawer}
              className="rounded-md border border-violet-200/70 p-2 text-violet-800 hover:bg-violet-100/70 dark:border-violet-500/30 dark:text-violet-200 dark:hover:bg-violet-500/20 md:hidden"
              aria-expanded={mobileDrawer.visible && mobileDrawer.open}
              aria-label={
                mobileDrawer.visible && mobileDrawer.open ? 'Close menu' : 'Open menu'
              }
            >
              {mobileDrawer.visible ? <X size={18} /> : <Menu size={18} />}
            </button>
            <p className="text-lg font-semibold text-slate-900 dark:text-violet-100">HealthCare</p>
            <p className="hidden text-xs text-violet-700/80 dark:text-violet-300/80 sm:block">
              B2B Healthcare Operations
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Tooltip content="Notifications" side="bottom">
              <Link
                to="/notifications"
                aria-label="Open notifications"
                className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/80 text-violet-700 outline-none ring-violet-500/40 transition hover:bg-violet-50 focus-visible:ring-2 dark:border-violet-500/30 dark:bg-slate-900/80 dark:text-violet-200 dark:hover:bg-violet-500/15 dark:focus-visible:ring-violet-400/50 ${
                  profileNotificationsRouteActive
                    ? 'border-violet-300 shadow-sm shadow-violet-200/40 dark:border-violet-500/50 dark:shadow-violet-900/30'
                    : 'border-violet-200/70'
                }`}
              >
                <Bell size={18} aria-hidden />
              </Link>
            </Tooltip>
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-violet-200/70 bg-white/80 py-1 pl-1 pr-2 text-slate-800 outline-none ring-violet-500/40 transition hover:bg-violet-50 focus-visible:ring-2 dark:border-violet-500/30 dark:bg-slate-900/80 dark:text-violet-100 dark:hover:bg-violet-500/15 dark:focus-visible:ring-violet-400/50 [&[data-state=open]>svg]:rotate-180"
                  aria-haspopup="menu"
                  aria-label="User profile menu"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-xs font-semibold text-violet-800 dark:bg-violet-500/25 dark:text-violet-200">
                    {userInitials(user?.email ?? null, user?.displayName ?? null)}
                  </span>
                  <span className="hidden max-w-[9rem] truncate text-left text-sm sm:block">
                    {user?.displayName?.trim() || user?.email || 'Account'}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-violet-600 transition-transform duration-200 dark:text-violet-300"
                    aria-hidden
                  />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={10}
                  align="end"
                  collisionPadding={16}
                  className="profile-dropdown-content z-[100] w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-violet-200/70 bg-white/95 py-1 shadow-xl shadow-violet-200/30 backdrop-blur-sm dark:border-violet-500/30 dark:bg-slate-950/95 dark:shadow-violet-900/10"
                >
                  <div className="border-b border-violet-100 px-3 py-3 dark:border-violet-500/20">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800 dark:bg-violet-500/25 dark:text-violet-200">
                        {userInitials(user?.email ?? null, user?.displayName ?? null)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-violet-100">
                          {user?.displayName?.trim() || 'Admin'}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-violet-300/80">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu.Group className="space-y-px px-1 py-1">
                    <DropdownMenu.Item asChild>
                      <NavLink to="/dashboard/view" className={profileDropdownNavClass(profileDashboardRouteActive)}>
                        <LayoutDashboard size={16} className="shrink-0 opacity-80" aria-hidden />
                        Dashboard
                      </NavLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NavLink to="/analytics" className={profileDropdownNavClass(profileAnalyticsRouteActive)}>
                        <BarChart3 size={16} className="shrink-0 opacity-80" aria-hidden />
                        Analytics
                      </NavLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NavLink to="/patients" className={profileDropdownNavClass(profilePatientsRouteActive)}>
                        <Users size={16} className="shrink-0 opacity-80" aria-hidden />
                        Patient Details
                      </NavLink>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <NavLink
                        to="/notifications"
                        className={profileDropdownNavClass(profileNotificationsRouteActive)}
                      >
                        <Bell size={16} className="shrink-0 opacity-80" aria-hidden />
                        Notifications
                      </NavLink>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>

                  <DropdownMenu.Separator className="my-1 h-px bg-violet-100 dark:bg-violet-500/20" />

                  <DropdownMenu.Item
                    className="relative mx-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-700 outline-none transition-colors hover:bg-rose-50 focus-visible:outline-none data-[highlighted]:bg-rose-50 data-[highlighted]:text-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:data-[highlighted]:bg-rose-950/50 dark:data-[highlighted]:text-rose-300"
                    onSelect={() => {
                      void handleLogout()
                    }}
                  >
                    <LogOut size={16} aria-hidden />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>

      {mobileDrawer.visible ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ease-out dark:bg-black/70 ${
              mobileDrawer.open ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <aside
            className={`absolute left-0 top-0 flex h-full max-h-[100dvh] w-72 flex-col overflow-hidden border-r border-violet-200/50 bg-white/95 p-4 shadow-xl shadow-violet-200/30 backdrop-blur-sm transition-transform duration-300 ease-out dark:border-violet-500/20 dark:bg-slate-950/95 dark:text-slate-100 dark:shadow-violet-900/30 ${
              mobileDrawer.open ? 'translate-x-0' : '-translate-x-full'
            }`}
            onTransitionEnd={onMobileDrawerTransitionEnd}
            aria-hidden={!mobileDrawer.open}
          >
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-violet-100">Navigation</p>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-md p-1 text-violet-700 hover:bg-violet-100 dark:text-violet-300 dark:hover:bg-violet-500/20"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-3 min-w-0 shrink-0">
              <label htmlFor="layout-nav-search-mobile" className="sr-only">
                Search navigation
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600 opacity-70 dark:text-violet-400"
                aria-hidden
              />
              <Input
                id="layout-nav-search-mobile"
                type="search"
                autoComplete="off"
                placeholder="Search"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="!pl-10"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-1">
                {navFilter.dashboardSectionVisible ? (
                  <DashboardCollapsibleSection
                    pathname={pathname}
                    expanded={dashboardExpanded}
                    onToggleExpand={() => setDashboardExpanded((open) => !open)}
                    onNavigateSubLink={closeMobileMenu}
                    iconSize={20}
                    subItems={navFilter.filteredDashboardSub}
                  />
                ) : null}
                {navFilter.notificationsVisible ? (
                  <NavLink className={getNavItemClass(false)} to="/notifications" onClick={closeMobileMenu}>
                    <Bell size={20} />
                    Notifications
                  </NavLink>
                ) : null}
                {navFilter.analyticsVisible ? (
                  <NavLink className={getNavItemClass(false)} to="/analytics" onClick={closeMobileMenu}>
                    <BarChart3 size={20} />
                    Analytics
                  </NavLink>
                ) : null}
                {navFilter.patientsVisible ? (
                  <NavLink className={getNavItemClass(false)} to="/patients" onClick={closeMobileMenu}>
                    <Users size={20} />
                    Patient Details
                  </NavLink>
                ) : null}
                {navSearch.trim() && noNavMatches ? (
                  <p className="rounded-lg border border-dashed border-violet-300/80 bg-violet-50/50 px-3 py-3 text-center text-xs text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                    No pages match your search. Try another keyword.
                  </p>
                ) : null}
              </nav>
            </div>

            <div className="mt-4 shrink-0 border-t border-violet-200/60 pt-4 dark:border-violet-500/20">
              <p className="mb-2 flex items-center gap-2 text-xs text-violet-700/80 dark:text-violet-300/80">
                <User size={14} />
                Signed in user
              </p>
              <p className="mb-3 rounded bg-violet-100/70 px-2 py-1 text-xs text-violet-800 dark:bg-violet-500/20 dark:text-violet-200">
                {user?.email}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm shadow-violet-400/30 hover:from-violet-500 hover:to-indigo-500 dark:shadow-violet-900/50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-none gap-4 px-4 py-4 2xl:max-w-[1600px]">
        <aside
          className={`hidden min-h-0 shrink-0 flex-col overflow-x-hidden rounded-lg border border-violet-200/60 bg-white/90 px-2 pb-1 pt-2 shadow-sm shadow-violet-200/30 backdrop-blur-sm transition-[width] duration-200 ease-out dark:border-violet-500/20 dark:bg-slate-950/70 dark:shadow-violet-900/30 md:sticky md:top-[4.625rem] md:z-30 md:flex md:self-start md:overflow-hidden ${asideSlabH} ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div
            className={`mb-2 flex shrink-0 border-b border-violet-200/70 pb-2 dark:border-violet-500/20 ${
              sidebarCollapsed ? 'justify-center' : 'justify-end'
            }`}
          >
            <Tooltip content={sidebarCollapsed ? 'Open menu' : 'Close menu'} side="right">
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/70 text-violet-700 transition-colors duration-200 hover:bg-violet-100 hover:text-violet-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:bg-slate-900/60 dark:text-violet-300 dark:hover:bg-violet-500/20 dark:hover:text-violet-100 dark:focus-visible:ring-violet-400/70 dark:focus-visible:ring-offset-slate-950"
                aria-expanded={!sidebarCollapsed}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronsRight size={22} /> : <ChevronsLeft size={22} />}
              </button>
            </Tooltip>
          </div>
          {!sidebarCollapsed ? (
            <div className="relative mb-2 min-w-0 shrink-0 px-0.5">
              <label htmlFor="layout-nav-search-desktop" className="sr-only">
                Search navigation
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600 opacity-70 dark:text-violet-400"
                aria-hidden
              />
              <Input
                id="layout-nav-search-desktop"
                type="search"
                autoComplete="off"
                placeholder="Search"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="!pl-10"
              />
            </div>
          ) : null}
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
            {sidebarCollapsed ? (
              <NavLink
                className={getNavItemClass(true)({
                  isActive: dashboardSectionActive,
                })}
                to="/dashboard/view"
                title="Dashboard"
              >
                <LayoutDashboard size={22} className="shrink-0" aria-hidden />
                <span className="sr-only">Dashboard</span>
              </NavLink>
            ) : navFilter.dashboardSectionVisible ? (
              <DashboardCollapsibleSection
                pathname={pathname}
                expanded={dashboardExpanded}
                onToggleExpand={() => setDashboardExpanded((open) => !open)}
                iconSize={22}
                subItems={navFilter.filteredDashboardSub}
              />
            ) : null}
            {sidebarCollapsed || navFilter.notificationsVisible ? (
              <NavLink
                className={getNavItemClass(sidebarCollapsed)}
                to="/notifications"
                title={sidebarCollapsed ? 'Notifications' : undefined}
              >
                <Bell size={22} className="shrink-0" aria-hidden />
                <span className={sidebarCollapsed ? 'sr-only' : ''}>Notifications</span>
              </NavLink>
            ) : null}
            {sidebarCollapsed || navFilter.analyticsVisible ? (
              <NavLink
                className={getNavItemClass(sidebarCollapsed)}
                to="/analytics"
                title={sidebarCollapsed ? 'Analytics' : undefined}
              >
                <BarChart3 size={22} className="shrink-0" aria-hidden />
                <span className={sidebarCollapsed ? 'sr-only' : ''}>Analytics</span>
              </NavLink>
            ) : null}
            {sidebarCollapsed || navFilter.patientsVisible ? (
              <NavLink
                className={getNavItemClass(sidebarCollapsed)}
                to="/patients"
                title={sidebarCollapsed ? 'Patient Details' : undefined}
              >
                <Users size={22} className="shrink-0" aria-hidden />
                <span className={sidebarCollapsed ? 'sr-only' : ''}>Patient Details</span>
              </NavLink>
            ) : null}
            {!sidebarCollapsed && navSearch.trim() && noNavMatches ? (
              <p className="rounded-lg border border-dashed border-violet-300/80 bg-violet-50/50 px-2 py-3 text-center text-xs text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
                No pages match your search. Try another keyword.
              </p>
            ) : null}
          </nav>
        </aside>

        <main
          id="app-main-scroll"
          className={`w-full min-w-0 flex-1 overflow-x-hidden rounded-lg border border-violet-200/60 bg-white/90 p-4 shadow-sm shadow-violet-200/20 backdrop-blur-sm dark:border-violet-500/20 dark:bg-slate-950/70 dark:shadow-violet-900/30 sm:p-6 ${shellMinH}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

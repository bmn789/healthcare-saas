import { useState } from 'react'
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-100 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export const AppLayout = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <p className="text-lg font-semibold text-slate-900">CareFlow SaaS</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              B2B Healthcare Operations
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-20 bg-slate-900/30 md:hidden" onClick={closeMobileMenu}>
          <aside
            className="h-full w-72 bg-white p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-900">Navigation</p>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-1">
              <NavLink className={navItemClass} to="/dashboard" onClick={closeMobileMenu}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink className={navItemClass} to="/analytics" onClick={closeMobileMenu}>
                <BarChart3 size={16} />
                Analytics
              </NavLink>
              <NavLink className={navItemClass} to="/patients" onClick={closeMobileMenu}>
                <Users size={16} />
                Patient Details
              </NavLink>
            </nav>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                <User size={14} />
                Signed in user
              </p>
              <p className="mb-3 rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                {user?.email}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4">
        <aside className="hidden w-56 rounded-lg border border-slate-200 bg-white p-3 md:block">
          <nav className="space-y-1 flex flex-col">
            <NavLink className={navItemClass} to="/dashboard">
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink className={navItemClass} to="/analytics">
              <BarChart3 size={16} />
              Analytics
            </NavLink>
            <NavLink className={navItemClass} to="/patients">
              <Users size={16} />
              Patient Details
            </NavLink>
          </nav>
        </aside>

        <main className="min-h-[80vh] w-full flex-1 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

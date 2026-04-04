import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, CreditCard, BarChart2,
  Tag, TrendingUp, LogOut, Menu, X, Shield
} from 'lucide-react'
import clsx from 'clsx'

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview',  href: '/admin' },
  { icon: Users,           label: 'Users',     href: '/admin/users' },
  { icon: CreditCard,      label: 'Payments',  href: '/admin/payments' },
  { icon: BarChart2,       label: 'Plans',     href: '/admin/plans' },
  { icon: Tag,             label: 'Coupons',   href: '/admin/coupons' },
]

export default function AdminLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href) => location.pathname === href

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-40 w-56 flex flex-col bg-slate-900/70 border-r border-white/5 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-red-500/30 flex items-center justify-center">
            <img src="https://4kwallpapers.com/images/walls/thumbs_2t/13781.png" alt="TradeBoot Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-white">TradeBoot</p>
            <p className="text-[10px] text-red-400 font-mono">ADMIN PANEL</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {ADMIN_NAV.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive(item.href)
                  ? 'bg-red-500/10 text-red-300 border border-red-500/10'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <item.icon size={15} className={isActive(item.href) ? 'text-red-400' : 'text-slate-500'} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-red-400/20 flex items-center justify-center text-xs font-bold text-red-400">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-red-400">Administrator</p>
            </div>
            <button onClick={logout} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-4 h-14 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl shrink-0">
          <button className="md:hidden p-1.5 text-slate-400" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <TrendingUp size={12} /> Back to App
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

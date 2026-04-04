import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../context/SubscriptionContext'
import { Progress, Badge } from '../ui'
import {
  LayoutDashboard, TrendingUp, LineChart, BarChart2,
  Briefcase, CreditCard, User, Settings, ChevronLeft,
  ChevronRight, Zap, Crown, Shield, BookOpen
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  {
    group: 'Trading',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard' },
      { icon: TrendingUp,      label: 'Predictions',  href: '/dashboard/prediction' },
      { icon: LineChart,       label: 'Stock Details', href: '/dashboard/stocks' },
      { icon: BarChart2,       label: 'Indicators',   href: '/dashboard/indicators' },
    ]
  },
  {
    group: 'Portfolio',
    items: [
      { icon: Briefcase, label: 'My Portfolio', href: '/portfolio' },
      { icon: BookOpen,  label: 'Watchlist',    href: '/watchlist' },
    ]
  },
  {
    group: 'Account',
    items: [
      { icon: CreditCard, label: 'Subscription', href: '/pricing' },
      { icon: User,       label: 'Profile',      href: '/profile' },
      { icon: Settings,   label: 'Settings',     href: '/settings' },
    ]
  }
]

const ADMIN_ITEMS = [
  { icon: Shield,    label: 'Admin Panel', href: '/admin' },
]

export default function Sidebar({ className = '' }) {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const { plan, usage, limits, canPredict } = useSubscription()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href) => location.pathname === href

  const planBadge = { free: null, basic: 'blue', premium: 'amber' }

  return (
    <aside className={clsx(
      'flex flex-col bg-slate-900/40 border-r border-white/5 transition-all duration-300',
      collapsed ? 'w-16' : 'w-60',
      className
    )}>
      {/* Collapse toggle */}
      <div className="flex items-center justify-end px-3 py-3 border-b border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-hide px-2">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                    collapsed ? 'justify-center' : '',
                    isActive(item.href)
                      ? 'bg-brand-400/10 text-brand-300 border border-brand-400/10'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  <item.icon
                    size={16}
                    className={clsx(
                      'shrink-0 transition-colors',
                      isActive(item.href) ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Admin items */}
        {isAdmin && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Admin</p>
            )}
            {ADMIN_ITEMS.map(item => (
              <Link
                key={item.href}
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  collapsed ? 'justify-center' : '',
                  isActive(item.href)
                    ? 'bg-red-400/10 text-red-300'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <item.icon size={16} className="shrink-0 text-red-400" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom: usage + plan */}
      {!collapsed && (
        <div className="p-3 border-t border-white/5 space-y-3">
          {/* Usage */}
          {limits.predictions !== -1 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Zap size={11} className="text-brand-400" /> Daily Predictions
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {usage.predictions}/{limits.predictions}
                </span>
              </div>
              <Progress value={usage.predictions} max={limits.predictions} />
              {!canPredict && (
                <p className="text-[10px] text-amber-400">Limit reached. Upgrade to continue.</p>
              )}
            </div>
          )}

          {/* Plan */}
          <Link to="/pricing" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className={clsx(
              'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
              plan === 'premium' ? 'bg-amber-400/10' : plan === 'basic' ? 'bg-blue-400/10' : 'bg-slate-700/50'
            )}>
              {plan === 'premium' ? (
                <Crown size={13} className="text-amber-400" />
              ) : plan === 'basic' ? (
                <Zap size={13} className="text-blue-400" />
              ) : (
                <User size={13} className="text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-300 capitalize">{plan} Plan</p>
              {plan === 'free' && (
                <p className="text-[10px] text-brand-400 group-hover:underline">Upgrade →</p>
              )}
            </div>
          </Link>
        </div>
      )}
    </aside>
  )
}

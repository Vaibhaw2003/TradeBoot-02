import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../context/SubscriptionContext'
import { Badge, Button } from '../ui'
import {
  TrendingUp, Bell, ChevronDown, Menu, X,
  User, Settings, LogOut, LayoutDashboard, Crown
} from 'lucide-react'
import clsx from 'clsx'

export default function Navbar({ variant = 'default' }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { plan } = useSubscription()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Predictions', href: '/dashboard/prediction' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Pricing', href: '/pricing' },
  ]

  const publicLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/#about' },
  ]

  const links = isAuthenticated ? navLinks : publicLinks
  const isActive = (href) => location.pathname === href

  const planColors = { free: 'default', basic: 'blue', premium: 'amber' }

  return (
    <header className={clsx(
      'sticky top-0 z-40 transition-all duration-300',
      variant === 'transparent'
        ? 'bg-transparent'
        : 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
    )}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-400/30 group-hover:border-brand-400 flex items-center justify-center shadow-glow-sm transition-all">
              <img src="https://4kwallpapers.com/images/walls/thumbs_2t/13781.png" alt="TradeBoot Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-white text-lg leading-none">
              Trade<span className="text-brand-400">Boot</span>
              <span className="text-xs font-mono text-slate-500 ml-0.5">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive(link.href)
                    ? 'text-brand-300 bg-brand-400/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-400" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-400/20 border border-brand-400/30 flex items-center justify-center text-brand-400 text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDown size={14} className={clsx(
                      'text-slate-500 transition-transform duration-200',
                      userMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl shadow-xl border border-white/10 z-20 py-1">
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          <Badge variant={planColors[plan]} className="mt-1.5">
                            {plan === 'premium' && <Crown size={10} />}
                            {plan.toUpperCase()}
                          </Badge>
                        </div>

                        {[
                          { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
                          { icon: User, label: 'Profile', href: '/profile' },
                          { icon: Settings, label: 'Settings', href: '/settings' },
                        ].map(item => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <item.icon size={15} />
                            {item.label}
                          </Link>
                        ))}

                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); navigate('/'); setUserMenuOpen(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')} className="hidden sm:flex">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1 animate-slide-up">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'flex px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-brand-300 bg-brand-400/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-white/5 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate('/login'); setMobileOpen(false) }}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => { navigate('/register'); setMobileOpen(false) }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

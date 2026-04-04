import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { Badge, SkeletonCard } from '../../components/ui'
import {
  Users, CreditCard, TrendingUp, DollarSign,
  BarChart2, ArrowUpRight, Activity, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { usePageTitle } from '../../hooks'

// ─── Mock admin data ──────────────────────────────────────────────────────────
const MOCK_STATS = {
  totalUsers: 1284,
  activeUsers: 847,
  totalRevenue: 312450,
  monthlyRevenue: 48900,
  totalPredictions: 98432,
  conversionRate: 4.2,
}

const REVENUE_CHART = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: 20000 + Math.random() * 40000,
  users: 80 + Math.random() * 150,
}))

const USER_GROWTH = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  users: 900 + i * 12 + Math.random() * 30,
}))

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [loading, setLoading] = useState(false)
  usePageTitle('Admin Dashboard')

  const STAT_CARDS = [
    { label: 'Total Users',       value: stats.totalUsers.toLocaleString(),   icon: Users,      color: 'text-blue-400',   bg: 'bg-blue-400/10',    change: '+12%' },
    { label: 'Monthly Revenue',   value: `₹${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-brand-400',  bg: 'bg-brand-400/10',   change: '+8%' },
    { label: 'Active Users',      value: stats.activeUsers.toLocaleString(),   icon: Activity,   color: 'text-emerald-400',bg: 'bg-emerald-400/10', change: '+5%' },
    { label: 'Predictions Today', value: (Math.floor(Math.random() * 3000 + 500)).toLocaleString(), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', change: '+22%' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Platform overview and analytics</p>
        </div>
        <Badge variant="red">Admin Panel</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon size={17} className={card.color} />
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={12} />{card.change}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="font-mono font-bold text-xl text-white mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display font-semibold text-white text-sm">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_CHART} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f5c8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00f5c8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#0d1520', border: '1px solid rgba(0,245,200,0.15)', borderRadius: 8 }}
                labelStyle={{ color: '#64748b' }}
                formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00f5c8" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User growth */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display font-semibold text-white text-sm">User Growth (30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={USER_GROWTH} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1520', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8 }}
                formatter={v => [Math.round(v), 'Total Users']}
              />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Manage Users',    href: '/admin/users',    icon: Users,      color: 'text-blue-400' },
          { label: 'View Payments',   href: '/admin/payments', icon: CreditCard, color: 'text-emerald-400' },
          { label: 'Manage Plans',    href: '/admin/plans',    icon: BarChart2,  color: 'text-brand-400' },
          { label: 'Manage Coupons',  href: '/admin/coupons',  icon: Zap,        color: 'text-amber-400' },
        ].map(item => (
          <Link key={item.href} to={item.href} className="card p-4 flex items-center gap-3 hover:border-brand-400/20 hover:-translate-y-0.5 transition-all duration-200">
            <item.icon size={18} className={item.color} />
            <span className="text-sm font-medium text-white">{item.label}</span>
            <ArrowUpRight size={14} className="text-slate-500 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  )
}

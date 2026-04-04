import { useState } from 'react'
import { Badge, Button, Input, Modal } from '../../components/ui'
import { Search, UserX, Shield, Eye, Edit2, Trash2, Crown, Zap, User } from 'lucide-react'
import { usePageTitle } from '../../hooks'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['Rahul Mehta', 'Priya Sharma', 'Ankit Gupta', 'Sneha Patel', 'Vikram Singh'][i % 5] + ` #${i+1}`,
  email: `user${i+1}@example.com`,
  plan: ['free','free','basic','premium','basic'][i % 5],
  status: i % 7 === 0 ? 'suspended' : 'active',
  predictions: Math.floor(Math.random() * 500),
  joined: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
}))

const planMeta = {
  free:    { icon: User,  color: 'text-slate-400', badge: 'default' },
  basic:   { icon: Zap,   color: 'text-blue-400',  badge: 'blue' },
  premium: { icon: Crown, color: 'text-amber-400', badge: 'amber' },
}

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [viewUser, setViewUser] = useState(null)
  usePageTitle('Admin — Users')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'all' || u.plan === planFilter
    return matchSearch && matchPlan
  })

  const toggleSuspend = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ))
    toast.success('User status updated')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Users</h1>
        <Badge variant="default">{users.length} total</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50 text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1">
          {['all', 'free', 'basic', 'premium'].map(p => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium capitalize transition-all',
                planFilter === p ? 'bg-brand-400 text-slate-900' : 'text-slate-400 hover:text-white'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Email', 'Plan', 'Predictions', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const pm = planMeta[u.plan]
                return (
                  <tr key={u.id} className="border-b border-white/[0.03] table-row-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-400/20 flex items-center justify-center text-xs font-bold text-brand-400">
                          {u.name[0]}
                        </div>
                        <span className="text-white font-medium truncate max-w-[120px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={pm.badge} className="capitalize">
                        <pm.icon size={10} className={pm.color} /> {u.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{u.predictions}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.joined}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.status === 'active' ? 'green' : 'red'}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewUser(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => toggleSuspend(u.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-400/5 transition-colors"
                          title={u.status === 'active' ? 'Suspend' : 'Activate'}
                        >
                          <UserX size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No users found</div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="sm">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-400/20 flex items-center justify-center text-brand-400 text-xl font-bold">
                {viewUser.name[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{viewUser.name}</p>
                <p className="text-xs text-slate-400 font-mono">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Plan',        value: viewUser.plan },
                { label: 'Status',      value: viewUser.status },
                { label: 'Predictions', value: viewUser.predictions },
                { label: 'Joined',      value: viewUser.joined },
              ].map(item => (
                <div key={item.label} className="bg-slate-800/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-medium text-white capitalize mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <Button variant="danger" size="sm" onClick={() => { toggleSuspend(viewUser.id); setViewUser(null) }} className="w-full justify-center">
              {viewUser.status === 'active' ? 'Suspend User' : 'Activate User'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

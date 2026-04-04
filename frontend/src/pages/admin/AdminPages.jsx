import { useState } from 'react'
import { Badge, Button, Input, Modal } from '../../components/ui'
import { Search, CheckCircle, XCircle, Eye, Download } from 'lucide-react'
import { usePageTitle } from '../../hooks'
import clsx from 'clsx'

const MOCK_PAYMENTS = Array.from({ length: 15 }, (_, i) => ({
  id: `TRB-${100000 + i}`,
  user: ['Rahul Mehta', 'Priya Sharma', 'Ankit Gupta', 'Sneha Patel'][i % 4],
  email: `user${i+1}@example.com`,
  plan: ['basic', 'premium', 'basic', 'premium'][i % 4],
  amount: [499, 1499][i % 2],
  status: i % 5 === 0 ? 'failed' : 'success',
  date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
  method: ['UPI', 'Card', 'Net Banking', 'Wallet'][i % 4],
}))

export function AdminPayments() {
  const [search, setSearch] = useState('')
  usePageTitle('Admin — Payments')

  const filtered = MOCK_PAYMENTS.filter(p =>
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search) || p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Payments</h1>
        <Button variant="secondary" size="sm"><Download size={13} /> Export CSV</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Collected', value: `₹${MOCK_PAYMENTS.filter(p => p.status === 'success').reduce((a, p) => a + p.amount, 0).toLocaleString('en-IN')}` },
          { label: 'Successful', value: MOCK_PAYMENTS.filter(p => p.status === 'success').length },
          { label: 'Failed', value: MOCK_PAYMENTS.filter(p => p.status === 'failed').length },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="font-mono font-bold text-xl text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search payments…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50 text-slate-100 placeholder-slate-500 outline-none transition-all"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'User', 'Plan', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/[0.03] table-row-hover">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{p.user}</p>
                    <p className="text-xs text-slate-500">{p.email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge variant={p.plan === 'premium' ? 'amber' : 'blue'} className="capitalize">{p.plan}</Badge></td>
                  <td className="px-4 py-3 font-mono text-white">₹{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.method}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === 'success' ? 'green' : 'red'}>
                      {p.status === 'success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Plans ────────────────────────────────────────────────────────────────────
const DEFAULT_PLANS = [
  { id: 'free',    name: 'Free',    price: 0,    predictions: 3,   portfolio: 3,   indicators: false, premium: false },
  { id: 'basic',   name: 'Basic',   price: 499,  predictions: 20,  portfolio: 10,  indicators: true,  premium: false },
  { id: 'premium', name: 'Premium', price: 1499, predictions: -1,  portfolio: -1,  indicators: true,  premium: true  },
]

export function AdminPlans() {
  const [plans, setPlans] = useState(DEFAULT_PLANS)
  const [editing, setEditing] = useState(null)
  usePageTitle('Admin — Plans')

  const handleSave = (plan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? plan : p))
    setEditing(null)
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-2xl text-white">Plans</h1>
      <div className="space-y-3">
        {plans.map(plan => (
          <div key={plan.id} className="card p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white capitalize">{plan.name}</h3>
                <Badge variant={plan.id === 'premium' ? 'amber' : plan.id === 'basic' ? 'blue' : 'default'}>{plan.id}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <span>₹{plan.price}/mo</span>
                <span>Predictions: {plan.predictions === -1 ? 'Unlimited' : plan.predictions}/day</span>
                <span>Portfolio: {plan.portfolio === -1 ? 'Unlimited' : plan.portfolio} stocks</span>
                <span>Indicators: {plan.indicators ? '✓' : '✗'}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEditing({ ...plan })}>
              Edit
            </Button>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Plan">
        {editing && (
          <div className="space-y-4">
            <Input label="Plan Name" value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
            <Input label="Price (₹/month)" type="number" value={editing.price} onChange={e => setEditing(p => ({ ...p, price: +e.target.value }))} />
            <Input label="Daily Predictions (-1 = unlimited)" type="number" value={editing.predictions} onChange={e => setEditing(p => ({ ...p, predictions: +e.target.value }))} />
            <Input label="Portfolio Limit (-1 = unlimited)" type="number" value={editing.portfolio} onChange={e => setEditing(p => ({ ...p, portfolio: +e.target.value }))} />
            <div className="flex gap-3 pt-1">
              <Button variant="ghost" className="flex-1 justify-center" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={() => handleSave(editing)}>Save Plan</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
const DEFAULT_COUPONS = [
  { id: 1, code: 'LAUNCH50', discount: 50, type: 'percent', uses: 23, maxUses: 100, active: true, expiry: '2025-12-31' },
  { id: 2, code: 'TRADE20', discount: 20, type: 'percent', uses: 87, maxUses: 200, active: true, expiry: '2025-06-30' },
  { id: 3, code: 'PREMIUM100', discount: 100, type: 'flat', uses: 5, maxUses: 50, active: false, expiry: '2025-03-31' },
]

export function AdminCoupons() {
  const [coupons, setCoupons] = useState(DEFAULT_COUPONS)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ code: '', discount: '', type: 'percent', maxUses: '', expiry: '' })
  usePageTitle('Admin — Coupons')

  const handleCreate = () => {
    if (!form.code || !form.discount) return
    setCoupons(prev => [...prev, { id: Date.now(), ...form, discount: +form.discount, maxUses: +form.maxUses, uses: 0, active: true }])
    setShowCreate(false)
    setForm({ code: '', discount: '', type: 'percent', maxUses: '', expiry: '' })
  }

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Coupons</h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>+ Create Coupon</Button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Code', 'Discount', 'Uses', 'Expiry', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-white/[0.03] table-row-hover">
                <td className="px-4 py-3 font-mono font-semibold text-white">{c.code}</td>
                <td className="px-4 py-3">
                  <Badge variant="brand">{c.discount}{c.type === 'percent' ? '%' : '₹'} off</Badge>
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono">{c.uses}/{c.maxUses}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{c.expiry}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.active ? 'green' : 'default'}>{c.active ? 'Active' : 'Disabled'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(c.id)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {c.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Coupon">
        <div className="space-y-4">
          <Input label="Coupon Code" placeholder="LAUNCH50" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Discount Value" type="number" placeholder="50" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-100 bg-slate-800/60 border border-slate-700/50 outline-none"
              >
                <option value="percent" className="bg-slate-900">Percentage (%)</option>
                <option value="flat" className="bg-slate-900">Flat Amount (₹)</option>
              </select>
            </div>
          </div>
          <Input label="Max Uses" type="number" placeholder="100" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))} />
          <Input label="Expiry Date" type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1 justify-center" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 justify-center" onClick={handleCreate}>Create Coupon</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

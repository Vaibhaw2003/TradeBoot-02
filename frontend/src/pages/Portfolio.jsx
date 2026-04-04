import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'
import { PortfolioPieChart } from '../components/charts'
import { Button, Modal, Input, Badge, EmptyState } from '../components/ui'
import { Plus, Trash2, TrendingUp, TrendingDown, Briefcase, Lock, ArrowRight } from 'lucide-react'
import { MOCK_STOCKS, formatCurrency, formatPercent } from '../utils'
import { usePageTitle } from '../hooks'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const INITIAL_PORTFOLIO = [
  { id: 1, symbol: 'TCS', name: 'Tata Consultancy Services', qty: 5, buyPrice: 3600, currentPrice: 3842.50 },
  { id: 2, symbol: 'INFY', name: 'Infosys Ltd', qty: 10, buyPrice: 1450, currentPrice: 1523.40 },
  { id: 3, symbol: 'RELIANCE', name: 'Reliance Industries', qty: 3, buyPrice: 2800, currentPrice: 2956.75 },
]

export default function Portfolio() {
  const navigate = useNavigate()
  const { canAddToPortfolio, limits, hasPremiumAnalytics, incrementUsage } = useSubscription()
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ symbol: '', qty: '', buyPrice: '' })
  const [loading, setLoading] = useState(false)
  console.log('Portfolio mounted')

  usePageTitle('Portfolio')

  const totalInvested = portfolio.reduce((acc, s) => acc + s.qty * s.buyPrice, 0)
  const totalCurrent  = portfolio.reduce((acc, s) => acc + s.qty * s.currentPrice, 0)
  const totalPnL      = totalCurrent - totalInvested
  const totalPnLPct   = ((totalPnL / totalInvested) * 100).toFixed(2)

  const pieData = portfolio.map(s => ({
    name: s.symbol,
    value: +(s.qty * s.currentPrice).toFixed(2),
    percent: ((s.qty * s.currentPrice / totalCurrent) * 100).toFixed(1),
  }))

  const handleAdd = async () => {
    if (!form.symbol || !form.qty || !form.buyPrice) { toast.error('Fill all fields'); return }
    if (!canAddToPortfolio) { toast.error('Portfolio limit reached. Upgrade to add more.'); return }

    const stock = MOCK_STOCKS.find(s => s.symbol === form.symbol.toUpperCase())
    if (!stock) { toast.error('Stock not found'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    setPortfolio(prev => [...prev, {
      id: Date.now(),
      symbol: stock.symbol,
      name: stock.name,
      qty: +form.qty,
      buyPrice: +form.buyPrice,
      currentPrice: stock.price,
    }])
    incrementUsage('portfolio')
    setForm({ symbol: '', qty: '', buyPrice: '' })
    setShowModal(false)
    setLoading(false)
    toast.success(`${stock.symbol} added to portfolio`)
  }

  const handleRemove = (id) => {
    setPortfolio(prev => prev.filter(s => s.id !== id))
    toast.success('Removed from portfolio')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Portfolio</h1>
          <p className="text-sm text-slate-400 mt-1">Track your holdings and P&L</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => canAddToPortfolio ? setShowModal(true) : toast.error('Portfolio limit reached')}
        >
          <Plus size={14} /> Add Stock
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Invested', value: formatCurrency(totalInvested), color: 'text-white' },
          { label: 'Current Value', value: formatCurrency(totalCurrent), color: 'text-white' },
          { label: 'Total P&L', value: formatCurrency(totalPnL), color: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Return %', value: `${totalPnL >= 0 ? '+' : ''}${totalPnLPct}%`, color: totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400' },
        ].map(item => (
          <div key={item.label} className="stat-card">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className={clsx('font-mono font-bold text-lg mt-1', item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Holdings table */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold text-white text-sm">
                Holdings <span className="text-slate-500">({portfolio.length}/{limits.portfolio === -1 ? '∞' : limits.portfolio})</span>
              </h2>
            </div>

            {portfolio.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No holdings yet"
                description="Add stocks to start tracking your portfolio"
                action={
                  <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                    <Plus size={13} /> Add Stock
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Symbol', 'Qty', 'Buy Price', 'Current', 'P&L', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(s => {
                      const pnl = (s.currentPrice - s.buyPrice) * s.qty
                      const pnlPct = ((s.currentPrice - s.buyPrice) / s.buyPrice * 100)
                      const isUp = pnl >= 0
                      return (
                        <tr key={s.id} className="border-b border-white/5 table-row-hover">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-mono font-semibold text-white">{s.symbol}</p>
                              <p className="text-xs text-slate-500 truncate max-w-[120px]">{s.name.split(' ').slice(0, 2).join(' ')}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-300">{s.qty}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">₹{s.buyPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 font-mono text-white">₹{s.currentPrice.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <p className={clsx('font-mono text-sm font-semibold', isUp ? 'text-emerald-400' : 'text-red-400')}>
                              {isUp ? '+' : ''}₹{Math.abs(pnl).toFixed(0)}
                            </p>
                            <p className={clsx('text-xs font-mono', isUp ? 'text-emerald-400' : 'text-red-400')}>
                              {isUp ? '+' : ''}{pnlPct.toFixed(2)}%
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemove(s.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pie + analytics */}
        <div className="space-y-4">
          {portfolio.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Allocation</h3>
              <PortfolioPieChart data={pieData} />
              <div className="space-y-2 mt-3">
                {pieData.map((item, i) => {
                  const colors = ['#00f5c8','#3b82f6','#f59e0b','#8b5cf6','#ec4899']
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-mono text-white">{item.percent}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Premium analytics teaser */}
          {!hasPremiumAnalytics && (
            <div className="card-brand p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-amber-400" />
                <p className="text-sm font-medium text-white">Premium Analytics</p>
              </div>
              <p className="text-xs text-slate-400">
                Get sector analysis, correlation charts, risk metrics, and more.
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/pricing')} className="w-full justify-center">
                Unlock Premium <ArrowRight size={13} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Stock Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add to Portfolio">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Stock Symbol</label>
            <select
              value={form.symbol}
              onChange={e => setForm(p => ({ ...p, symbol: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-100 bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50 outline-none"
            >
              <option value="" className="bg-slate-900">Select stock…</option>
              {MOCK_STOCKS.map(s => (
                <option key={s.symbol} value={s.symbol} className="bg-slate-900">
                  {s.symbol} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Quantity"
            type="number"
            min="1"
            placeholder="10"
            value={form.qty}
            onChange={e => setForm(p => ({ ...p, qty: e.target.value }))}
          />
          <Input
            label="Buy Price (₹)"
            type="number"
            min="1"
            placeholder="e.g. 3500"
            value={form.buyPrice}
            onChange={e => setForm(p => ({ ...p, buyPrice: e.target.value }))}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 justify-center" loading={loading} onClick={handleAdd}>
              <Plus size={14} /> Add Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

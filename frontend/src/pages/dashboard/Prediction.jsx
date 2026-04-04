import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../context/SubscriptionContext'
import { PriceChart } from '../../components/charts'
import { PredictionGauge } from '../../components/charts'
import { Button, Badge, Loader, Modal } from '../../components/ui'
import {
  Search, Zap, TrendingUp, TrendingDown,
  Target, Shield, Clock, ArrowRight, Brain, Lock
} from 'lucide-react'
import { MOCK_STOCKS, generatePriceHistory, formatCurrency } from '../../utils'
import { usePageTitle } from '../../hooks'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const TIMEFRAMES = [
  { label: '1 Day', value: '1d' },
  { label: '3 Days', value: '3d' },
  { label: '1 Week', value: '7d' },
  { label: '1 Month', value: '1mo' },
]

export default function Prediction() {
  const navigate = useNavigate()
  const { canPredict, incrementUsage, usage, limits, isPremium } = useSubscription()
  const [query, setQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)
  const [timeframe, setTimeframe] = useState('7d')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [priceData, setPriceData] = useState([])

  usePageTitle('AI Predictions')

  const filteredStocks = query.length >= 1
    ? MOCK_STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_STOCKS.slice(0, 6)

  const handlePredict = async () => {
    if (!selectedStock) { toast.error('Please select a stock'); return }
    if (!canPredict) { setShowUpgradeModal(true); return }

    setLoading(true)
    setPrediction(null)

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 2000))

      const trend = selectedStock.change >= 0 ? 'bullish' : 'bearish'
      const multiplier = trend === 'bullish' ? 1 + Math.random() * 0.05 : 1 - Math.random() * 0.04
      const targetPrice = selectedStock.price * multiplier
      const confidence = Math.floor(60 + Math.random() * 30)

      const pd = generatePriceHistory(selectedStock.price, 30, trend)
      const futureDays = parseInt(timeframe) || 7
      for (let i = 0; i < futureDays; i++) {
        const last = pd[pd.length - 1]
        pd.push({
          ...last,
          date: `+${i + 1}d`,
          close: last.close * (trend === 'bullish' ? 1 + Math.random() * 0.01 : 1 - Math.random() * 0.01),
          predicted: targetPrice * (1 + (Math.random() - 0.5) * 0.01),
        })
      }
      setPriceData(pd)

      setPrediction({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        currentPrice: selectedStock.price,
        targetPrice: +targetPrice.toFixed(2),
        change: +((targetPrice - selectedStock.price) / selectedStock.price * 100).toFixed(2),
        confidence,
        trend,
        timeframe,
        stopLoss: +(selectedStock.price * (trend === 'bullish' ? 0.96 : 1.04)).toFixed(2),
        support: +(selectedStock.price * 0.97).toFixed(2),
        resistance: +(selectedStock.price * 1.03).toFixed(2),
        risk: confidence > 75 ? 'Low' : confidence > 60 ? 'Medium' : 'High',
        signals: [
          { name: 'RSI', value: 45 + Math.random() * 30, status: trend },
          { name: 'MACD', value: (Math.random() - 0.5).toFixed(2), status: trend },
          { name: 'Bollinger', value: '0.6σ', status: trend === 'bullish' ? 'bullish' : 'bearish' },
          { name: 'Volume', value: '+12%', status: 'bullish' },
        ],
      })

      incrementUsage('predictions')
      toast.success('Prediction generated!')
    } catch (err) {
      toast.error('Failed to generate prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">AI Predictions</h1>
        <p className="text-sm text-slate-400 mt-1">Select a stock and get AI-powered price predictions</p>
      </div>

      {/* Usage bar */}
      {limits.predictions !== -1 && (
        <div className="card p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-400/10 flex items-center justify-center">
              <Zap size={15} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Daily Predictions</p>
              <p className="text-xs text-slate-500">{usage.predictions} of {limits.predictions} used today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usage.predictions / limits.predictions) * 100)}%` }}
              />
            </div>
            {!isPremium && (
              <Button variant="secondary" size="xs" onClick={() => navigate('/pricing')}>Upgrade</Button>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Stock selector */}
        <div className="space-y-4">
          <div className="card p-4 space-y-4">
            <h2 className="font-display font-semibold text-white text-sm">Select Stock</h2>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search TCS, RELIANCE…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20 text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-hide">
              {filteredStocks.map(stock => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={clsx(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                    selectedStock?.symbol === stock.symbol
                      ? 'bg-brand-400/10 border border-brand-400/20 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                      {stock.symbol[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-semibold truncate">{stock.symbol}</p>
                      <p className="text-[10px] text-slate-500 truncate">{stock.name.split(' ').slice(0, 2).join(' ')}</p>
                    </div>
                  </div>
                  <span className={clsx(
                    'text-xs font-mono shrink-0',
                    stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div className="card p-4 space-y-3">
            <h2 className="font-display font-semibold text-white text-sm">Prediction Horizon</h2>
            <div className="grid grid-cols-2 gap-2">
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={clsx(
                    'py-2 rounded-lg text-xs font-medium transition-all',
                    timeframe === tf.value
                      ? 'bg-brand-400 text-slate-900 shadow-glow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            loading={loading}
            disabled={!selectedStock}
            onClick={handlePredict}
            className="w-full justify-center"
          >
            <Brain size={15} />
            Generate Prediction
          </Button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center">
                  <Brain size={28} className="text-brand-400 animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-3xl border border-brand-400/10 animate-pulse" />
              </div>
              <p className="text-slate-400 text-sm">Analyzing {selectedStock?.symbol} with AI…</p>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {!loading && !prediction && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center">
                <Target size={28} className="text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-white">No prediction yet</p>
                <p className="text-sm text-slate-400 mt-1">Select a stock and click Generate Prediction</p>
              </div>
            </div>
          )}

          {!loading && prediction && (
            <>
              {/* Summary */}
              <div className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{prediction.name}</p>
                    <h2 className="font-mono font-bold text-2xl text-white">{prediction.symbol}</h2>
                  </div>
                  <Badge variant={prediction.trend === 'bullish' ? 'green' : 'red'} className="text-sm px-3 py-1">
                    {prediction.trend === 'bullish' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {prediction.trend.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Current Price', value: `₹${prediction.currentPrice.toFixed(2)}`, color: 'text-white' },
                    {
                      label: 'Target Price',
                      value: `₹${prediction.targetPrice.toFixed(2)}`,
                      color: prediction.change >= 0 ? 'text-emerald-400' : 'text-red-400',
                      sub: `${prediction.change >= 0 ? '+' : ''}${prediction.change}%`
                    },
                    { label: 'Stop Loss', value: `₹${prediction.stopLoss.toFixed(2)}`, color: 'text-red-400' },
                    { label: 'Risk Level', value: prediction.risk, color: prediction.risk === 'Low' ? 'text-emerald-400' : prediction.risk === 'Medium' ? 'text-amber-400' : 'text-red-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-800/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className={clsx('font-mono font-bold text-base', item.color)}>{item.value}</p>
                      {item.sub && <p className={clsx('text-xs font-mono', item.color)}>{item.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Gauge */}
                <div className="flex justify-center">
                  <PredictionGauge confidence={prediction.confidence} trend={prediction.trend} />
                </div>
              </div>

              {/* Chart */}
              <div className="card p-5">
                <PriceChart data={priceData} symbol={prediction.symbol} showPrediction />
              </div>

              {/* Signals */}
              <div className="card p-5">
                <h3 className="font-display font-semibold text-white mb-4 text-sm">Technical Signals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {prediction.signals.map(sig => (
                    <div key={sig.name} className="bg-slate-800/40 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500">{sig.name}</p>
                        <Badge variant={sig.status === 'bullish' ? 'green' : sig.status === 'bearish' ? 'red' : 'default'} className="text-[10px]">
                          {sig.status}
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-white font-semibold">{sig.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Daily Limit Reached"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto">
            <Lock size={24} className="text-amber-400" />
          </div>
          <p className="text-slate-300">
            You've used all {limits.predictions} predictions for today on the <strong className="text-white capitalize">{' '}free</strong> plan.
          </p>
          <p className="text-sm text-slate-400">Upgrade to get more predictions and unlock all features.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => setShowUpgradeModal(false)} className="flex-1 justify-center">
              Maybe Later
            </Button>
            <Button variant="primary" size="md" onClick={() => { setShowUpgradeModal(false); navigate('/pricing') }} className="flex-1 justify-center">
              Upgrade Now <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

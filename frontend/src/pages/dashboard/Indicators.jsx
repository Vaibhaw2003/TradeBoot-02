import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../context/SubscriptionContext'
import { RSIChart, MACDChart, PriceChart } from '../../components/charts'
import { Button, Badge } from '../../components/ui'
import { generatePriceHistory, generateRSIData, generateMACDData, MOCK_STOCKS } from '../../utils'
import { Lock as LockIcon, BarChart2, Zap } from 'lucide-react'
import { usePageTitle } from '../../hooks'
import clsx from 'clsx'

const INDICATOR_LIST = [
  { id: 'rsi',       name: 'RSI',               desc: 'Relative Strength Index — momentum oscillator', free: true },
  { id: 'macd',      name: 'MACD',              desc: 'Moving Average Convergence Divergence', free: true },
  { id: 'bb',        name: 'Bollinger Bands',    desc: 'Price volatility and trend channels', free: false },
  { id: 'sma',       name: 'SMA 50/200',         desc: 'Simple Moving Average crossover', free: false },
  { id: 'ema',       name: 'EMA 9/21',           desc: 'Exponential Moving Average crossover', free: false },
  { id: 'stoch',     name: 'Stochastic',         desc: 'Stochastic oscillator for overbought/oversold', free: false },
  { id: 'atr',       name: 'ATR',                desc: 'Average True Range — volatility measurement', free: false },
  { id: 'vwap',      name: 'VWAP',               desc: 'Volume Weighted Average Price', free: false },
]

export default function Indicators() {
  const { hasIndicators } = useSubscription()
  const navigate = useNavigate()
  const [selectedStock] = useState(MOCK_STOCKS[0])
  const [activeIndicators, setActiveIndicators] = useState(['rsi', 'macd'])

  usePageTitle('Indicators')

  const rsiData = generateRSIData(60)
  const macdData = generateMACDData(60)
  const priceData = generatePriceHistory(selectedStock.price, 60)

  const toggleIndicator = (id, free) => {
    if (!free && !hasIndicators) { navigate('/pricing'); return }
    setActiveIndicators(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Technical Indicators</h1>
          <p className="text-sm text-slate-400 mt-1">Analyse market trends with advanced indicators</p>
        </div>
        {!hasIndicators && (
          <Button variant="primary" size="sm" onClick={() => navigate('/pricing')}>
            <Zap size={13} /> Unlock All
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Indicator selector */}
        <div className="card p-4 space-y-3 h-fit">
          <h2 className="text-sm font-semibold text-white">Indicators</h2>
          {INDICATOR_LIST.map(ind => {
            const locked = !ind.free && !hasIndicators
            const active = activeIndicators.includes(ind.id)
            return (
              <button
                key={ind.id}
                onClick={() => toggleIndicator(ind.id, ind.free)}
                className={clsx(
                  'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-150 group',
                  active ? 'bg-brand-400/10 border border-brand-400/20' : 'hover:bg-white/5',
                  locked && 'opacity-60'
                )}
              >
                <div className={clsx(
                  'w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0',
                  active ? 'bg-brand-400 border-brand-400' : 'border-slate-600'
                )}>
                  {active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#0d1520" strokeWidth="2" strokeLinecap="round"/></svg>}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-white">{ind.name}</p>
                    {locked && <LockIcon size={10} className="text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{ind.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-5">
            <PriceChart data={priceData} symbol={selectedStock.symbol} />
          </div>

          {activeIndicators.includes('rsi') && (
            <div className="card p-5">
              <RSIChart data={rsiData} />
            </div>
          )}

          {activeIndicators.includes('macd') && (
            <div className="card p-5">
              <MACDChart data={macdData} />
            </div>
          )}

          {/* Locked indicator placeholders */}
          {activeIndicators.filter(id => {
            const ind = INDICATOR_LIST.find(x => x.id === id)
            return ind && !ind.free && !hasIndicators
          }).map(id => (
            <div key={id} className="card p-10 flex flex-col items-center justify-center gap-3">
              <LockIcon size={24} className="text-amber-400" />
              <p className="text-sm text-white font-medium">Premium Indicator</p>
              <p className="text-xs text-slate-400">Upgrade your plan to access this indicator</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/pricing')}>Upgrade Plan</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

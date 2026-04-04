import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PriceChart, VolumeChart, RSIChart, MACDChart } from '../../components/charts'
import { Badge, Button, SkeletonCard } from '../../components/ui'
import { ArrowLeft, TrendingUp, TrendingDown, Star, Plus } from 'lucide-react'
import { MOCK_STOCKS, generatePriceHistory, generateRSIData, generateMACDData, formatVolume } from '../../utils'
import { usePageTitle } from '../../hooks'
import clsx from 'clsx'

export default function StockDetails() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [stock, setStock] = useState(null)
  const [priceData, setPriceData] = useState([])
  const [rsiData, setRsiData] = useState([])
  const [macdData, setMacdData] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('chart')

  usePageTitle(symbol || 'Stock Details')

  useEffect(() => {
    const s = MOCK_STOCKS.find(x => x.symbol === symbol?.toUpperCase()) || MOCK_STOCKS[0]
    setTimeout(() => {
      setStock(s)
      setPriceData(generatePriceHistory(s.price, 60, s.change >= 0 ? 'up' : 'down'))
      setRsiData(generateRSIData(60))
      setMacdData(generateMACDData(60))
      setLoading(false)
    }, 600)
  }, [symbol])

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={8} />
      </div>
    )
  }

  const isUp = stock.change >= 0

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-lg font-bold font-mono text-slate-300">
              {stock.symbol[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-white">{stock.symbol}</h1>
                <Badge variant={isUp ? 'green' : 'red'}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isUp ? 'BULLISH' : 'BEARISH'}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{stock.name} · {stock.sector}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono font-bold text-3xl text-white">
                ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <p className={clsx('text-sm font-mono', isUp ? 'text-emerald-400' : 'text-red-400')}>
                {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Star size={15} /> Watchlist
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/prediction')}>
                <TrendingUp size={15} /> Predict
              </Button>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5 pt-4 border-t border-white/5">
          {[
            { label: 'Open', value: `₹${(stock.price * 0.998).toFixed(2)}` },
            { label: 'Prev Close', value: `₹${(stock.price - stock.change).toFixed(2)}` },
            { label: 'Volume', value: formatVolume(stock.volume) },
            { label: '52W High', value: `₹${(stock.price * 1.32).toFixed(0)}` },
            { label: '52W Low', value: `₹${(stock.price * 0.74).toFixed(0)}` },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-sm font-mono font-medium text-white mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1 w-fit">
        {['chart', 'indicators', 'analysis'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all',
              tab === t ? 'bg-brand-400 text-slate-900 shadow-glow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'chart' && (
        <div className="space-y-4">
          <div className="card p-5">
            <PriceChart data={priceData} symbol={stock.symbol} />
          </div>
          <div className="card p-5">
            <VolumeChart data={priceData} />
          </div>
        </div>
      )}

      {tab === 'indicators' && (
        <div className="space-y-4">
          <div className="card p-5">
            <RSIChart data={rsiData} />
          </div>
          <div className="card p-5">
            <MACDChart data={macdData} />
          </div>
        </div>
      )}

      {tab === 'analysis' && (
        <div className="card p-5 space-y-5">
          <h3 className="font-display font-semibold text-white">AI Analysis Summary</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Short Term (1W)', trend: 'bullish', confidence: 72, target: (stock.price * 1.03).toFixed(2) },
              { label: 'Mid Term (1M)', trend: 'neutral', confidence: 58, target: (stock.price * 1.05).toFixed(2) },
              { label: 'Long Term (3M)', trend: 'bullish', confidence: 65, target: (stock.price * 1.12).toFixed(2) },
            ].map(item => (
              <div key={item.label} className="bg-slate-800/40 rounded-xl p-4 space-y-3">
                <p className="text-xs text-slate-500">{item.label}</p>
                <Badge variant={item.trend === 'bullish' ? 'green' : item.trend === 'bearish' ? 'red' : 'default'}>
                  {item.trend.toUpperCase()}
                </Badge>
                <div>
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="font-mono font-semibold text-white">₹{item.target}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Confidence: {item.confidence}%</p>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: `${item.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

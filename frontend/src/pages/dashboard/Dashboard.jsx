import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSubscription } from '../../context/SubscriptionContext'
import { SkeletonCard, Badge, Button } from '../../components/ui'
import { PriceChart } from '../../components/charts'
import { PredictionCard, NewsCard, InsightCard } from '../../components/dashboard/AIWidgets'
import { marketApi } from '../../services/marketApi'
import {
  TrendingUp, TrendingDown, Search, ArrowRight,
  Activity, Newspaper, Brain
} from 'lucide-react'
import { usePageTitle } from '../../hooks'
import { MOCK_STOCKS } from '../../utils'
import clsx from 'clsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { usage, limits, canPredict } = useSubscription()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStock, setSelectedStock] = useState(MOCK_STOCKS[0])
  
  const [prediction, setPrediction] = useState(null)
  const [chartData, setChartData] = useState([])
  const [news, setNews] = useState([])
  const [timeframe, setTimeframe] = useState('1W')

  usePageTitle('AI Dashboard')

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      try {
        // Fetch AI Prediction, Chart Data, and Market News concurrently
        const [predData, cData, nData] = await Promise.all([
          marketApi.getPrediction(selectedStock.symbol),
          marketApi.getChartData(selectedStock.symbol, 30),
          marketApi.getMarketNews()
        ])
        setPrediction(predData)
        setChartData(cData)
        setNews(nData)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [selectedStock.symbol])

  // Simple debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(MOCK_STOCKS.slice(0, 4))
      return
    }
    const timer = setTimeout(async () => {
      const results = await marketApi.searchStocks(searchQuery)
      setSearchResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const gainers = MOCK_STOCKS.filter(s => s.change > 0).sort((a,b) => b.changePercent - a.changePercent).slice(0, 3)
  const losers  = MOCK_STOCKS.filter(s => s.change < 0).sort((a,b) => a.changePercent - b.changePercent).slice(0, 3)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            {greeting()}, {user?.name?.split(' ')[0] || 'Trader'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">Your AI trading assistant is active.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="hidden sm:flex px-3 py-1.5">
            <Activity size={10} className="animate-pulse mr-1" /> Market Live
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        {/* ─── Column 1: Search & Trending ─── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stock Search */}
          <div className="card p-4 space-y-4 shadow-xl">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Search size={16} className="text-brand-400" /> Stock Search
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search TCS, RELIANCE…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-xl text-sm bg-slate-950/50 border border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20 text-slate-100 placeholder-slate-500 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
              {searchResults.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={clsx(
                    'w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border',
                    selectedStock.symbol === stock.symbol
                      ? 'bg-brand-400/10 border-brand-400/20 shadow-glow-sm relative'
                      : 'border-transparent hover:bg-white/5 hover:border-white/5'
                  )}
                >
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-slate-100 text-sm truncate">{stock.symbol}</p>
                    <p className="text-[10px] text-slate-500 truncate">{stock.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-slate-200 text-sm">₹{Math.round(stock.price)}</p>
                    <p className={clsx('text-[10px] font-mono font-bold', stock.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Stocks */}
          <div className="card p-4 space-y-4">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Activity size={16} className="text-blue-400" /> Trending
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Top Gainers</p>
                <div className="space-y-2">
                  {gainers.map(s => (
                    <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1.5 rounded transition-colors text-sm">
                      <span className="font-mono font-medium text-slate-300">{s.symbol}</span>
                      <span className="text-emerald-400 font-mono text-xs">+{s.changePercent.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Top Losers</p>
                <div className="space-y-2">
                  {losers.map(s => (
                    <div key={s.symbol} onClick={() => setSelectedStock(s)} className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1.5 rounded transition-colors text-sm">
                      <span className="font-mono font-medium text-slate-300">{s.symbol}</span>
                      <span className="text-red-400 font-mono text-xs">{s.changePercent.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Column 2: Dashboard Core (Chart & Predictions) ─── */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* AI Prediction Panel */}
          {loading ? <SkeletonCard lines={4} /> : (
            <PredictionCard 
              prediction={prediction} 
              onPredictClick={() => navigate('/dashboard/prediction')} 
            />
          )}

          {/* Interactive Chart */}
          <div className="card p-5 flex-1 flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" /> Price Analysis
              </h3>
              <div className="flex gap-1 bg-slate-900 border border-white/5 rounded-lg p-1">
                {['1D', '1W', '1M', '1Y'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={clsx(
                      'px-3 py-1 text-[10px] font-bold rounded-md transition-colors',
                      timeframe === tf ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            {loading ? <SkeletonCard lines={6} /> : (
              <div className="flex-1 w-full h-full min-h-[250px]">
                {/* Wrap in div with relative height to let recharts responsive container fill it */}
                <PriceChart data={chartData} symbol={selectedStock.symbol} showPrediction={true} />
              </div>
            )}
          </div>
        </div>

        {/* ─── Column 3: AI Insights & News ─── */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Insights Panel */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-4">
              <Brain size={16} className="text-brand-400" /> AI Insights
            </h2>
            {loading ? <SkeletonCard lines={4} /> : (
              prediction?.insights?.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))
            )}
            {!loading && (!prediction?.insights || prediction.insights.length === 0) && (
              <p className="text-xs text-slate-500 italic p-3 bg-white/5 rounded-lg border border-white/5">
                No acute AI insights currently detected for {selectedStock.symbol}.
              </p>
            )}
          </div>

          {/* AI Market News */}
          <div className="card bg-slate-900/50 flex flex-col h-[calc(100%-18rem)] min-h-[300px]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display font-semibold text-white flex items-center gap-2">
                <Newspaper size={16} className="text-slate-400" /> Market News
              </h2>
              <Link to="/news" className="text-[10px] uppercase font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                View All <ArrowRight size={10} />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
              {loading ? (
                <>
                  <SkeletonCard lines={2} />
                  <SkeletonCard lines={2} />
                </>
              ) : (
                (news || []).slice(0, 3).map(item => (
                  <NewsCard key={item.id} news={item} />
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Number formatting ────────────────────────────────────────────────────────
export const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value || 0)

export const formatNumber = (value, decimals = 2) =>
  Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: decimals })

export const formatPercent = (value) =>
  `${value >= 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`

export const formatVolume = (vol) => {
  if (!vol) return '—'
  if (vol >= 1e7) return (vol / 1e7).toFixed(2) + ' Cr'
  if (vol >= 1e5) return (vol / 1e5).toFixed(2) + ' L'
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K'
  return vol.toString()
}

export const formatMarketCap = (cap) => {
  if (!cap) return '—'
  if (cap >= 1e12) return '₹' + (cap / 1e12).toFixed(2) + 'T'
  if (cap >= 1e9) return '₹' + (cap / 1e9).toFixed(2) + 'B'
  if (cap >= 1e7) return '₹' + (cap / 1e7).toFixed(2) + 'Cr'
  return '₹' + cap.toLocaleString()
}

// ─── Date formatting ──────────────────────────────────────────────────────────
export const formatDate = (date, opts = {}) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', ...opts })
    .format(new Date(date))

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).format(new Date(date))

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ─── Color helpers ─────────────────────────────────────────────────────────────
export const changeColor = (val) => val >= 0 ? 'text-emerald-400' : 'text-red-400'
export const changeBg = (val) => val >= 0 ? 'bg-emerald-400/10' : 'bg-red-400/10'

// ─── Mock data generators ─────────────────────────────────────────────────────
export const generatePriceHistory = (basePrice = 1000, days = 60, trend = 'up') => {
  const data = []
  let price = basePrice
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

    const drift = trend === 'up' ? 0.3 : trend === 'down' ? -0.3 : 0
    const change = price * (drift / 100 + (Math.random() - 0.5) * 0.025)
    price = Math.max(basePrice * 0.5, price + change)

    const open = price
    const close = price + price * (Math.random() - 0.5) * 0.01
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)

    data.push({
      date: dateStr,
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      volume: Math.floor(Math.random() * 5e6 + 1e6),
    })
  }
  return data
}

export const generateRSIData = (days = 60) => {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - i))
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      rsi: +(30 + Math.random() * 50).toFixed(2),
    }
  })
}

export const generateMACDData = (days = 60) => {
  let macd = 0
  let signal = 0
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - i))
    macd += (Math.random() - 0.5) * 10
    signal = signal * 0.8 + macd * 0.2
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      macd: +macd.toFixed(2),
      signal: +signal.toFixed(2),
      histogram: +(macd - signal).toFixed(2),
    }
  })
}

// ─── Mock stocks ──────────────────────────────────────────────────────────────
export const MOCK_STOCKS = [
  { symbol: 'TCS',        name: 'Tata Consultancy Services', price: 3842.50, change: 42.30,  changePercent: 1.11,  volume: 2145000, sector: 'IT' },
  { symbol: 'RELIANCE',   name: 'Reliance Industries Ltd',   price: 2956.75, change: -18.20, changePercent: -0.61, volume: 4328000, sector: 'Energy' },
  { symbol: 'INFY',       name: 'Infosys Ltd',               price: 1523.40, change: 15.60,  changePercent: 1.03,  volume: 3215000, sector: 'IT' },
  { symbol: 'HDFC',       name: 'HDFC Bank Ltd',             price: 1687.20, change: -5.40,  changePercent: -0.32, volume: 1987000, sector: 'Banking' },
  { symbol: 'WIPRO',      name: 'Wipro Ltd',                 price: 458.90,  change: 6.70,   changePercent: 1.48,  volume: 1654000, sector: 'IT' },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd',            price: 1023.60, change: 12.30,  changePercent: 1.22,  volume: 2876000, sector: 'Banking' },
  { symbol: 'LT',         name: 'Larsen & Toubro',           price: 3210.80, change: -22.10, changePercent: -0.68, volume: 876000,  sector: 'Infra' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd',         price: 6985.30, change: 89.50,  changePercent: 1.30,  volume: 654000,  sector: 'NBFC' },
]

export const MARKET_INDICES = [
  { name: 'NIFTY 50',    value: 22145.30, change: 124.50, changePercent: 0.57 },
  { name: 'SENSEX',      value: 73012.80, change: 412.30, changePercent: 0.57 },
  { name: 'NIFTY BANK',  value: 47834.60, change: -56.20, changePercent: -0.12 },
  { name: 'NIFTY IT',    value: 36543.20, change: 342.10, changePercent: 0.94 },
]

// ─── Mock Market News & Insights ──────────────────────────────────────────────
export const MOCK_MARKET_NEWS = [
  { id: 1, headline: 'IT Index surges after impressive Q3 results from Infosys & TCS', summary: 'Major gains seen across all top-tier tech firms following strong earnings guidance for the next quarter.', sentiment: 'positive', timestamp: new Date(Date.now() - 3600000).toISOString(), tags: ['IT', 'Earnings'] },
  { id: 2, headline: 'RBI holds interest rates steady in latest Monetary Policy', summary: 'In a largely expected move, the central bank maintains status quo, citing inflation concerns.', sentiment: 'neutral', timestamp: new Date(Date.now() - 7200000).toISOString(), tags: ['Banking', 'Policy'] },
  { id: 3, headline: 'Global oil prices jump 3% amid supply chain disruptions', summary: 'Rising crude prices are putting pressure on Indian oil marketing companies.', sentiment: 'negative', timestamp: new Date(Date.now() - 14400000).toISOString(), tags: ['Energy', 'Global'] },
  { id: 4, headline: 'Reliance announces major aggressive expansion in green energy', summary: 'New multibillion-dollar investments planned over the next five years.', sentiment: 'positive', timestamp: new Date(Date.now() - 86400000).toISOString(), tags: ['Energy', 'Corporate'] }
]

export const MOCK_INSIGHTS = {
  'TCS': [
    { type: 'bullish', text: 'Stock likely to rise due to extreme bullish momentum.' },
    { type: 'neutral', text: 'RSI indicates it is nearing the overbought zone.' }
  ],
  'RELIANCE': [
    { type: 'bearish', text: 'Downside risk detected due to global oil supply chain pressure.' },
    { type: 'neutral', text: 'Consolidating near major support levels (₹2900).' }
  ]
}

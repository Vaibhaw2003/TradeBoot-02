import { TrendingUp, TrendingDown, Brain, ExternalLink, Activity } from 'lucide-react'
import clsx from 'clsx'
import { Badge, Progress, Button } from '../ui'
import { formatCurrency, formatPercent, timeAgo } from '../../utils'
import { Link } from 'react-router-dom'

// ─── Trend Badge ──────────────────────────────────────────────────────────────
export function TrendBadge({ trend, format = 'standard', className = '' }) {
  const isUp = trend === 'bullish' || trend === 'up'
  return (
    <Badge variant={isUp ? 'green' : 'red'} className={clsx('gap-1', className)}>
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {format === 'short' ? (isUp ? 'UP' : 'DOWN') : trend.toUpperCase()}
    </Badge>
  )
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────
export function ConfidenceBar({ confidence }) {
  const color = confidence > 80 ? 'green' : confidence > 60 ? 'amber' : 'red'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">AI Confidence</span>
        <span className="font-mono font-bold text-white">{confidence}%</span>
      </div>
      <Progress value={confidence} max={100} variant={color} />
    </div>
  )
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
export function InsightCard({ insight }) {
  const { type, text } = insight
  const colorClass = type === 'bullish' ? 'text-emerald-400' : type === 'bearish' ? 'text-red-400' : 'text-blue-400'
  const bgClass = type === 'bullish' ? 'bg-emerald-400/10 border-emerald-400/20' : type === 'bearish' ? 'bg-red-400/10 border-red-400/20' : 'bg-blue-400/10 border-blue-400/20'

  return (
    <div className={clsx('relative overflow-hidden rounded-xl border p-4 space-y-3 transition-colors', bgClass)}>
      <div className="absolute -right-3 -top-3 p-4 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-start gap-3">
        <div className={clsx('mt-0.5 shrink-0', colorClass)}>
          <Brain size={18} />
        </div>
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}

// ─── News Card ────────────────────────────────────────────────────────────────
export function NewsCard({ news }) {
  const { headline, summary, sentiment, timestamp } = news
  const sColor = sentiment === 'positive' ? 'green' : sentiment === 'negative' ? 'red' : 'default'
  
  return (
    <div className="group card p-4 space-y-3 cursor-pointer hover:border-brand-400/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <Badge variant={sColor} className="text-[10px] uppercase font-semibold tracking-wider">
          {sentiment}
        </Badge>
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Activity size={10} />
          {timeAgo(timestamp)}
        </span>
      </div>
      <div>
        <h4 className="font-display font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2">
          {headline}
        </h4>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  )
}

// ─── Prediction Card ──────────────────────────────────────────────────────────
export function PredictionCard({ prediction, onPredictClick }) {
  if (!prediction) {
    return (
      <div className="card p-6 flex flex-col items-center text-center justify-center min-h-[220px]">
        <Brain size={32} className="text-slate-600 mb-3" />
        <h3 className="text-slate-300 font-medium font-display">No Stock Selected</h3>
        <p className="text-sm text-slate-500 mt-1">Select a stock to view daily AI predictions</p>
      </div>
    )
  }

  const { symbol, targetPrice, currentPrice, change, trend, confidence, risk } = prediction
  const isUp = change >= 0

  return (
    <div className="card relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Background glow based on trend */}
      <div className={clsx(
        'absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none',
        isUp ? 'bg-emerald-400' : 'bg-red-400'
      )} />
      
      <div className="p-5 flex flex-col h-full space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start z-10">
          <div>
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">AI Prediction</p>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">{symbol}</h2>
          </div>
          <TrendBadge trend={trend} format="standard" />
        </div>

        {/* Prediction Values */}
        <div className="z-10 grid grid-cols-2 gap-4">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Target Price</p>
            <p className="font-mono font-bold text-xl text-white">
              {formatCurrency(targetPrice)}
            </p>
            <p className={clsx('text-xs font-mono font-medium', isUp ? 'text-emerald-400' : 'text-red-400')}>
              {isUp ? '+' : ''}{change}%
            </p>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Current Price</p>
            <p className="font-mono font-bold text-lg text-slate-300">
              {formatCurrency(currentPrice)}
            </p>
          </div>
        </div>

        {/* Confidence & Action */}
        <div className="z-10 mt-auto pt-2 space-y-4">
          <ConfidenceBar confidence={confidence} />
          <div className="flex gap-2">
            <Link to="/target-analysis" className="flex-1">
               <Button variant="primary" size="sm" className="w-full text-xs" onClick={onPredictClick}>
                 View Detailed Analysis
               </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

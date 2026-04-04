import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react'
import clsx from 'clsx'

export default function StockCard({ stock, compact = false, onClick }) {
  const isUp = stock.change >= 0
  const isNeutral = stock.change === 0

  const TrendIcon = isNeutral ? Minus : isUp ? TrendingUp : TrendingDown
  const trendColor = isNeutral
    ? 'text-slate-400'
    : isUp ? 'text-emerald-400' : 'text-red-400'
  const bgColor = isNeutral
    ? 'bg-slate-700/20'
    : isUp ? 'bg-emerald-400/10' : 'bg-red-400/10'
  const borderColor = isNeutral
    ? 'border-slate-700/30'
    : isUp ? 'border-emerald-400/20' : 'border-red-400/20'

  const content = (
    <div className={clsx(
      'group card p-4 hover:border-brand-400/20 transition-all duration-200 cursor-pointer',
      compact ? 'p-3' : 'p-5',
      'hover:shadow-glow-sm hover:-translate-y-0.5'
    )}>
      <div className="flex items-start justify-between gap-3">
        {/* Symbol + name */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/5 flex items-center justify-center text-xs font-bold font-mono text-slate-300 shrink-0">
              {stock.symbol?.[0]}
            </div>
            <div className="min-w-0">
              <p className="font-mono font-semibold text-white text-sm group-hover:text-brand-300 transition-colors truncate">
                {stock.symbol}
              </p>
              {!compact && (
                <p className="text-xs text-slate-500 truncate">{stock.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Change badge */}
        <div className={clsx(
          'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold border shrink-0',
          bgColor, trendColor, borderColor
        )}>
          <TrendIcon size={11} />
          {isUp && '+'}{stock.changePercent?.toFixed(2)}%
        </div>
      </div>

      {!compact && (
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-mono font-bold text-xl text-white">
              ₹{stock.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className={clsx('text-xs font-mono', trendColor)}>
              {isUp && '+'}{stock.change?.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Vol</p>
            <p className="text-xs font-mono text-slate-400">{formatVolume(stock.volume)}</p>
          </div>
        </div>
      )}

      {/* Mini sparkline placeholder */}
      {!compact && (
        <div className="mt-3 h-8 flex items-end gap-0.5">
          {(stock.sparkline || generateDummySparkline(isUp)).map((val, i) => (
            <div
              key={i}
              className={clsx('flex-1 rounded-sm opacity-60 group-hover:opacity-90 transition-opacity', trendColor, 'bg-current')}
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )

  if (onClick) {
    return <div onClick={onClick}>{content}</div>
  }

  return (
    <Link to={`/dashboard/stocks/${stock.symbol}`}>
      {content}
    </Link>
  )
}

function formatVolume(vol) {
  if (!vol) return '—'
  if (vol >= 1e7) return (vol / 1e7).toFixed(1) + 'Cr'
  if (vol >= 1e5) return (vol / 1e5).toFixed(1) + 'L'
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K'
  return vol.toString()
}

function generateDummySparkline(up) {
  const bars = 12
  return Array.from({ length: bars }, (_, i) => {
    const base = up ? 30 + (i / bars) * 40 : 70 - (i / bars) * 40
    return Math.max(10, Math.min(90, base + (Math.random() - 0.5) * 20))
  })
}

// ─── Market Index Card ─────────────────────────────────────────────────────────
export function MarketIndexCard({ name, value, change, changePercent }) {
  const isUp = changePercent >= 0
  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">{name}</p>
        <p className="font-mono font-bold text-lg text-white">
          {value?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className={clsx(
        'text-right',
        isUp ? 'text-emerald-400' : 'text-red-400'
      )}>
        <p className="text-sm font-mono font-semibold">
          {isUp ? '+' : ''}{changePercent?.toFixed(2)}%
        </p>
        <p className="text-xs font-mono opacity-70">
          {isUp ? '+' : ''}{change?.toFixed(2)}
        </p>
      </div>
    </div>
  )
}

// ─── Usage Warning Banner ─────────────────────────────────────────────────────
export function UsageWarningBanner({ used, limit, type = 'predictions', onUpgrade }) {
  if (limit === -1 || used < limit * 0.7) return null
  const isBlocked = used >= limit

  return (
    <div className={clsx(
      'flex items-center justify-between gap-4 px-4 py-3 rounded-xl border text-sm',
      isBlocked
        ? 'bg-red-500/5 border-red-500/20 text-red-400'
        : 'bg-amber-400/5 border-amber-400/20 text-amber-400'
    )}>
      <p>
        {isBlocked
          ? `Daily ${type} limit reached (${limit}/${limit}). Upgrade to continue.`
          : `${limit - used} ${type} remaining today (${used}/${limit} used).`
        }
      </p>
      <button
        onClick={onUpgrade}
        className="shrink-0 text-xs font-medium underline underline-offset-2 hover:opacity-80"
      >
        Upgrade Plan
      </button>
    </div>
  )
}

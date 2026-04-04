import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts'
import { useState } from 'react'
import { Button } from '../ui'
import clsx from 'clsx'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = '₹' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 border border-white/10 shadow-2xl text-xs space-y-1.5 min-w-[120px]">
      <p className="text-slate-400 font-mono">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-slate-400 capitalize">{entry.name}</span>
          <span className="font-mono font-semibold" style={{ color: entry.color }}>
            {prefix}{Number(entry.value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Period Selector ──────────────────────────────────────────────────────────
function PeriodSelector({ periods, active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-800/60 rounded-lg p-1">
      {periods.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'px-3 py-1 rounded-md text-xs font-mono font-medium transition-all duration-150',
            active === p
              ? 'bg-brand-400 text-slate-900 shadow-glow-sm'
              : 'text-slate-500 hover:text-slate-300'
          )}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

// ─── Area/Line Price Chart ────────────────────────────────────────────────────
export function PriceChart({ data = [], symbol, showPrediction = false }) {
  const [period, setPeriod] = useState('1M')
  const periods = ['1W', '1M', '3M', '6M', '1Y']

  const isUp = data.length >= 2 && data[data.length - 1]?.close >= data[0]?.close
  const lineColor = isUp ? '#34d399' : '#f87171'
  const gradientId = `grad-${symbol}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-slate-300">{symbol} Price Chart</h3>
        <PeriodSelector periods={periods} active={period} onChange={setPeriod} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: lineColor, stroke: 'none' }}
            name="Price"
          />
          {showPrediction && (
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#00f5c8"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="none"
              dot={false}
              activeDot={{ r: 4, fill: '#00f5c8', stroke: 'none' }}
              name="Predicted"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Volume Bar Chart ─────────────────────────────────────────────────────────
export function VolumeChart({ data = [] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-mono text-sm font-semibold text-slate-300">Volume</h3>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
          <YAxis tick={false} axisLine={false} tickLine={false} />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="glass rounded-lg px-2 py-1 text-xs border border-white/10">
                  <span className="text-slate-400">{label}: </span>
                  <span className="font-mono text-blue-400">{formatVolume(payload[0].value)}</span>
                </div>
              ) : null
            }
          />
          <Bar dataKey="volume" fill="rgba(96,165,250,0.5)" radius={[2, 2, 0, 0]} maxBarSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── RSI Chart ────────────────────────────────────────────────────────────────
export function RSIChart({ data = [] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-slate-300">RSI (14)</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-red-400 inline-block" /> Overbought 70
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Oversold 30
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip prefix="" />} />
          <ReferenceLine y={70} stroke="rgba(248,113,113,0.4)" strokeDasharray="4 4" />
          <ReferenceLine y={30} stroke="rgba(52,211,153,0.4)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="rsi"
            stroke="#00f5c8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
            name="RSI"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── MACD Chart ───────────────────────────────────────────────────────────────
export function MACDChart({ data = [] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-slate-300">MACD</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-brand-400 inline-block" /> MACD</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-orange-400 inline-block" /> Signal</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip prefix="" />} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
          <Bar
            dataKey="histogram"
            fill="#00f5c8"
            opacity={0.6}
            radius={[2, 2, 0, 0]}
            maxBarSize={8}
            name="Hist"
          />
          <Line type="monotone" dataKey="macd" stroke="#00f5c8" strokeWidth={1.5} dot={false} name="MACD" />
          <Line type="monotone" dataKey="signal" stroke="#fb923c" strokeWidth={1.5} dot={false} name="Signal" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Portfolio Donut ──────────────────────────────────────────────────────────
import { PieChart, Pie, Cell } from 'recharts'

const PIE_COLORS = ['#00f5c8', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']

export function PortfolioPieChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="glass rounded-lg px-3 py-2 text-xs border border-white/10">
                <p className="text-white font-medium">{payload[0].name}</p>
                <p className="font-mono text-brand-400">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                <p className="text-slate-400">{payload[0].payload.percent?.toFixed(1)}%</p>
              </div>
            ) : null
          }
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Prediction Gauge ─────────────────────────────────────────────────────────
export function PredictionGauge({ confidence = 0, trend = 'neutral' }) {
  const radius = 70
  const circumference = Math.PI * radius
  const offset = circumference - (confidence / 100) * circumference
  const color = trend === 'bullish' ? '#34d399' : trend === 'bearish' ? '#f87171' : '#00f5c8'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="180" height="100" viewBox="0 0 180 100">
        {/* Background arc */}
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
        <text x="90" y="82" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="DM Mono">
          {confidence}%
        </text>
        <text x="90" y="96" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="DM Mono">
          confidence
        </text>
      </svg>
      <span className={clsx(
        'text-sm font-semibold uppercase tracking-widest font-mono',
        trend === 'bullish' ? 'text-emerald-400' : trend === 'bearish' ? 'text-red-400' : 'text-brand-400'
      )}>
        {trend}
      </span>
    </div>
  )
}

function formatVolume(vol) {
  if (!vol) return '—'
  if (vol >= 1e7) return (vol / 1e7).toFixed(1) + 'Cr'
  if (vol >= 1e5) return (vol / 1e5).toFixed(1) + 'L'
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K'
  return vol
}

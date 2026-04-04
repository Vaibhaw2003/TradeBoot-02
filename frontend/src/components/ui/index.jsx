import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = forwardRef(({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className = '', ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary:   'bg-brand-400 text-slate-900 hover:bg-brand-300 shadow-glow-sm hover:shadow-glow',
    secondary: 'bg-transparent border border-brand-400/30 text-brand-300 hover:border-brand-400/60 hover:bg-brand-400/5',
    ghost:     'text-slate-400 hover:text-slate-100 hover:bg-white/5',
    danger:    'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
    success:   'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20',
    outline:   'border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-white/5',
  }

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-base',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={14} />}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = forwardRef(({
  label, error, hint, icon: Icon, suffix,
  className = '', containerClassName = '', ...props
}, ref) => {
  return (
    <div className={clsx('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-slate-500" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 bg-slate-800/60 border transition-all duration-200 outline-none',
            Icon ? 'pl-10' : 'pl-4',
            suffix ? 'pr-16' : 'pr-4',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-xs text-slate-500 font-mono">{suffix}</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
})
Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
    <textarea
      ref={ref}
      className={clsx(
        'w-full px-4 py-3 rounded-lg text-sm text-slate-100 placeholder-slate-500',
        'bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50',
        'focus:ring-1 focus:ring-brand-400/20 outline-none transition-all duration-200 resize-none',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
    <select
      ref={ref}
      className={clsx(
        'w-full px-4 py-2.5 rounded-lg text-sm text-slate-100',
        'bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50',
        'focus:ring-1 focus:ring-brand-400/20 outline-none transition-all duration-200',
        className
      )}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-slate-900">
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
))
Select.displayName = 'Select'

// ─── Loader ───────────────────────────────────────────────────────────────────
export function Loader({ size = 'md', text }) {
  const sizes = { sm: 16, md: 24, lg: 40 }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        <Loader2 size={sizes[size]} className="animate-spin text-brand-400" />
        <div className="absolute inset-0 rounded-full blur-md bg-brand-400/20 animate-pulse" />
      </div>
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="relative inline-flex">
          <div className="w-16 h-16 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-400 animate-pulse" fill="currentColor">
              <path d="M3 3v18h18V3H3zm14 14H7V7h10v10z"/>
            </svg>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-mono tracking-widest animate-pulse">LOADING...</p>
      </div>
    </div>
  )
}

export function SkeletonLine({ width = 'full', height = 4 }) {
  const widths = { full: 'w-full', '3/4': 'w-3/4', '1/2': 'w-1/2', '1/4': 'w-1/4' }
  return (
    <div className={clsx('rounded bg-slate-800 animate-pulse', widths[width] || width, `h-${height}`)} />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLine width="1/2" height={5} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i % 2 === 0 ? 'full' : '3/4'} />
      ))}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md', className = '' }) {
  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-screen-lg',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={clsx(
        'relative w-full glass rounded-2xl shadow-2xl border border-white/10 animate-slide-up',
        sizes[size], className
      )}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="font-display font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    brand:   'bg-brand-400/10 text-brand-300 border-brand-400/20',
    green:   'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    red:     'bg-red-400/10 text-red-400 border-red-400/20',
    amber:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
    blue:    'bg-blue-400/10 text-blue-400 border-blue-400/20',
    purple:  'bg-purple-400/10 text-purple-400 border-purple-400/20',
  }
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export function Tooltip({ children, text }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded
        bg-slate-800 border border-white/10 text-xs text-slate-300 whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
        {text}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-center">
          <Icon size={28} className="text-slate-500" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-medium text-white">{title}</h3>
        {description && <p className="text-sm text-slate-400 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 border-t border-white/5" />
      {text && <span className="text-xs text-slate-500">{text}</span>}
      <div className="flex-1 border-t border-white/5" />
    </div>
  )
}

// ─── Switch ───────────────────────────────────────────────────────────────────
export function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-5 w-9 rounded-full transition-colors duration-200',
          checked ? 'bg-brand-400' : 'bg-slate-700'
        )}
      >
        <div className={clsx(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0'
        )} />
      </div>
      {label && <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>}
    </label>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export function Progress({ value = 0, max = 100, variant = 'brand', showLabel = false }) {
  const pct = Math.min(100, (value / max) * 100)
  const variants = {
    brand: 'bg-brand-400',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red:   'bg-red-400',
  }
  const color = pct >= 90 ? 'red' : pct >= 70 ? 'amber' : variant
  return (
    <div className="space-y-1">
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', variants[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 text-right">{value}/{max}</p>
      )}
    </div>
  )
}

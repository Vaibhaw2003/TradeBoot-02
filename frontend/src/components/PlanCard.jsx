import { Check, X, Zap, Crown, User, Star } from 'lucide-react'
import { Button, Badge } from './ui'
import clsx from 'clsx'

const PLAN_ICONS = {
  free: { icon: User, color: 'text-slate-400', bg: 'bg-slate-700/50' },
  basic: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  premium: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10' },
}

export default function PlanCard({
  plan, onSelect, currentPlan, loading = false
}) {
  const meta = PLAN_ICONS[plan.id] || PLAN_ICONS.free
  const isCurrent = currentPlan === plan.id
  const isPremium = plan.id === 'premium'

  return (
    <div className={clsx(
      'relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-200',
      isPremium
        ? 'bg-gradient-to-b from-amber-400/5 to-transparent border-amber-400/20 shadow-[0_0_40px_rgba(251,191,36,0.06)]'
        : 'bg-slate-900/60 border-white/5 hover:border-brand-400/20',
      isCurrent && 'ring-2 ring-brand-400/30'
    )}>
      {/* Popular badge */}
      {isPremium && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-lg">
            <Star size={10} fill="currentColor" /> MOST POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', meta.bg)}>
            <meta.icon size={18} className={meta.color} />
          </div>
          {isCurrent && <Badge variant="brand">Current</Badge>}
        </div>
        <h3 className="font-display font-bold text-xl text-white capitalize">{plan.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        {plan.price === 0 ? (
          <span className="font-display font-bold text-3xl text-white">Free</span>
        ) : (
          <>
            <span className="text-slate-400 text-lg">₹</span>
            <span className="font-display font-bold text-3xl text-white">
              {plan.price.toLocaleString('en-IN')}
            </span>
            <span className="text-slate-500 text-sm">/{plan.period || 'month'}</span>
          </>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5">
            {feat.included ? (
              <Check size={15} className="text-brand-400 mt-0.5 shrink-0" />
            ) : (
              <X size={15} className="text-slate-600 mt-0.5 shrink-0" />
            )}
            <span className={clsx(
              'text-sm',
              feat.included ? 'text-slate-300' : 'text-slate-600 line-through'
            )}>
              {feat.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={isPremium ? 'primary' : isCurrent ? 'ghost' : 'secondary'}
        size="md"
        loading={loading}
        disabled={isCurrent}
        onClick={() => onSelect?.(plan)}
        className="w-full justify-center"
      >
        {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}
      </Button>
    </div>
  )
}

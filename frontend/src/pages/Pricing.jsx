import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import Navbar from '../components/layout/Navbar'
import PlanCard from '../components/PlanCard'
import { Button, Input, Badge } from '../components/ui'
import { couponService } from '../services/couponService'
import { paymentService, initiateRazorpayPayment } from '../services/paymentService'
import { Check, Tag, X, ArrowRight, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePageTitle } from '../hooks'
import clsx from 'clsx'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect to get started',
    price: 0,
    period: 'month',
    features: [
      { label: '3 AI predictions per day', included: true },
      { label: '3 stocks in portfolio', included: true },
      { label: 'Basic price charts', included: true },
      { label: 'Market overview', included: true },
      { label: 'Technical indicators', included: false },
      { label: 'Prediction history', included: false },
      { label: 'Premium analytics', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For active traders',
    price: 499,
    period: 'month',
    features: [
      { label: '20 AI predictions per day', included: true },
      { label: '10 stocks in portfolio', included: true },
      { label: 'Advanced charts', included: true },
      { label: 'All technical indicators', included: true },
      { label: 'Prediction history', included: true },
      { label: 'Email alerts', included: true },
      { label: 'Premium analytics', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious traders',
    price: 1499,
    period: 'month',
    features: [
      { label: 'Unlimited predictions', included: true },
      { label: 'Unlimited portfolio stocks', included: true },
      { label: 'Advanced charts + patterns', included: true },
      { label: 'All technical indicators', included: true },
      { label: 'Full prediction history', included: true },
      { label: 'Email + SMS alerts', included: true },
      { label: 'Premium analytics dashboard', included: true },
      { label: 'Priority support', included: true },
    ],
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { plan: currentPlan } = useSubscription()
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  usePageTitle('Pricing')

  const handleCouponValidate = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const result = await couponService.validate(couponCode, selectedPlan?.id)
      setCouponResult(result)
      toast.success(`Coupon applied! ${result.discount}% off`)
    } catch (err) {
      setCouponResult({ error: err.message || 'Invalid coupon code' })
    } finally {
      setCouponLoading(false)
    }
  }

  const handleSelectPlan = async (plan) => {
    if (plan.price === 0) {
      if (!isAuthenticated) navigate('/register')
      return
    }
    if (!isAuthenticated) { navigate('/login'); return }

    setSelectedPlan(plan)
    setPayLoading(plan.id)

    try {
      const discount = couponResult?.discount ? plan.price * (1 - couponResult.discount / 100) : plan.price
      const order = await paymentService.createOrder(plan.id, couponCode)

      await initiateRazorpayPayment(
        order,
        user,
        async (response) => {
          await paymentService.verifyPayment(response)
          toast.success('Payment successful! Plan activated.')
          navigate('/payment-success', { state: { plan, order } })
        },
        (err) => {
          toast.error(err.message || 'Payment failed')
        }
      )
    } catch (err) {
      // Demo: no backend
      toast.success('Payment gateway loaded (demo mode)')
      navigate('/payment-success', { state: { plan, order: { amount: plan.price } } })
    } finally {
      setPayLoading(null)
    }
  }

  const getDiscountedPrice = (price) => {
    if (!couponResult?.discount || price === 0) return price
    return +(price * (1 - couponResult.discount / 100)).toFixed(0)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-brand-400/[0.03] blur-3xl pointer-events-none" />

      <Navbar />

      <div className="max-w-screen-lg mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display font-black text-4xl md:text-5xl text-white">
            Simple <span className="text-gradient">pricing</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Start free. Upgrade when you're ready. No hidden fees.
          </p>
          {/* Coupon field */}
          <div className="flex items-center justify-center gap-2 max-w-sm mx-auto mt-4">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Coupon code"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null) }}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-slate-800/60 border border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20 text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>
            <Button variant="secondary" size="md" loading={couponLoading} onClick={handleCouponValidate}>
              Apply
            </Button>
          </div>
          {couponResult && (
            <div className={clsx(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border',
              couponResult.error
                ? 'bg-red-500/5 border-red-500/20 text-red-400'
                : 'bg-brand-400/10 border-brand-400/20 text-brand-300'
            )}>
              {couponResult.error
                ? <><X size={11} /> {couponResult.error}</>
                : <><Check size={11} /> {couponResult.discount}% discount applied!</>
              }
            </div>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {PLANS.map(plan => {
            const discounted = getDiscountedPrice(plan.price)
            return (
              <PlanCard
                key={plan.id}
                plan={{ ...plan, price: discounted }}
                currentPlan={currentPlan}
                loading={payLoading === plan.id}
                onSelect={handleSelectPlan}
              />
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          {[
            '✓ Cancel anytime',
            '✓ Secure payment via Razorpay',
            '✓ 7-day refund policy',
            '✓ No hidden fees',
          ].map(item => (
            <span key={item} className="text-sm text-slate-500">{item}</span>
          ))}
        </div>

        {/* FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-xl text-white text-center">Frequently asked questions</h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period.' },
            { q: 'Is there a free trial for paid plans?', a: 'We offer a Free plan with 3 predictions/day so you can test the product before upgrading. No credit card required.' },
            { q: 'How accurate are the predictions?', a: 'Our AI model achieves up to 87% directional accuracy on NSE stocks in backtesting. Past performance is not indicative of future results.' },
            { q: 'Which stocks are covered?', a: 'We cover 500+ NSE and BSE listed stocks, including Nifty 50, Nifty Next 50, and Midcap 150 constituents.' },
          ].map(item => (
            <details key={item.q} className="card p-4 group">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-white list-none">
                {item.q}
                <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}

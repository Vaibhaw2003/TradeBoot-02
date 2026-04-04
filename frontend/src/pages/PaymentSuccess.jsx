import { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Download, LayoutDashboard } from 'lucide-react'
import { Button } from '../components/ui'
import { usePageTitle } from '../hooks'

export default function PaymentSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const { plan, order } = location.state || {}

  usePageTitle('Payment Successful')

  useEffect(() => {
    if (!plan) navigate('/pricing')
  }, [plan])

  if (!plan) return null

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md text-center animate-slide-up space-y-6">
        {/* Success icon */}
        <div className="relative inline-flex">
          <div className="w-24 h-24 rounded-full bg-emerald-400/10 border-2 border-emerald-400/30 flex items-center justify-center mx-auto">
            <CheckCircle size={44} className="text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full bg-emerald-400/5 animate-ping" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl text-white">Payment Successful!</h1>
          <p className="text-slate-400">Your <span className="text-white font-medium capitalize">{plan.name}</span> plan is now active.</p>
        </div>

        {/* Receipt */}
        <div className="glass rounded-2xl border border-white/8 p-5 space-y-3 text-left">
          <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-3">Payment Receipt</h3>
          {[
            { label: 'Plan',        value: plan.name },
            { label: 'Amount',      value: `₹${plan.price?.toLocaleString('en-IN')}` },
            { label: 'Status',      value: 'Paid', color: 'text-emerald-400' },
            { label: 'Order ID',    value: order?.razorpay_order_id || 'TRB-' + Date.now().toString().slice(-8) },
            { label: 'Valid Until', value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{item.label}</span>
              <span className={`font-mono font-medium ${item.color || 'text-white'}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md" className="flex-1 justify-center">
            <Download size={14} /> Download Invoice
          </Button>
          <Button variant="primary" size="md" className="flex-1 justify-center" onClick={() => navigate('/dashboard')}>
            Go to Dashboard <ArrowRight size={14} />
          </Button>
        </div>

        <p className="text-xs text-slate-600">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

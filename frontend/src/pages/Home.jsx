import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import {
  TrendingUp, TrendingDown, Zap, Shield, BarChart2,
  ChevronRight, Star, Check, ArrowRight, Brain,
  LineChart, Target, Lock
} from 'lucide-react'
import { Button, Badge } from '../components/ui'
import { MarketIndexCard } from '../components/StockCard'
import { MARKET_INDICES, MOCK_STOCKS, generatePriceHistory, formatPercent } from '../utils'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function Home() {
  const navigate = useNavigate()
  const priceData = generatePriceHistory(22000, 30, 'up')

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-brand-400/[0.03] blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-3xl pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 pb-28 px-4">
        <div className="max-w-screen-lg mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand-400/20 text-xs text-brand-300 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            AI-Powered • Real-time • Indian Markets
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[1.05] tracking-tight animate-slide-up">
            Predict Stocks<br />
            <span className="text-gradient">Before They Move</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            TradeBoot AI uses advanced machine learning to forecast stock movements
            with up to <span className="text-white font-medium">87% accuracy</span>. Get predictions for
            NSE & BSE stocks in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Start Predicting Free
              <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              See Live Demo
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4 animate-fade-in">
            {[
              { label: 'Accuracy', value: '87%' },
              { label: 'Stocks Covered', value: '500+' },
              { label: 'Active Traders', value: '12,000+' },
              { label: 'Predictions Daily', value: '50K+' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Market Strip */}
      <section className="py-6 border-y border-white/5 bg-slate-900/30">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MARKET_INDICES.map(idx => (
              <MarketIndexCard key={idx.name} {...idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Preview */}
      <section className="py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: description */}
            <div className="space-y-6">
              <Badge variant="brand">Live Dashboard</Badge>
              <h2 className="section-heading">
                Real-time predictions<br />at a glance
              </h2>
              <p className="section-sub">
                Our AI engine processes over 50 technical indicators, news sentiment,
                and historical patterns to deliver precise short-term forecasts.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Brain, label: 'AI-powered price target predictions' },
                  { icon: BarChart2, label: 'RSI, MACD, Bollinger Bands & more' },
                  { icon: Target, label: 'Bullish / Bearish / Neutral signals' },
                  { icon: Shield, label: 'Risk score for each prediction' },
                ].map(item => (
                  <li key={item.label} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-brand-400/10 flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-brand-400" />
                    </div>
                    {item.label}
                  </li>
                ))}
              </ul>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Get Started Free <ArrowRight size={15} />
              </Button>
            </div>

            {/* Right: mock chart card */}
            <div className="card p-5 space-y-4 hover:shadow-glow transition-shadow duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-bold font-mono text-slate-300">T</div>
                    <div>
                      <p className="font-mono font-bold text-white">TCS</p>
                      <p className="text-xs text-slate-500">Tata Consultancy Services</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-xl text-white">₹3,842.50</p>
                  <p className="text-xs text-emerald-400 font-mono">+1.11% ↑</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={priceData.slice(-20)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f5c8" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#00f5c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Area type="monotone" dataKey="close" stroke="#00f5c8" strokeWidth={2} fill="url(#heroGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                {[
                  { label: 'Prediction', value: '₹3,920', color: 'text-brand-400' },
                  { label: 'Confidence', value: '82%', color: 'text-white' },
                  { label: 'Trend', value: 'Bullish ↑', color: 'text-emerald-400' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className={`text-sm font-mono font-semibold mt-0.5 ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-slate-900/20 border-y border-white/[0.03]">
        <div className="max-w-screen-xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="section-heading">Everything you need to trade smarter</h2>
            <p className="section-sub max-w-xl mx-auto">
              From raw predictions to advanced indicators — TradeBoot AI covers your entire analysis workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => (
              <div key={i} className="card p-6 space-y-3 hover:border-brand-400/20 hover:-translate-y-1 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-brand-400/10 border border-brand-400/10 flex items-center justify-center group-hover:bg-brand-400/20 transition-colors">
                  <feat.icon size={18} className="text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-white">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-screen-lg mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="section-heading">Simple, transparent pricing</h2>
            <p className="section-sub">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-200 ${
                plan.popular
                  ? 'bg-gradient-to-b from-amber-400/5 to-transparent border-amber-400/20 shadow-[0_0_40px_rgba(251,191,36,0.06)]'
                  : 'bg-slate-900/60 border-white/5'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold">
                      <Star size={10} fill="currentColor" /> POPULAR
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    {plan.price === 0 ? (
                      <span className="font-display font-bold text-3xl text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-slate-400">₹</span>
                        <span className="font-display font-bold text-3xl text-white">{plan.price.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm">/mo</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${f.ok ? 'text-slate-300' : 'text-slate-600'}`}>
                      {f.ok ? <Check size={13} className="text-brand-400 shrink-0" /> : <span className="w-3.5 shrink-0">—</span>}
                      {f.label}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full justify-center"
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-900/20 border-t border-white/[0.03]">
        <div className="max-w-screen-xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="section-heading">Loved by traders</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-5 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-400/20 flex items-center justify-center text-brand-400 text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6 card-brand p-10 rounded-3xl">
          <h2 className="font-display font-black text-4xl text-white">Ready to predict the market?</h2>
          <p className="text-slate-400">Join 12,000+ traders using AI to stay ahead.</p>
          <Button variant="primary" size="xl" onClick={() => navigate('/register')} className="mx-auto">
            Start for Free — No Card Required
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-400" />
            <span className="font-display font-bold text-white">TradeBoot<span className="text-brand-400">AI</span></span>
          </div>
          <p className="text-xs text-slate-600">
            © 2025 TradeBoot AI. For educational purposes only. Not financial advice.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FEATURES = [
  { icon: Brain,     title: 'AI Predictions',       desc: 'ML models trained on years of NSE/BSE data to predict price movements.' },
  { icon: BarChart2, title: 'Technical Indicators',  desc: 'RSI, MACD, Bollinger Bands, Stochastic and 40+ more indicators.' },
  { icon: TrendingUp,title: 'Trend Analysis',        desc: 'Identify bullish, bearish, and consolidation phases in real time.' },
  { icon: Zap,       title: 'Lightning Fast',        desc: 'Get predictions in under 2 seconds. No waiting, no delays.' },
  { icon: Shield,    title: 'Risk Assessment',       desc: 'Every prediction comes with a risk score and confidence level.' },
  { icon: Lock,      title: 'Secure & Private',      desc: 'Your portfolio data is encrypted and never shared.' },
]

const PRICING_PLANS = [
  {
    name: 'Free', price: 0, cta: 'Get Started',
    features: [
      { label: '3 predictions/day', ok: true },
      { label: '3 portfolio stocks', ok: true },
      { label: 'Basic chart view', ok: true },
      { label: 'Technical indicators', ok: false },
      { label: 'Premium analytics', ok: false },
    ]
  },
  {
    name: 'Basic', price: 499, cta: 'Upgrade to Basic', popular: false,
    features: [
      { label: '20 predictions/day', ok: true },
      { label: '10 portfolio stocks', ok: true },
      { label: 'Advanced charts', ok: true },
      { label: 'All indicators', ok: true },
      { label: 'Premium analytics', ok: false },
    ]
  },
  {
    name: 'Premium', price: 1499, cta: 'Go Premium', popular: true,
    features: [
      { label: 'Unlimited predictions', ok: true },
      { label: 'Unlimited portfolio', ok: true },
      { label: 'Advanced charts', ok: true },
      { label: 'All indicators', ok: true },
      { label: 'Premium analytics + alerts', ok: true },
    ]
  },
]

const TESTIMONIALS = [
  { name: 'Rohan Mehta', role: 'Day Trader, Mumbai', text: 'TradeBoot AI helped me catch a 12% move on TCS before it happened. The prediction was spot on.' },
  { name: 'Priya Sharma', role: 'Retail Investor, Delhi', text: 'The RSI and MACD combined with AI predictions changed how I enter trades completely.' },
  { name: 'Ankit Gupta', role: 'Options Trader, Pune', text: 'Been using it for 3 months. My win rate has gone from 52% to 68%. Highly recommend.' },
]

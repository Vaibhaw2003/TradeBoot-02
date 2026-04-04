import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Divider } from '../../components/ui'
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const PASSWORD_RULES = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p) => /\d/.test(p) },
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'At least 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Account created! Please verify your email.')
      navigate('/verify-otp', { state: { email: form.email } })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, value) => {
    setForm(p => ({ ...p, [key]: value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-400/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-400/30 group-hover:border-brand-400 flex items-center justify-center shadow-glow-sm transition-all text-brand-400">
            <img src="https://4kwallpapers.com/images/walls/thumbs_2t/13781.png" alt="TradeBoot Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Trade<span className="text-brand-400">Boot</span>
            <span className="text-xs font-mono text-slate-500 ml-0.5">AI</span>
          </span>
        </Link>

        <div className="glass rounded-2xl border border-white/8 p-8 shadow-2xl">
          <div className="text-center mb-7">
            <h1 className="font-display font-bold text-2xl text-white">Create your account</h1>
            <p className="text-sm text-slate-400 mt-1">Start predicting stocks for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Rahul Sharma"
              icon={User}
              value={form.name}
              onChange={e => field('name', e.target.value)}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={e => field('email', e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => field('password', e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 bg-slate-800/60 border outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-500/50' : 'border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20'
                  }`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}

              {/* Password strength */}
              {form.password && (
                <div className="flex gap-3 flex-wrap pt-1">
                  {PASSWORD_RULES.map(rule => (
                    <span key={rule.label} className={clsx(
                      'flex items-center gap-1 text-xs transition-colors',
                      rule.test(form.password) ? 'text-emerald-400' : 'text-slate-600'
                    )}>
                      <Check size={10} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={e => field('confirm', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 bg-slate-800/60 border outline-none transition-all ${
                    errors.confirm ? 'border-red-500/50' : 'border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20'
                  }`}
                />
              </div>
              {errors.confirm && <p className="text-xs text-red-400">{errors.confirm}</p>}
            </div>

            <p className="text-xs text-slate-500">
              By creating an account you agree to our{' '}
              <a href="#" className="text-brand-400 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a>.
            </p>

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full justify-center">
              Create Account <ArrowRight size={15} />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

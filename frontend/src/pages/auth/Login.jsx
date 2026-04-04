import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Divider } from '../../components/ui'
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const from = location.state?.from?.pathname || '/dashboard'

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await login({ email: 'demo@tradeboot.ai', password: 'demo1234' })
      toast.success('Logged in as demo user')
      navigate('/dashboard')
    } catch {
      // For demo without backend, simulate auth
      toast.success('Demo mode — exploring as guest')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-400/30 group-hover:border-brand-400 flex items-center justify-center shadow-glow-sm transition-all text-brand-400">
            <img src="https://4kwallpapers.com/images/walls/thumbs_2t/13781.png" alt="TradeBoot Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-2xl text-white">
            Trade<span className="text-brand-400">Boot</span>
            <span className="text-xs font-mono text-slate-500 ml-0.5">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl border border-white/8 p-8 shadow-2xl">
          <div className="text-center mb-7">
            <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your TradeBoot account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 bg-slate-800/60 border outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full justify-center">
              Sign in <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <Divider text="or" />
            <Button variant="outline" size="md" className="w-full justify-center" onClick={handleDemoLogin} disabled={loading}>
              Try Demo Account
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

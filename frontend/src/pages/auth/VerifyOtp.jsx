import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { Button } from '../../components/ui'
import { TrendingUp, Mail, RefreshCw, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const OTP_LENGTH = 6

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
    if (newOtp.every(d => d) && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (paste.length === OTP_LENGTH) {
      const newOtp = paste.split('')
      setOtp(newOtp)
      inputRefs.current[OTP_LENGTH - 1]?.focus()
      handleVerify(paste)
    }
  }

  const handleVerify = async (code) => {
    if (code.length < OTP_LENGTH) return
    setLoading(true)
    try {
      await authService.verifyOtp({ email, otp: code })
      toast.success('Email verified! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Invalid OTP. Please try again.')
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setResending(true)
    try {
      await authService.resendOtp(email)
      toast.success('OTP resent!')
      setCountdown(60)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-64 bg-brand-400/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-400/30 flex items-center justify-center shadow-glow-sm">
            <img src="https://4kwallpapers.com/images/walls/thumbs_2t/13781.png" alt="TradeBoot Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-2xl text-white">Trade<span className="text-brand-400">Boot</span><span className="text-xs font-mono text-slate-500 ml-0.5">AI</span></span>
        </Link>

        <div className="glass rounded-2xl border border-white/8 p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center mx-auto mb-5">
            <Mail size={24} className="text-brand-400" />
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-2">Verify your email</h1>
          <p className="text-sm text-slate-400 mb-1">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-white mb-7">{email || 'your email'}</p>

          {/* OTP inputs */}
          <div className="flex items-center justify-center gap-2 mb-7" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={clsx(
                  'w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border outline-none transition-all duration-200',
                  digit
                    ? 'bg-brand-400/10 border-brand-400/40 text-brand-300'
                    : 'bg-slate-800/60 border-slate-700/50 text-white',
                  'focus:border-brand-400/60 focus:ring-1 focus:ring-brand-400/20',
                  'py-3'
                )}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="md"
            loading={loading}
            onClick={() => handleVerify(otp.join(''))}
            className="w-full justify-center mb-4"
            disabled={otp.join('').length < OTP_LENGTH}
          >
            Verify Email <ArrowRight size={15} />
          </Button>

          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className={clsx(
              'flex items-center gap-2 mx-auto text-sm transition-colors',
              countdown > 0 || resending
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-brand-400 hover:text-brand-300'
            )}
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </button>

          <p className="text-xs text-slate-600 mt-5">
            Wrong email?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300">Go back</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

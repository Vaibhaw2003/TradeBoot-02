import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext(null)

const PLAN_LIMITS = {
  free:    { predictions: 3,  portfolio: 3,  indicators: false, premium_analytics: false },
  basic:   { predictions: 20, portfolio: 10, indicators: true,  premium_analytics: false },
  premium: { predictions: -1, portfolio: -1, indicators: true,  premium_analytics: true  },
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const [usage, setUsage] = useState({ predictions: 0, portfolio: 0 })

  const plan = user?.subscription?.plan || 'free'
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free
  const expiresAt = user?.subscription?.expires_at
  const isActive = !expiresAt || new Date(expiresAt) > new Date()

  const isPremium  = plan === 'premium' && isActive
  const isBasic    = (plan === 'basic' || isPremium) && isActive
  const isFree     = !isBasic

  const canPredict = limits.predictions === -1 || usage.predictions < limits.predictions
  const canAddToPortfolio = limits.portfolio === -1 || usage.portfolio < limits.portfolio
  const hasIndicators = limits.indicators && isActive
  const hasPremiumAnalytics = limits.premium_analytics && isActive

  const usagePercent = (key) => {
    if (limits[key] === -1) return 0
    return Math.min(100, (usage[key] / limits[key]) * 100)
  }

  const incrementUsage = (key) => {
    setUsage(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }))
  }

  useEffect(() => {
    const stored = localStorage.getItem('tb_usage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const today = new Date().toDateString()
      if (parsed.date === today) {
        setUsage(parsed.usage)
      } else {
        localStorage.removeItem('tb_usage')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tb_usage', JSON.stringify({
      date: new Date().toDateString(),
      usage
    }))
  }, [usage])

  return (
    <SubscriptionContext.Provider value={{
      plan, limits, usage, isActive, isPremium, isBasic, isFree,
      canPredict, canAddToPortfolio, hasIndicators, hasPremiumAnalytics,
      usagePercent, incrementUsage, expiresAt
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}

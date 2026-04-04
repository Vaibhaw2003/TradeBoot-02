import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import { Button, Input, Badge, Modal } from '../components/ui'
import { authService } from '../services/authService'
import {
  User, Mail, Phone, Shield, Crown, Zap,
  Edit3, Lock, Bell, LogOut, Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'
import { usePageTitle } from '../hooks'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { plan, expiresAt, limits, usage } = useSubscription()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwdModal, setPwdModal] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  usePageTitle('Profile')

  const planMeta = {
    free:    { icon: User,  color: 'text-slate-400', bg: 'bg-slate-700/50',   badge: 'default' },
    basic:   { icon: Zap,   color: 'text-blue-400',  bg: 'bg-blue-400/10',    badge: 'blue' },
    premium: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10',   badge: 'amber' },
  }
  const meta = planMeta[plan] || planMeta.free

  const handleSave = async () => {
    setLoading(true)
    try {
      await authService.updateProfile(form)
      updateUser(form)
      setEditing(false)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (pwdForm.newPwd !== pwdForm.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await authService.changePassword({ current: pwdForm.current, newPassword: pwdForm.newPwd })
      setPwdModal(false)
      setPwdForm({ current: '', newPwd: '', confirm: '' })
      toast.success('Password changed')
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account and subscription</p>
      </div>

      {/* Avatar + info */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-brand-400/20 border-2 border-brand-400/30 flex items-center justify-center text-brand-400 text-3xl font-bold font-display">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl text-white">{user?.name || 'User'}</h2>
            <Badge variant={meta.badge}>
              <meta.icon size={11} className={meta.color} />
              {plan.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
          <p className="text-xs text-slate-600 mt-1">
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          <Edit3 size={13} /> Edit
        </Button>
      </div>

      {/* Profile Details */}
      {editing ? (
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-white">Edit Profile</h3>
          <Input
            label="Full Name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            icon={User}
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            icon={Phone}
            placeholder="+91 9876543210"
          />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1 justify-center" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 justify-center" loading={loading} onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      ) : (
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Account Details</h3>
          {[
            { icon: User,  label: 'Full Name', value: user?.name || '—' },
            { icon: Mail,  label: 'Email',     value: user?.email || '—' },
            { icon: Phone, label: 'Phone',     value: user?.phone || 'Not set' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Subscription</h3>
          <Button variant="secondary" size="xs" onClick={() => navigate('/pricing')}>Manage</Button>
        </div>

        <div className={clsx('flex items-center gap-3 p-3 rounded-xl', meta.bg)}>
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', meta.bg)}>
            <meta.icon size={20} className={meta.color} />
          </div>
          <div>
            <p className="font-semibold text-white capitalize">{plan} Plan</p>
            <p className="text-xs text-slate-400">
              {expiresAt
                ? `Expires: ${new Date(expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`
                : plan === 'free' ? 'No expiry' : 'Active'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/40 rounded-xl p-3">
            <p className="text-xs text-slate-500">Daily Predictions</p>
            <p className="font-mono font-bold text-white mt-1">
              {usage.predictions} / {limits.predictions === -1 ? '∞' : limits.predictions}
            </p>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3">
            <p className="text-xs text-slate-500">Portfolio Stocks</p>
            <p className="font-mono font-bold text-white mt-1">
              {usage.portfolio} / {limits.portfolio === -1 ? '∞' : limits.portfolio}
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-white text-sm">Security</h3>
        <button
          onClick={() => setPwdModal(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center">
            <Lock size={14} className="text-slate-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Change Password</p>
            <p className="text-xs text-slate-500">Update your account password</p>
          </div>
          <span className="ml-auto text-slate-500">›</span>
        </button>
      </div>

      {/* Danger */}
      <div className="card p-5 space-y-3 border-red-500/10">
        <h3 className="font-semibold text-red-400 text-sm">Danger Zone</h3>
        <Button
          variant="danger"
          size="sm"
          onClick={() => { logout(); navigate('/') }}
        >
          <LogOut size={14} /> Sign Out
        </Button>
      </div>

      {/* Change password modal */}
      <Modal open={pwdModal} onClose={() => setPwdModal(false)} title="Change Password">
        <div className="space-y-4">
          {[
            { label: 'Current Password', key: 'current' },
            { label: 'New Password',     key: 'newPwd' },
            { label: 'Confirm New',      key: 'confirm' },
          ].map(f => (
            <Input
              key={f.key}
              label={f.label}
              type="password"
              icon={Lock}
              value={pwdForm[f.key]}
              onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          ))}
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1 justify-center" onClick={() => setPwdModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 justify-center" loading={loading} onClick={handleChangePassword}>
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

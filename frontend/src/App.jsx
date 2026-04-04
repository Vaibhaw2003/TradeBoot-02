import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { PrivateRoute, AdminRoute, PublicOnlyRoute } from './routes/ProtectedRoutes'

// Layouts
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout     from './components/layout/AdminLayout'

// Public pages
import Home          from './pages/Home'
import Pricing       from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'

// Auth pages
import Login         from './pages/auth/Login'
import Register      from './pages/auth/Register'
import VerifyOtp     from './pages/auth/VerifyOtp'

// Dashboard pages
import Dashboard     from './pages/dashboard/Dashboard'
import Prediction    from './pages/dashboard/Prediction'
import StockDetails  from './pages/dashboard/StockDetails'
import Indicators    from './pages/dashboard/Indicators'
import News          from './pages/dashboard/News'

// Other pages
import Portfolio     from './pages/Portfolio'
import Profile       from './pages/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers     from './pages/admin/Users'
import { AdminPayments, AdminPlans, AdminCoupons } from './pages/admin/AdminPages'

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="font-display font-black text-8xl text-brand-400/20">404</div>
      <div className="space-y-2">
        <h1 className="font-display font-bold text-2xl text-white">Page not found</h1>
        <p className="text-slate-400">The page you're looking for doesn't exist.</p>
      </div>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            {/* Public */}
            <Route path="/"               element={<Home />} />
            <Route path="/pricing"        element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Auth — redirect if already logged in */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
            </Route>

            {/* Protected */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard"                   element={<Dashboard />} />
                <Route path="/dashboard/prediction"        element={<Prediction />} />
                <Route path="/dashboard/stocks"            element={<StockDetails />} />
                <Route path="/dashboard/stocks/:symbol"    element={<StockDetails />} />
                <Route path="/dashboard/indicators"        element={<Indicators />} />
                <Route path="/news"                        element={<News />} />
                <Route path="/portfolio"                   element={<Portfolio />} />
                <Route path="/profile"                     element={<Profile />} />
                <Route path="/settings"                    element={<Profile />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin"           element={<AdminDashboard />} />
                <Route path="/admin/users"     element={<AdminUsers />} />
                <Route path="/admin/payments"  element={<AdminPayments />} />
                <Route path="/admin/plans"     element={<AdminPlans />} />
                <Route path="/admin/coupons"   element={<AdminCoupons />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1520',
                color: '#e2e8f0',
                border: '1px solid rgba(0,245,200,0.15)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                borderRadius: '10px',
              },
              success: {
                iconTheme: { primary: '#00f5c8', secondary: '#0d1520' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#0d1520' },
              },
            }}
          />
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

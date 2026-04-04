# TradeBoot AI 📈

> AI-powered stock market prediction platform — production-ready React frontend

![TradeBoot AI](https://img.shields.io/badge/React-18-61dafb?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Input, Modal, Loader, Badge, etc.
│   ├── charts/       # PriceChart, RSIChart, MACDChart, PredictionGauge
│   ├── layout/       # Navbar, Sidebar, DashboardLayout, AdminLayout
│   ├── StockCard.jsx
│   └── PlanCard.jsx
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Pricing.jsx           # Pricing + coupon
│   ├── PaymentSuccess.jsx
│   ├── Portfolio.jsx
│   ├── Profile.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── VerifyOtp.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Prediction.jsx
│   │   ├── StockDetails.jsx
│   │   └── Indicators.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── Users.jsx
│       └── AdminPages.jsx   # Payments, Plans, Coupons
├── services/
│   ├── api.js               # Axios instance with interceptors
│   ├── authService.js
│   ├── stockService.js
│   ├── predictionService.js
│   ├── paymentService.js
│   ├── userService.js
│   ├── couponService.js
│   └── adminService.js
├── context/
│   ├── AuthContext.jsx
│   └── SubscriptionContext.jsx
├── hooks/
│   └── index.js             # useAsync, useDebounce, useStockSearch, etc.
├── routes/
│   └── ProtectedRoutes.jsx  # PrivateRoute, AdminRoute, PublicOnlyRoute
└── utils/
    └── index.js             # Formatting helpers + mock data
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Brand | `#00f5c8` (teal-green) |
| Background | `#080d14` |
| Surface | `#0d1520` |
| Font Display | Syne |
| Font Body | Outfit |
| Font Mono | DM Mono |

---

## 🔐 Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/verify-otp` | Public | OTP verification |
| `/pricing` | Public | Pricing plans |
| `/dashboard` | Protected | Main dashboard |
| `/dashboard/prediction` | Protected | AI predictions |
| `/dashboard/stocks/:symbol` | Protected | Stock detail |
| `/dashboard/indicators` | Protected | Technical indicators |
| `/portfolio` | Protected | Portfolio tracker |
| `/profile` | Protected | User profile |
| `/admin` | Admin | Admin overview |
| `/admin/users` | Admin | User management |
| `/admin/payments` | Admin | Payment history |
| `/admin/plans` | Admin | Plan management |
| `/admin/coupons` | Admin | Coupon management |

---

## 💡 Key Features

- **Dark-mode by default** — premium SaaS aesthetic
- **Syne + Outfit + DM Mono** font stack for that pro trading feel
- **Recharts** for all charts (Area, Line, Bar, Pie, RSI, MACD)
- **Context API** — AuthContext + SubscriptionContext
- **JWT auth** — token stored in localStorage, auto-attached via Axios interceptor
- **Plan-gated UI** — usage limits enforced client-side with upgrade prompts
- **Razorpay integration** — with order creation + payment verification flow
- **Coupon system** — validate + apply discounts at checkout
- **Admin panel** — users, payments, plans, coupons management
- **Fully responsive** — mobile-first with collapsible sidebar

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend REST API base URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (custom design tokens)
- **React Router DOM v6**
- **Axios** (with request/response interceptors)
- **Recharts** (all charts)
- **React Hot Toast** (notifications)
- **Lucide React** (icons)
- **clsx** (conditional class names)

---

## 🔌 Backend Integration

All services in `src/services/` are pre-wired to `VITE_API_BASE_URL`. Point that to your FastAPI / Node.js / Django backend. Expected endpoints:

- `POST /auth/login` → `{ token, user }`
- `POST /auth/register` → `{ message }`
- `POST /auth/verify-otp` → `{ message }`
- `GET /auth/me` → user object
- `GET /stocks/:symbol/quote` → quote data
- `POST /predictions/predict` → prediction result
- `POST /payments/create-order` → Razorpay order
- `POST /payments/verify` → verify payment
- `POST /coupons/validate` → `{ discount, code }`

---

## 📄 License

MIT — free for personal and commercial use.

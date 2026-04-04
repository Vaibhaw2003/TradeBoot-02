import api from './api'

export const paymentService = {
  createOrder: (planId, couponCode) => api.post('/payments/create-order', { planId, couponCode }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
  getInvoice: (paymentId) => api.get(`/payments/${paymentId}/invoice`),
  cancelSubscription: () => api.post('/payments/cancel'),
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const initiateRazorpayPayment = async (order, user, onSuccess, onError) => {
  const loaded = await loadRazorpay()
  if (!loaded) { onError(new Error('Failed to load payment gateway')); return }
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'TradeBoot AI',
    description: order.description,
    order_id: order.razorpay_order_id,
    prefill: { name: user?.name, email: user?.email, contact: user?.phone },
    theme: { color: '#00f5c8' },
    handler: (response) => onSuccess(response),
  }
  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (res) => onError(new Error(res.error.description)))
  rzp.open()
}

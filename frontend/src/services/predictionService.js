import api from './api'

export const predictionService = {
  predict: (symbol, timeframe = '7d') => api.post('/predictions/predict', { symbol, timeframe }),
  getHistory: (symbol) => api.get(`/predictions/${symbol}/history`),
  getIndicators: (symbol) => api.get(`/predictions/${symbol}/indicators`),
  getAccuracy: (symbol) => api.get(`/predictions/${symbol}/accuracy`),
  getSentiment: (symbol) => api.get(`/predictions/${symbol}/sentiment`),
}

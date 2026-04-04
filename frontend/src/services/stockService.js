import api from './api'

export const stockService = {
  search: (query) => api.get(`/stocks/search?q=${query}`),
  getQuote: (symbol) => api.get(`/stocks/${symbol}/quote`),
  getHistory: (symbol, period = '1mo') => api.get(`/stocks/${symbol}/history?period=${period}`),
  getTopGainers: () => api.get('/stocks/top-gainers'),
  getTopLosers: () => api.get('/stocks/top-losers'),
  getMarketIndex: () => api.get('/stocks/market-index'),
  getWatchlist: () => api.get('/stocks/watchlist'),
  addToWatchlist: (symbol) => api.post('/stocks/watchlist', { symbol }),
  removeFromWatchlist: (symbol) => api.delete(`/stocks/watchlist/${symbol}`),
}

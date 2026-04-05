import api from './api'
import { MOCK_STOCKS, MOCK_MARKET_NEWS, MOCK_INSIGHTS, generatePriceHistory, generateRSIData, generateMACDData } from '../utils'

/**
 * Robust Market API service. 
 * Falls back to sophisticated mock data if the backend is down or unreachable.
 */
export const marketApi = {
  /**
   * GET /api/stocks/search
   */
  async searchStocks(query = '') {
    try {
      const res = await api.get('/stocks/search', { params: { query } })
      return res
    } catch (err) {
      console.warn('[Mock API Fallback] searchStocks')
      return new Promise(resolve => setTimeout(() => {
        const q = query.toLowerCase()
        const filtered = MOCK_STOCKS.filter(s => 
          s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        )
        resolve(filtered)
      }, 300))
    }
  },

  /**
   * GET /api/predict/{symbol}
   */
  async getPrediction(symbol) {
    try {
      const res = await api.get(`/predict/${symbol}`)
      return res
    } catch (err) {
      console.warn(`[Mock API Fallback] getPrediction for ${symbol}`)
      return new Promise((resolve, reject) => setTimeout(() => {
        const stock = MOCK_STOCKS.find(s => s.symbol === symbol)
        if (!stock) return reject(new Error('Stock not found'))
        
        const trend = stock.change >= 0 ? 'bullish' : 'bearish'
        const multiplier = trend === 'bullish' ? 1 + Math.random() * 0.05 : 1 - Math.random() * 0.04
        const targetPrice = stock.price * multiplier
        const confidence = Math.floor(60 + Math.random() * 30)

        // Mock AI Insights specific to this stock
        const insights = MOCK_INSIGHTS[symbol] || [
          { type: trend, text: `AI detects strong ${trend} momentum with high institutional interest.` },
          { type: 'neutral', text: 'Volatility index remains slightly elevated.' }
        ]

        resolve({
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: stock.price,
          targetPrice: +targetPrice.toFixed(2),
          change: +((targetPrice - stock.price) / stock.price * 100).toFixed(2),
          confidence,
          trend,
          timeframe: '7d',
          stopLoss: +(stock.price * (trend === 'bullish' ? 0.96 : 1.04)).toFixed(2),
          support: +(stock.price * 0.97).toFixed(2),
          resistance: +(stock.price * 1.03).toFixed(2),
          risk: confidence > 80 ? 'Low' : confidence > 65 ? 'Medium' : 'High',
          insights,
          signals: [
            { name: 'RSI', value: 45 + Math.random() * 30, status: trend },
            { name: 'MACD', value: (Math.random() - 0.5).toFixed(2), status: trend },
            { name: 'Bollinger', value: '0.6σ', status: trend },
            { name: 'Volume', value: '+12%', status: 'bullish' },
          ],
        })
      }, 500))
    }
  },

  /**
   * GET /api/news
   */
  async getMarketNews() {
    try {
      const res = await api.get('/news')
      return res
    } catch (err) {
      console.warn('[Mock API Fallback] getMarketNews')
      return new Promise(resolve => setTimeout(() => {
        resolve(MOCK_MARKET_NEWS)
      }, 400))
    }
  },

  /**
   * GET /api/indicators/{symbol} (or just chart data)
   */
  async getChartData(symbol, days = 30) {
    try {
      const res = await api.get(`/indicators/${symbol}`, { params: { days } })
      return res
    } catch (err) {
      console.warn(`[Mock API Fallback] getChartData for ${symbol}`)
      return new Promise(resolve => setTimeout(() => {
        const stock = MOCK_STOCKS.find(s => s.symbol === symbol)
        if (!stock) return resolve([])
        const trend = stock.change >= 0 ? 'up' : 'down'
        resolve(generatePriceHistory(stock.price, days, trend))
      }, 300))
    }
  }
}

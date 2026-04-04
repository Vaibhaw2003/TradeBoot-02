import { useState, useEffect } from 'react'
import { marketApi } from '../../services/marketApi'
import { SkeletonCard, Badge, Button } from '../../components/ui'
import { NewsCard } from '../../components/dashboard/AIWidgets'
import { usePageTitle } from '../../hooks'
import { Newspaper, Filter, Search } from 'lucide-react'
import clsx from 'clsx'

export default function News() {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSentiment, setFilterSentiment] = useState('all') // all, positive, negative
  const [filterSector, setFilterSector] = useState('all')

  usePageTitle('AI Market News')

  useEffect(() => {
    async function loadNews() {
      setLoading(true)
      try {
        const data = await marketApi.getMarketNews()
        setNews(data)
      } catch (err) {
        console.error('Failed to fetch news', err)
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  // Derive unique sectors from actual news data
  const availableSectors = ['all', ...Array.from(new Set(news.flatMap(n => n.tags)))]

  // Filter
  const filteredNews = news.filter(item => {
    const matchesSearch = item.headline.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSentiment = filterSentiment === 'all' || item.sentiment === filterSentiment
    const matchesSector = filterSector === 'all' || item.tags.includes(filterSector)
    return matchesSearch && matchesSentiment && matchesSector
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Newspaper size={24} className="text-brand-400" /> AI Market News
          </h1>
          <p className="text-sm text-slate-400 mt-1">Real-time financial news analyzed by AI sentiment.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg text-sm bg-slate-900 border border-slate-800 focus:border-brand-400/50 outline-none text-white w-full sm:w-48"
            />
          </div>
          
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
            {['all', 'positive', 'negative'].map(sent => (
              <button
                key={sent}
                onClick={() => setFilterSentiment(sent)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors',
                  filterSentiment === sent 
                    ? sent === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : sent === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-brand-500/20 text-brand-400'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {sent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={14} className="text-slate-500 shrink-0 mr-1" />
        {availableSectors.map(sector => (
          <button
            key={sector}
            onClick={() => setFilterSector(sector)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
              filterSector === sector
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50'
            )}
          >
            {sector === 'all' ? 'All Sectors' : sector}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <>
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
          </>
        ) : filteredNews.length > 0 ? (
          filteredNews.map(item => (
            <NewsCard key={item.id} news={item} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            <Newspaper size={32} className="mx-auto mb-3 opacity-50" />
            <p>No news articles match your current filters.</p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => {setSearchQuery(''); setFilterSentiment('all'); setFilterSector('all');}}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

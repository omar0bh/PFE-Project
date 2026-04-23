import React, { useState, useEffect } from 'react'
import { getArticles } from '../api'
import { Card, CardHeader, CardBody } from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import { truncate } from '../utils'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({
    category: '',
    source: '',
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await getArticles()
      setArticles(response.data)
    } catch (err) {
      setError('Failed to load articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories and sources for filters
  const categories = [...new Set(articles.map((a) => a.ai_category).filter(Boolean))]
  const sources = [...new Set(articles.map((a) => a.source_name).filter(Boolean))]

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    if (filter.category && article.ai_category !== filter.category) return false
    if (filter.source && article.source_name !== filter.source) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Source</label>
          <select
            value={filter.source}
            onChange={(e) => setFilter({ ...filter, source: e.target.value })}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Sources</option>
            {sources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Analyzed Articles</h4>
          <p className="text-sm text-gray-400 mt-1">
            Technology content collected, summarized and classified automatically.
          </p>
        </CardHeader>
        <CardBody>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Source</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Summary</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 font-medium"
                        >
                          {truncate(article.title, 50)}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{article.source_name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-primary-600/30 text-primary-300 px-2 py-1 rounded text-xs">
                          {article.ai_category || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 max-w-xs">
                        {truncate(article.summary || 'No summary', 40)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">
                          {article.trend_score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {articles.length === 0 ? 'No articles found.' : 'No articles match the selected filters.'}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Articles

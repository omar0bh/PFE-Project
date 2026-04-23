import React, { useState, useEffect } from 'react'
import { getSources, addSource, deleteSource, scrapeSource } from '../api'
import { Card, CardHeader, CardBody } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import { showToast } from '../utils'

const Sources = () => {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [scrapingId, setScrapingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
  })

  useEffect(() => {
    fetchSources()
  }, [])

  const fetchSources = async () => {
    try {
      const response = await getSources()
      setSources(response.data)
    } catch (error) {
      showToast('Failed to load sources', 'danger')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addSource(formData)
      setFormData({ name: '', url: '', category: '' })
      showToast('Source added successfully', 'success')
      fetchSources()
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add source', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (sourceId) => {
    if (!confirm('Are you sure you want to delete this source?')) return
    try {
      await deleteSource(sourceId)
      showToast('Source deleted', 'success')
      fetchSources()
    } catch (error) {
      showToast('Failed to delete source', 'danger')
    }
  }

  const handleScrape = async (sourceId, sourceName) => {
    setScrapingId(sourceId)
    try {
      await scrapeSource(sourceId)
      showToast(`Articles scraped from ${sourceName}`, 'success')
      fetchSources()
    } catch (error) {
      showToast(`Scraping failed for ${sourceName}`, 'danger')
    } finally {
      setScrapingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Source Form */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Add New Source</h4>
          <p className="text-sm text-gray-400 mt-1">Register a technology website to monitor automatically.</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Source Name"
                placeholder="e.g., TechCrunch"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Website URL"
                placeholder="https://example.com"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <Input
                label="Category"
                placeholder="e.g., AI, Blockchain"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Source'}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Sources List */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">All Sources</h4>
          <p className="text-sm text-gray-400 mt-1">Manage registered websites and launch scraping manually.</p>
        </CardHeader>
        <CardBody>
          {loading ? (
            <LoadingSpinner />
          ) : sources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">URL</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((source) => (
                    <tr key={source.id} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{source.name}</td>
                      <td className="py-3 px-4">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 truncate"
                        >
                          {source.url}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {source.category ? (
                          <span className="inline-block bg-primary-600/30 text-primary-300 px-2 py-1 rounded text-xs">
                            {source.category}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleScrape(source.id, source.name)}
                            disabled={scrapingId === source.id}
                          >
                            {scrapingId === source.id ? 'Scraping...' : 'Scrape'}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(source.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No sources added yet.</div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Sources

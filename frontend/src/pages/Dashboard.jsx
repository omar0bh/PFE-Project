import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { getDashboard } from '../api'
import { Card, CardHeader, CardBody } from '../components/Card'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboard()
        setData(response.data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-400 text-center">{error}</div>

  const chartData = data?.chart_data
    ? {
        labels: data.chart_data.labels,
        datasets: [
          {
            data: data.chart_data.values,
            backgroundColor: [
              'rgb(99, 102, 241)',
              'rgb(34, 211, 238)',
              'rgb(139, 92, 246)',
              'rgb(16, 185, 129)',
              'rgb(239, 68, 68)',
              'rgb(245, 158, 11)',
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }
    : null

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="max-w-2xl">
          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
            AI-Powered Monitoring
          </span>
          <h1 className="text-3xl font-bold mb-2">
            Track, analyze and automate tech news in one place
          </h1>
          <p className="text-primary-100">
            TechWatch AI helps you collect articles from technology websites, summarize them with AI,
            classify them automatically and distribute insights using n8n workflows.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🌐" label="Sources" value={data?.sources_count || 0} />
        <StatCard icon="📰" label="Articles" value={data?.articles_count || 0} />
        <StatCard icon="🤖" label="AI Analysis" value="Active" />
        <StatCard icon="⚡" label="Automation" value="n8n Ready" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Settings Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h4 className="text-lg font-semibold text-white">Digest Email</h4>
            <p className="text-sm text-gray-400 mt-1">
              {data?.current_email
                ? `Digests are sent to ${data.current_email}`
                : 'No recipient configured yet.'}
            </p>
          </CardHeader>
          <CardBody>
            <a
              href="/email-settings"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              Configure Email Settings →
            </a>
          </CardBody>
        </Card>

        {/* Chart Card */}
        {chartData && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold text-white">Articles Data</h4>
            </CardHeader>
            <CardBody className="flex items-center justify-center" style={{ height: '220px' }}>
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: 'rgba(255, 255, 255, 0.8)', padding: 10 },
                    },
                  },
                }}
              />
            </CardBody>
          </Card>
        )}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Latest Articles</h4>
          <p className="text-sm text-gray-400 mt-1">Recently collected and analyzed technology content.</p>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Trend Score</th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_articles && data.recent_articles.length > 0 ? (
                  data.recent_articles.map((article) => (
                    <tr key={article.id} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300"
                        >
                          {article.title}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-primary-600/30 text-primary-300 px-2 py-1 rounded text-xs">
                          {article.ai_category || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">
                          {article.trend_score}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-400">
                      No articles available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

const StatCard = ({ icon, label, value }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </CardBody>
  </Card>
)

export default Dashboard

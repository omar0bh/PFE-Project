import React, { useState, useEffect } from 'react'
import { getEmailSettings, saveEmailSettings } from '../api'
import { Card, CardHeader, CardBody } from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import { showToast } from '../utils'

const EmailSettings = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEmailSettings()
  }, [])

  const fetchEmailSettings = async () => {
    try {
      const response = await getEmailSettings()
      setEmail(response.data.current_email || '')
    } catch (error) {
      showToast('Failed to load email settings', 'danger')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.trim()) {
      showToast('Please enter a valid email address', 'danger')
      return
    }

    setSubmitting(true)
    try {
      await saveEmailSettings(email)
      showToast('Recipient email saved successfully', 'success')
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save email', 'danger')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">Recipient Email</h4>
          <p className="text-sm text-gray-400 mt-1">
            This address receives the daily digest from n8n after scraping and AI analysis.
            Website URLs are managed only on the Sources page.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <Input
                label="Digest Recipient"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? 'Saving...' : 'Save Email'}
              </Button>
            </div>
          </form>

          {email && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <p className="text-sm text-gray-400">
                Current configured address: <span className="text-white font-semibold">{email}</span>
              </p>
            </div>
          )}

          {!email && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <p className="text-sm text-gray-400">
                No email saved yet. Add one above before running the automated digest workflow.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-white">How It Works</h4>
        </CardHeader>
        <CardBody>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-primary-400 font-semibold">1.</span>
              <span>Configure your email address here</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-primary-400 font-semibold">2.</span>
              <span>Add technology websites to monitor on the Sources page</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-primary-400 font-semibold">3.</span>
              <span>The system automatically scrapes and analyzes articles</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-primary-400 font-semibold">4.</span>
              <span>n8n workflow sends a daily digest to your email</span>
            </li>
          </ol>
        </CardBody>
      </Card>
    </div>
  )
}

export default EmailSettings

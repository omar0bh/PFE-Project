import React from 'react'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()

  const pageConfig = {
    '/': { title: 'Dashboard', subtitle: 'Professional technology monitoring platform powered by AI.' },
    '/sources': { title: 'Sources Management', subtitle: 'Register and manage technology websites to monitor.' },
    '/articles': { title: 'Articles Analysis', subtitle: 'Technology content collected, summarized and classified automatically.' },
    '/email-settings': { title: 'Email Settings', subtitle: 'Configure your digest delivery preferences.' },
  }

  const config = pageConfig[location.pathname] || pageConfig['/']

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-1">{config.title}</h2>
      <p className="text-gray-400">{config.subtitle}</p>
    </header>
  )
}

export default Header

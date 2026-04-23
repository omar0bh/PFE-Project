import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Sources', href: '/sources', icon: '🌐' },
    { label: 'Articles', href: '/articles', icon: '📰' },
    { label: 'Email Settings', href: '/email-settings', icon: '⚙️' },
  ]

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 fixed left-0 top-0 h-screen overflow-y-auto flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <div>
            <h4 className="text-white font-bold">TechWatch AI</h4>
            <p className="text-xs text-gray-400">Smart Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-dark-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700 text-xs text-gray-400">
        <p>© 2024 TechWatch AI</p>
        <p>Powered by AI & n8n</p>
      </div>
    </aside>
  )
}

export default Sidebar

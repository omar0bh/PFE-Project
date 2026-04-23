import React from 'react'

const Card = ({ children, className = '' }) => (
  <div className={`bg-dark-800 rounded-lg border border-dark-700 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-dark-700 ${className}`}>
    {children}
  </div>
)

const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

export { Card, CardHeader, CardBody }

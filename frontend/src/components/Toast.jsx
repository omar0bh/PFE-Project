import React from 'react'

const Toast = ({ message, type }) => {
  const bgColor = {
    success: 'bg-green-500',
    danger: 'bg-red-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type] || 'bg-gray-500'

  return (
    <div
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up pointer-events-auto`}
      style={{
        animation: 'slideInUp 0.3s ease-out',
      }}
    >
      {message}
    </div>
  )
}

export default Toast

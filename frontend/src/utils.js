export const showToast = (message, type = 'success') => {
  const event = new CustomEvent('toast', {
    detail: { message, type }
  })
  window.dispatchEvent(event)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

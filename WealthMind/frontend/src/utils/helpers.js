// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format percentage
export const formatPercentage = (value) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Format number with Indian numbering system
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Get color based on profit/loss
export const getProfitColor = (value) => {
  return value >= 0 ? 'text-success' : 'text-danger'
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

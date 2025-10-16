export function formatNumber(value: number, decimals = 0): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatPercent(value: number, decimals = 0): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatFileSize(bytes: number, decimals = 2): string {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) {
    throw new Error('Invalid bytes value provided')
  }

  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = sizes[i]

  if (!size) {
    throw new Error('File size too large')
  }

  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${size}`
}

export function formatCompactNumber(value: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value)
}

export function roundNumber(value: number, decimals: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  if (typeof decimals !== 'number' || decimals < 0) {
    throw new Error('Decimals must be a positive number')
  }

  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

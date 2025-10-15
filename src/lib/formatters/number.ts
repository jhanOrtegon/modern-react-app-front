/**
 * Utilidades para formatear números y monedas
 */

/**
 * Formatea un número con separadores de miles
 * @param value - Número a formatear
 * @param decimals - Número de decimales (por defecto 0)
 * @returns Número formateado
 * @example formatNumber(1234567.89) // "1,234,568"
 * @example formatNumber(1234567.89, 2) // "1,234,567.89"
 */
export function formatNumber(value: number, decimals = 0): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formatea un número como moneda
 * @param value - Valor a formatear
 * @param currency - Código de moneda ISO (por defecto 'USD')
 * @returns Valor formateado como moneda
 * @example formatCurrency(1234.56) // "$1,234.56"
 * @example formatCurrency(1234.56, 'EUR') // "€1,234.56"
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('Invalid number provided')
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Formatea un número como porcentaje
 * @param value - Valor a formatear (0-1)
 * @param decimals - Número de decimales (por defecto 0)
 * @returns Valor formateado como porcentaje
 * @example formatPercent(0.1234) // "12%"
 * @example formatPercent(0.1234, 2) // "12.34%"
 */
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

/**
 * Formatea un tamaño de archivo en formato legible
 * @param bytes - Tamaño en bytes
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Tamaño formateado
 * @example formatFileSize(1024) // "1.00 KB"
 * @example formatFileSize(1048576) // "1.00 MB"
 */
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

/**
 * Formatea un número grande con notación compacta
 * @param value - Número a formatear
 * @returns Número formateado
 * @example formatCompactNumber(1234567) // "1.2M"
 * @example formatCompactNumber(1234) // "1.2K"
 */
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

/**
 * Redondea un número a los decimales especificados
 * @param value - Número a redondear
 * @param decimals - Número de decimales
 * @returns Número redondeado
 * @example roundNumber(1.2345, 2) // 1.23
 */
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

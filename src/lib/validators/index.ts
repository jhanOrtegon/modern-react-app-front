/**
 * Utilidades para validación
 */

/**
 * Valida si un email es válido
 * @param email - Email a validar
 * @returns true si es válido, false en caso contrario
 * @example isValidEmail("test@example.com") // true
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida si una URL es válida
 * @param url - URL a validar
 * @returns true si es válida, false en caso contrario
 * @example isValidUrl("https://example.com") // true
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') {
    return false
  }

  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Valida si un teléfono es válido (formato internacional)
 * @param phone - Teléfono a validar
 * @returns true si es válido, false en caso contrario
 * @example isValidPhone("+1234567890") // true
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== 'string') {
    return false
  }

  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Valida si un string está vacío o solo contiene espacios
 * @param str - String a validar
 * @returns true si está vacío, false en caso contrario
 * @example isEmpty("   ") // true
 */
export function isEmpty(str: string): boolean {
  if (typeof str !== 'string') {
    return true
  }

  return str.trim().length === 0
}

/**
 * Valida si un valor es un número válido
 * @param value - Valor a validar
 * @returns true si es un número válido, false en caso contrario
 * @example isValidNumber(123) // true
 */
export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
  )
}

/**
 * Valida si una fecha es válida
 * @param date - Fecha a validar
 * @returns true si es válida, false en caso contrario
 * @example isValidDate(new Date()) // true
 */
export function isValidDate(date: unknown): boolean {
  if (!(date instanceof Date)) {
    return false
  }

  return !Number.isNaN(date.getTime())
}

/**
 * Valida si un string tiene una longitud mínima
 * @param str - String a validar
 * @param minLength - Longitud mínima
 * @returns true si cumple, false en caso contrario
 * @example hasMinLength("hello", 3) // true
 */
export function hasMinLength(str: string, minLength: number): boolean {
  if (typeof str !== 'string' || typeof minLength !== 'number') {
    return false
  }

  return str.length >= minLength
}

/**
 * Valida si un string tiene una longitud máxima
 * @param str - String a validar
 * @param maxLength - Longitud máxima
 * @returns true si cumple, false en caso contrario
 * @example hasMaxLength("hello", 10) // true
 */
export function hasMaxLength(str: string, maxLength: number): boolean {
  if (typeof str !== 'string' || typeof maxLength !== 'number') {
    return false
  }

  return str.length <= maxLength
}

/**
 * Valida si un valor está en un rango
 * @param value - Valor a validar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns true si está en el rango, false en caso contrario
 * @example isInRange(5, 1, 10) // true
 */
export function isInRange(value: number, min: number, max: number): boolean {
  if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
    return false
  }

  return value >= min && value <= max
}

/**
 * Valida si un string contiene solo letras
 * @param str - String a validar
 * @returns true si contiene solo letras, false en caso contrario
 * @example isAlpha("hello") // true
 */
export function isAlpha(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^[a-zA-Z]+$/.test(str)
}

/**
 * Valida si un string contiene solo números
 * @param str - String a validar
 * @returns true si contiene solo números, false en caso contrario
 * @example isNumeric("12345") // true
 */
export function isNumeric(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^\d+$/.test(str)
}

/**
 * Valida si un string contiene solo letras y números
 * @param str - String a validar
 * @returns true si contiene solo letras y números, false en caso contrario
 * @example isAlphanumeric("hello123") // true
 */
export function isAlphanumeric(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^[a-zA-Z0-9]+$/.test(str)
}

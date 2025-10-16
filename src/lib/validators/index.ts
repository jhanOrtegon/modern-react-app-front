export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

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

export function isValidPhone(phone: string): boolean {
  if (typeof phone !== 'string') {
    return false
  }

  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

export function isEmpty(str: string): boolean {
  if (typeof str !== 'string') {
    return true
  }

  return str.trim().length === 0
}

export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
  )
}

export function isValidDate(date: unknown): boolean {
  if (!(date instanceof Date)) {
    return false
  }

  return !Number.isNaN(date.getTime())
}

export function hasMinLength(str: string, minLength: number): boolean {
  if (typeof str !== 'string' || typeof minLength !== 'number') {
    return false
  }

  return str.length >= minLength
}

export function hasMaxLength(str: string, maxLength: number): boolean {
  if (typeof str !== 'string' || typeof maxLength !== 'number') {
    return false
  }

  return str.length <= maxLength
}

export function isInRange(value: number, min: number, max: number): boolean {
  if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
    return false
  }

  return value >= min && value <= max
}

export function isAlpha(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^[a-zA-Z]+$/.test(str)
}

export function isNumeric(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^\d+$/.test(str)
}

export function isAlphanumeric(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  }

  return /^[a-zA-Z0-9]+$/.test(str)
}

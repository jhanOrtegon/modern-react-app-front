export function capitalize(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  if (str.length === 0) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('maxLength must be a positive number')
  }

  if (str.length <= maxLength) {
    return str
  }

  return str.slice(0, maxLength - suffix.length) + suffix
}

export function slugify(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function trimString(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str.trim()
}

export function toCamelCase(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_: string, chr: string) => chr.toUpperCase())
}

export function toSnakeCase(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/\s+/g, '_')
}

export function getInitials(name: string, maxInitials = 2): string {
  if (typeof name !== 'string') {
    throw new Error('Invalid string provided')
  }

  return name
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, maxInitials)
    .map(word => word[0]?.toUpperCase())
    .join('')
}

export function maskString(
  str: string,
  start: number,
  end: number,
  mask = '*'
): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  if (start < 0 || end > str.length || start >= end) {
    throw new Error('Invalid start or end position')
  }

  return str.slice(0, start) + mask.repeat(end - start) + str.slice(end)
}

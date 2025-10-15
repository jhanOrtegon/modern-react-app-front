/**
 * Utilidades para formatear y manipular strings
 */

/**
 * Capitaliza la primera letra de un string
 * @param str - String a capitalizar
 * @returns String capitalizado
 * @example capitalize("hello world") // "Hello world"
 */
export function capitalize(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  if (str.length === 0) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitaliza cada palabra de un string
 * @param str - String a capitalizar
 * @returns String con cada palabra capitalizada
 * @example capitalizeWords("hello world") // "Hello World"
 */
export function capitalizeWords(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Trunca un string a una longitud máxima
 * @param str - String a truncar
 * @param maxLength - Longitud máxima
 * @param suffix - Sufijo a agregar (por defecto "...")
 * @returns String truncado
 * @example truncate("Hello World", 8) // "Hello..."
 */
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

/**
 * Convierte un string a slug (URL-friendly)
 * @param str - String a convertir
 * @returns String en formato slug
 * @example slugify("Hello World!") // "hello-world"
 */
export function slugify(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '') // Remueve acentos
    .replace(/[^\w\s-]/g, '') // Remueve caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Remueve guiones duplicados
    .replace(/^-+|-+$/g, '') // Remueve guiones al inicio y final
}

/**
 * Elimina los espacios en blanco al inicio y final de un string
 * @param str - String a limpiar
 * @returns String sin espacios
 * @example trimString("  hello  ") // "hello"
 */
export function trimString(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str.trim()
}

/**
 * Convierte un string a camelCase
 * @param str - String a convertir
 * @returns String en camelCase
 * @example toCamelCase("hello world") // "helloWorld"
 */
export function toCamelCase(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Invalid string provided')
  }

  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_: string, chr: string) => chr.toUpperCase())
}

/**
 * Convierte un string a snake_case
 * @param str - String a convertir
 * @returns String en snake_case
 * @example toSnakeCase("helloWorld") // "hello_world"
 */
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

/**
 * Extrae las iniciales de un nombre
 * @param name - Nombre completo
 * @param maxInitials - Número máximo de iniciales (por defecto 2)
 * @returns Iniciales
 * @example getInitials("John Doe") // "JD"
 */
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

/**
 * Enmascara una parte de un string
 * @param str - String a enmascarar
 * @param start - Posición de inicio
 * @param end - Posición final
 * @param mask - Carácter de máscara (por defecto "*")
 * @returns String enmascarado
 * @example maskString("1234567890", 4, 8) // "1234****90"
 */
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

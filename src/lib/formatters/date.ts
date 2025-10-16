export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
  const diff = dateObj.getTime() - Date.now()
  const absDiff = Math.abs(diff)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (absDiff < minute) {
    return rtf.format(Math.round(diff / 1000), 'seconds')
  } else if (absDiff < hour) {
    return rtf.format(Math.round(diff / minute), 'minutes')
  } else if (absDiff < day) {
    return rtf.format(Math.round(diff / hour), 'hours')
  } else if (absDiff < week) {
    return rtf.format(Math.round(diff / day), 'days')
  } else if (absDiff < month) {
    return rtf.format(Math.round(diff / week), 'weeks')
  } else if (absDiff < year) {
    return rtf.format(Math.round(diff / month), 'months')
  }

  return rtf.format(Math.round(diff / year), 'years')
}

export function formatLongDate(date: Date | string | number): string {
  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided')
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

export function getDaysDifference(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    throw new Error('Invalid date provided')
  }

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

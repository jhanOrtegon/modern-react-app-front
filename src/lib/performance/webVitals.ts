import { logger } from '../logger'

import type { Metric } from 'web-vitals'

function handleMetric(metric: Metric): void {
  const { name, value, rating, navigationType } = metric

  logger.info('Web Vital metric captured', {
    metric: name,
    value: Math.round(value),
    rating,
    navigationType,
    timestamp: new Date().toISOString(),
  })

  if (import.meta.env.PROD) {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = window.gtag as (
        command: string,
        eventName: string,
        params: Record<string, unknown>
      ) => void
      gtag('event', name, {
        value: Math.round(value),
        metric_rating: rating,
        metric_navigation_type: navigationType,
        non_interaction: true,
      })
    }

    if (typeof window !== 'undefined' && 'dataLayer' in window) {
      const dataLayer = window.dataLayer as Array<Record<string, unknown>>
      dataLayer.push({
        event: 'web_vitals',
        metric_name: name,
        metric_value: Math.round(value),
        metric_rating: rating,
      })
    }
  }

  if (import.meta.env.DEV && rating === 'poor') {
    logger.warn(
      `⚠️ Poor Web Vital: ${name} = ${Math.round(value)}ms (rating: ${rating})`
    )
  }
}

export async function reportWebVitals(): Promise<void> {
  const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals')

  onCLS(handleMetric)
  onFCP(handleMetric)
  onLCP(handleMetric)
  onTTFB(handleMetric)
  onINP(handleMetric)

  logger.info('Web Vitals monitoring initialized', {
    environment: import.meta.env.MODE,
  })
}

export const performanceMetrics = {
  measure<T>(name: string, fn: () => T): T {
    const startTime = performance.now()

    try {
      const result = fn()
      const duration = performance.now() - startTime

      logger.info('Performance measurement', {
        operation: name,
        duration: Math.round(duration),
        unit: 'ms',
      })

      return result
    } catch (error) {
      const duration = performance.now() - startTime

      logger.error(
        'Performance measurement failed',
        error instanceof Error ? error : new Error(String(error)),
        {
          operation: name,
          duration: Math.round(duration),
          unit: 'ms',
        }
      )

      throw error
    }
  },

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now()

    try {
      const result = await fn()
      const duration = performance.now() - startTime

      logger.info('Async performance measurement', {
        operation: name,
        duration: Math.round(duration),
        unit: 'ms',
      })

      return result
    } catch (error) {
      const duration = performance.now() - startTime

      logger.error(
        'Async performance measurement failed',
        error instanceof Error ? error : new Error(String(error)),
        {
          operation: name,
          duration: Math.round(duration),
          unit: 'ms',
        }
      )

      throw error
    }
  },

  mark(name: string): void {
    performance.mark(name)
    logger.info('Performance mark', { mark: name })
  },

  measureBetweenMarks(
    measureName: string,
    startMark: string,
    endMark: string
  ): void {
    try {
      performance.measure(measureName, startMark, endMark)
      const [measure] = performance.getEntriesByName(measureName)

      if (measure) {
        logger.info('Performance measure between marks', {
          measure: measureName,
          startMark,
          endMark,
          duration: Math.round(measure.duration),
          unit: 'ms',
        })
      }
    } catch (error) {
      logger.error(
        'Failed to measure between marks',
        error instanceof Error ? error : new Error(String(error)),
        {
          measure: measureName,
          startMark,
          endMark,
        }
      )
    }
  },
}

import { logger } from '../logger'

import type { Metric } from 'web-vitals'

/**
 * Performance Monitoring con Web Vitals
 *
 * Métricas capturadas:
 * - CLS (Cumulative Layout Shift): Estabilidad visual
 * - FID (First Input Delay): Interactividad
 * - FCP (First Contentful Paint): Velocidad de carga inicial
 * - LCP (Largest Contentful Paint): Velocidad de carga principal
 * - TTFB (Time to First Byte): Velocidad del servidor
 * - INP (Interaction to Next Paint): Nueva métrica de interactividad
 *
 * Google recomienda:
 * - CLS: < 0.1 (good), < 0.25 (needs improvement), >= 0.25 (poor)
 * - FID: < 100ms (good), < 300ms (needs improvement), >= 300ms (poor)
 * - FCP: < 1.8s (good), < 3s (needs improvement), >= 3s (poor)
 * - LCP: < 2.5s (good), < 4s (needs improvement), >= 4s (poor)
 * - TTFB: < 800ms (good), < 1800ms (needs improvement), >= 1800ms (poor)
 * - INP: < 200ms (good), < 500ms (needs improvement), >= 500ms (poor)
 */

/**
 * Callback para manejar métricas de Web Vitals
 */
function handleMetric(metric: Metric): void {
  const { name, value, rating, navigationType } = metric

  // Log estructurado de la métrica
  logger.info('Web Vital metric captured', {
    metric: name,
    value: Math.round(value),
    rating,
    navigationType,
    timestamp: new Date().toISOString(),
  })

  // En producción, enviarías esto a tu servicio de analytics
  // Ejemplos: Google Analytics, Sentry, LogRocket, DataDog, etc.
  if (import.meta.env.PROD) {
    // Ejemplo con Google Analytics 4
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

    // Ejemplo con dataLayer (Google Tag Manager)
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

  // En desarrollo, mostrar warning si la métrica es "poor"
  if (import.meta.env.DEV && rating === 'poor') {
    // eslint-disable-next-line no-console
    console.warn(
      `⚠️ Poor Web Vital: ${name} = ${Math.round(value)}ms (rating: ${rating})`
    )
  }
}

/**
 * Inicializa el monitoreo de Web Vitals
 * Debe llamarse una vez en main.tsx
 */
export async function reportWebVitals(): Promise<void> {
  // Dynamic import para code splitting
  const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals')

  // Capturar todas las métricas
  onCLS(handleMetric) // Cumulative Layout Shift
  onFCP(handleMetric) // First Contentful Paint
  onLCP(handleMetric) // Largest Contentful Paint
  onTTFB(handleMetric) // Time to First Byte
  onINP(handleMetric) // Interaction to Next Paint

  logger.info('Web Vitals monitoring initialized', {
    environment: import.meta.env.MODE,
  })
}

/**
 * Métricas personalizadas para operaciones específicas
 */
export const performanceMetrics = {
  /**
   * Medir tiempo de una operación
   */
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

  /**
   * Medir tiempo de una operación async
   */
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

  /**
   * Marcar un momento específico en el tiempo
   */
  mark(name: string): void {
    performance.mark(name)
    logger.info('Performance mark', { mark: name })
  },

  /**
   * Medir entre dos marcas
   */
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

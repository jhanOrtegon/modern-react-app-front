/**
 * Result Pattern - Manejo de errores explícito y type-safe
 *
 * En lugar de usar try/catch (manejo implícito), usamos Result para:
 * - Hacer los errores explícitos en la firma del método
 * - Forzar al llamador a manejar ambos casos (éxito y error)
 * - Type-safety completo (TypeScript sabe qué propiedades existen)
 * - Evitar throws no documentados
 *
 * Ejemplo:
 * ```typescript
 * const result = await createPostUseCase.execute(dto)
 *
 * if (result.success) {
 *   // TypeScript sabe que result.data existe
 *   console.log(result.data.id)
 * } else {
 *   // TypeScript sabe que result.error existe
 *   console.error(result.error.message)
 * }
 * ```
 */

/**
 * Tipo Result genérico
 * @template T Tipo de datos en caso de éxito
 * @template E Tipo de error (por defecto Error)
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Helper para crear un Result exitoso
 */
export const ok = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
})

/**
 * Helper para crear un Result con error
 */
export const err = <E extends Error>(error: E): Result<never, E> => ({
  success: false,
  error,
})

/**
 * Type guard para verificar si es éxito
 */
export const isOk = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => result.success

/**
 * Type guard para verificar si es error
 */
export const isErr = <T, E>(
  result: Result<T, E>
): result is { success: false; error: E } => !result.success

/**
 * Ejecuta una función async y retorna Result
 * Útil para convertir código que lanza excepciones a Result Pattern
 */
export const tryAsync = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
  try {
    const data = await fn()
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Ejecuta una función sync y retorna Result
 */
export const trySync = <T>(fn: () => T): Result<T> => {
  try {
    const data = fn()
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Map sobre Result (solo si es success)
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  if (result.success) {
    return ok(fn(result.data))
  }
  return result
}

/**
 * FlatMap sobre Result (evita Result<Result<T>>)
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  if (result.success) {
    return fn(result.data)
  }
  return result
}

/**
 * Unwrap - obtiene el valor o lanza el error
 * Úsalo solo cuando estés 100% seguro que será success
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data
  }
  throw new Error(
    result.error instanceof Error ? result.error.message : String(result.error)
  )
}

/**
 * UnwrapOr - obtiene el valor o retorna un default
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (result.success) {
    return result.data
  }
  return defaultValue
}

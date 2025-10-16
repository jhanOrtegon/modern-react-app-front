export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

export const ok = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
})

export const err = <E extends Error>(error: E): Result<never, E> => ({
  success: false,
  error,
})

export const isOk = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => result.success

export const isErr = <T, E>(
  result: Result<T, E>
): result is { success: false; error: E } => !result.success

export const tryAsync = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
  try {
    const data = await fn()
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

export const trySync = <T>(fn: () => T): Result<T> => {
  try {
    const data = fn()
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  if (result.success) {
    return ok(fn(result.data))
  }
  return result
}

export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  if (result.success) {
    return fn(result.data)
  }
  return result
}

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data
  }
  throw new Error(
    result.error instanceof Error ? result.error.message : String(result.error)
  )
}

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (result.success) {
    return result.data
  }
  return defaultValue
}

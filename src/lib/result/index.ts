/**
 * Barrel export para Result Pattern
 */
export type { Result } from './Result'
export {
  ok,
  err,
  isOk,
  isErr,
  tryAsync,
  trySync,
  map,
  flatMap,
  unwrap,
  unwrapOr,
} from './Result'

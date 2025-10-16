import { ValidationError } from '@/lib/errors'

import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'

/**
 * Reglas de validación de negocio para Posts
 *
 * Esta clase contiene todas las validaciones relacionadas con la entidad Post,
 * separada de la definición de la entidad para mejor organización y mantenibilidad.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PostValidator {
  private static readonly MAX_TITLE_LENGTH = 200
  private static readonly MAX_BODY_LENGTH = 5000
  private static readonly MIN_TITLE_LENGTH = 1
  private static readonly MIN_BODY_LENGTH = 1

  /**
   * Valida un post completo
   */
  static validate(post: Post | CreatePostDto | UpdatePostDto): void {
    this.validateTitle(post.title)
    this.validateBody(post.body)
    this.validateUserId(post.userId)
    this.validateAccountId(post.accountId)
  }

  /**
   * Valida el título del post
   */
  static validateTitle(title: string): void {
    const trimmedTitle = title.trim()

    if (trimmedTitle.length === 0) {
      throw new ValidationError('El título no puede estar vacío', 'title')
    }

    if (trimmedTitle.length < this.MIN_TITLE_LENGTH) {
      throw new ValidationError(
        `El título debe tener al menos ${this.MIN_TITLE_LENGTH} carácter`,
        'title'
      )
    }

    if (title.length > this.MAX_TITLE_LENGTH) {
      throw new ValidationError(
        `El título no puede exceder ${this.MAX_TITLE_LENGTH} caracteres`,
        'title'
      )
    }
  }

  /**
   * Valida el contenido del post
   */
  static validateBody(body: string): void {
    const trimmedBody = body.trim()

    if (trimmedBody.length === 0) {
      throw new ValidationError('El contenido no puede estar vacío', 'body')
    }

    if (trimmedBody.length < this.MIN_BODY_LENGTH) {
      throw new ValidationError(
        `El contenido debe tener al menos ${this.MIN_BODY_LENGTH} carácter`,
        'body'
      )
    }

    if (body.length > this.MAX_BODY_LENGTH) {
      throw new ValidationError(
        `El contenido no puede exceder ${this.MAX_BODY_LENGTH} caracteres`,
        'body'
      )
    }
  }

  /**
   * Valida el userId
   */
  static validateUserId(userId: number): void {
    if (!userId || userId <= 0) {
      throw new ValidationError(
        'El userId debe ser un número mayor a 0',
        'userId'
      )
    }
  }

  /**
   * Valida el accountId
   */
  static validateAccountId(accountId: number): void {
    if (!accountId || accountId <= 0) {
      throw new ValidationError(
        'El accountId debe ser un número mayor a 0',
        'accountId'
      )
    }
  }
}

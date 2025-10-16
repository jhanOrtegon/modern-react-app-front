import { ValidationError } from '@/lib/errors'

import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'

const MAX_TITLE_LENGTH = 200
const MAX_BODY_LENGTH = 5000
const MIN_TITLE_LENGTH = 1
const MIN_BODY_LENGTH = 1

function validateTitle(title: string): void {
  const trimmedTitle = title.trim()

  if (trimmedTitle.length === 0) {
    throw new ValidationError('El título no puede estar vacío', 'title')
  }

  if (trimmedTitle.length < MIN_TITLE_LENGTH) {
    throw new ValidationError(
      `El título debe tener al menos ${MIN_TITLE_LENGTH} carácter`,
      'title'
    )
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(
      `El título no puede exceder ${MAX_TITLE_LENGTH} caracteres`,
      'title'
    )
  }
}

function validateBody(body: string): void {
  const trimmedBody = body.trim()

  if (trimmedBody.length === 0) {
    throw new ValidationError('El contenido no puede estar vacío', 'body')
  }

  if (trimmedBody.length < MIN_BODY_LENGTH) {
    throw new ValidationError(
      `El contenido debe tener al menos ${MIN_BODY_LENGTH} carácter`,
      'body'
    )
  }

  if (body.length > MAX_BODY_LENGTH) {
    throw new ValidationError(
      `El contenido no puede exceder ${MAX_BODY_LENGTH} caracteres`,
      'body'
    )
  }
}

function validateUserId(userId: number): void {
  if (!userId || userId <= 0) {
    throw new ValidationError(
      'El userId debe ser un número mayor a 0',
      'userId'
    )
  }
}

function validateAccountId(accountId: number): void {
  if (!accountId || accountId <= 0) {
    throw new ValidationError(
      'El accountId debe ser un número mayor a 0',
      'accountId'
    )
  }
}

function validate(post: Post | CreatePostDto | UpdatePostDto): void {
  validateTitle(post.title)
  validateBody(post.body)
  validateUserId(post.userId)
  validateAccountId(post.accountId)
}

export const PostValidator = {
  validate,
  validateTitle,
  validateBody,
  validateUserId,
  validateAccountId,
}
